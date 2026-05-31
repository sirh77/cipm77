import { useState, useEffect, useRef, useCallback } from 'react'
import { db, KEY_MAP, isConfigured } from './supabase.js'

// Cache global em memória
const memCache = {}
const loadingPromises = {}

export function useSupabaseState(localKey, initialValue) {
  const mapping = KEY_MAP[localKey]

  const [data, setData] = useState(() => {
    // Se já em cache, usa direto
    if (memCache[localKey] !== undefined) return memCache[localKey]
    // Se Supabase configurado, não usa localStorage (espera o fetch)
    if (isConfigured && mapping) {
      return typeof initialValue === 'function' ? initialValue() : initialValue
    }
    // Sem Supabase: usa localStorage
    try {
      const stored = localStorage.getItem(localKey)
      if (stored) return JSON.parse(stored)
    } catch {}
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  const [loading, setLoading] = useState(isConfigured && !!mapping)
  const isMounted = useRef(true)
  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false } }, [])

  // Fetch do Supabase na inicialização
  useEffect(() => {
    if (!isConfigured || !mapping) { setLoading(false); return }
    if (memCache[localKey] !== undefined) {
      setData(memCache[localKey])
      setLoading(false)
      return
    }
    if (!loadingPromises[localKey]) {
      loadingPromises[localKey] = fetchFromSupabase(localKey, mapping)
        .then(result => { memCache[localKey] = result; return result })
        .catch(err => {
          console.error(`[SiRH77] Erro ao carregar ${localKey}:`, err)
          const fallback = typeof initialValue === 'function' ? initialValue() : initialValue
          memCache[localKey] = fallback
          return fallback
        })
    }
    loadingPromises[localKey].then(result => {
      if (isMounted.current) { setData(result); setLoading(false) }
    })
  }, [localKey])

  // Setter que sincroniza com Supabase
  const setDataWithSync = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      memCache[localKey] = next
      // Backup no localStorage
      try { localStorage.setItem(localKey, JSON.stringify(next)) } catch {}
      // Sync Supabase
      if (isConfigured && mapping) {
        syncToSupabase(localKey, mapping, prev, next).catch(err =>
          console.error(`[SiRH77] Erro ao salvar ${localKey}:`, err)
        )
      }
      return next
    })
  }, [localKey, mapping])

  return [data, setDataWithSync, loading]
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchFromSupabase(localKey, mapping) {
  if (mapping.type === 'config') {
    const val = await db.loadConfig(mapping.key)
    return val !== null ? val : null
  }
  if (mapping.type === 'list') {
    const rows = await db.loadAll(mapping.table)
    return (rows || []).map(r => r.name || r.data?.name).filter(Boolean)
  }
  const rows = await db.loadAll(mapping.table)
  return (rows || []).map(r => ({ ...r.data, id: r.id }))
}

// ─── Sync ─────────────────────────────────────────────────────────────────────
async function syncToSupabase(localKey, mapping, prev, next) {
  if (mapping.type === 'config') {
    await db.saveConfig(mapping.key, next); return
  }
  if (mapping.type === 'list') {
    const prevSet = new Set(Array.isArray(prev) ? prev : [])
    const nextSet = new Set(Array.isArray(next) ? next : [])
    for (const name of [...nextSet].filter(x => !prevSet.has(x))) {
      await db.req(`/${mapping.table}`, {
        method: 'POST',
        headers: { 'Prefer': 'return=representation,resolution=merge-duplicates' },
        body: JSON.stringify({ name }),
      }).catch(() => {})
    }
    for (const name of [...prevSet].filter(x => !nextSet.has(x))) {
      const rows = await db.req(`/${mapping.table}?name=eq.${encodeURIComponent(name)}&select=id`)
      if (rows?.[0]?.id) await db.delete(mapping.table, rows[0].id)
    }
    return
  }
  // Array: upsert changed/new, delete removed
  const prevMap = {}
  if (Array.isArray(prev)) prev.forEach(item => { if (item?.id) prevMap[item.id] = item })
  const nextMap = {}
  if (Array.isArray(next)) next.forEach(item => { if (item?.id) nextMap[item.id] = item })

  for (const [id, item] of Object.entries(nextMap)) {
    const prevItem = prevMap[id]
    if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(item)) {
      const { id: itemId, ...rest } = item
      try {
        await db.upsert(mapping.table, { id: Number(itemId), data: rest })
        console.log(`[SiRH77] Saved ${mapping.table} id=${itemId}`)
      } catch(err) {
        console.error(`[SiRH77] Failed to save ${mapping.table} id=${itemId}:`, err)
      }
    }
  }
  for (const id of Object.keys(prevMap)) {
    if (!nextMap[id]) await db.delete(mapping.table, Number(id))
  }
}

export function useGlobalLoading(keys) {
  const [allLoaded, setAllLoaded] = useState(false)
  useEffect(() => {
    const check = () => keys.every(k => memCache[k] !== undefined)
    if (check()) { setAllLoaded(true); return }
    const interval = setInterval(() => { if (check()) { setAllLoaded(true); clearInterval(interval) } }, 200)
    return () => clearInterval(interval)
  }, [])
  return allLoaded
}
