import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, KEY_MAP, isConfigured } from './supabase.js'

// Cache global em memória
const memCache = {}
const loadingPromises = {}

export function useSupabaseState(localKey, initialValue) {
  const mapping = KEY_MAP[localKey]

  const [data, setData] = useState(() => {
    if (memCache[localKey] !== undefined) return memCache[localKey]
    if (!isConfigured || !mapping) {
      try {
        const s = localStorage.getItem(localKey)
        if (s) return JSON.parse(s)
      } catch {}
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  const [loading, setLoading] = useState(isConfigured && !!mapping)
  const isMounted = useRef(true)
  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false } }, [])

  // Fetch inicial + Realtime subscription
  useEffect(() => {
    if (!isConfigured || !mapping) { setLoading(false); return }

    // Fetch inicial
    if (memCache[localKey] === undefined) {
      if (!loadingPromises[localKey]) {
        loadingPromises[localKey] = fetchData(localKey, mapping)
          .then(result => { memCache[localKey] = result; return result })
          .catch(err => {
            console.error(`[SiRH77] Erro ao carregar ${localKey}:`, err)
            // Fallback: try localStorage before using initialValue
            try {
              const s = localStorage.getItem(localKey)
              if (s) {
                const parsed = JSON.parse(s)
                memCache[localKey] = parsed
                return parsed
              }
            } catch {}
            const fallback = typeof initialValue === 'function' ? initialValue() : initialValue
            memCache[localKey] = fallback
            return fallback
          })
      }
      loadingPromises[localKey].then(result => {
        if (isMounted.current) { setData(result); setLoading(false) }
      })
    } else {
      setData(memCache[localKey])
      setLoading(false)
    }

    // Realtime: escuta mudanças no banco e atualiza automaticamente
    if (mapping.type === 'config' || mapping.type === 'list') return

    let channel
    try {
      channel = supabase
        .channel(`realtime-${localKey}-${Date.now()}`)
        .on('postgres_changes',
          { event: '*', schema: 'public', table: mapping.table },
          async () => {
            delete memCache[localKey]
            delete loadingPromises[localKey]
            const result = await fetchData(localKey, mapping)
            memCache[localKey] = result
            if (isMounted.current) setData(result)
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.warn(`[SiRH77] Realtime não disponível para ${mapping.table} — usando polling`)
          }
        })
    } catch(err) {
      console.warn(`[SiRH77] Realtime erro:`, err)
    }

    return () => { if (channel) supabase.removeChannel(channel) }
  }, [localKey])

  // Setter que sincroniza com Supabase
  const setDataWithSync = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      memCache[localKey] = next
      try { localStorage.setItem(localKey, JSON.stringify(next)) } catch {}
      if (isConfigured && mapping) {
        syncData(localKey, mapping, prev, next).catch(err =>
          console.error(`[SiRH77] Erro ao salvar ${localKey}:`, err)
        )
      }
      return next
    })
  }, [localKey, mapping])

  return [data, setDataWithSync, loading]
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchData(localKey, mapping) {
  if (!supabase) return null

  if (mapping.type === 'config') {
    const { data } = await supabase.from('config').select('value').eq('key', mapping.key)
    return data?.[0]?.value ?? null
  }

  if (mapping.type === 'list') {
    const { data } = await supabase.from(mapping.table).select('*')
    return (data || []).map(r => r.name || r.data?.name).filter(Boolean)
  }

  const { data, error } = await supabase.from(mapping.table).select('*')
  if (error) throw error
  // Supabase returns bigint IDs as strings — normalize to number to match local state
  return (data || []).map(r => ({ ...r.data, id: Number(r.id) }))
}

// ─── Sync ─────────────────────────────────────────────────────────────────────
async function syncData(localKey, mapping, prev, next) {
  if (!supabase) return

  if (mapping.type === 'config') {
    await supabase.from('config').upsert({ key: mapping.key, value: next })
    return
  }

  if (mapping.type === 'list') {
    const prevSet = new Set(Array.isArray(prev) ? prev : [])
    const nextSet = new Set(Array.isArray(next) ? next : [])
    const added = [...nextSet].filter(x => !prevSet.has(x))
    const removed = [...prevSet].filter(x => !nextSet.has(x))
    for (const name of added) {
      await supabase.from(mapping.table).upsert({ name })
    }
    for (const name of removed) {
      await supabase.from(mapping.table).delete().eq('name', name)
    }
    return
  }

  // Array
  const prevMap = {}
  if (Array.isArray(prev)) prev.forEach(item => { if (item?.id) prevMap[item.id] = item })
  const nextMap = {}
  if (Array.isArray(next)) next.forEach(item => { if (item?.id) nextMap[item.id] = item })

  // Upsert novos/alterados
  for (const [id, item] of Object.entries(nextMap)) {
    const prevItem = prevMap[id]
    if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(item)) {
      const { id: itemId, ...rest } = item
      const { error } = await supabase.from(mapping.table).upsert({
        id: Number(itemId),
        data: rest
      })
      if (error) console.error(`[SiRH77] Upsert error ${mapping.table}:`, error)
    }
  }

  // Deletar removidos
  for (const id of Object.keys(prevMap)) {
    if (!nextMap[id]) {
      await supabase.from(mapping.table).delete().eq('id', Number(id))
    }
  }
}

export function useGlobalLoading(keys) {
  const [allLoaded, setAllLoaded] = useState(false)
  useEffect(() => {
    const check = () => keys.every(k => memCache[k] !== undefined)
    if (check()) { setAllLoaded(true); return }
    const interval = setInterval(() => {
      if (check()) { setAllLoaded(true); clearInterval(interval) }
    }, 200)
    return () => clearInterval(interval)
  }, [])
  return allLoaded
}
