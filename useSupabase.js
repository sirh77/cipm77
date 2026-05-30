import { useState, useEffect, useRef, useCallback } from 'react'
import { db, KEY_MAP, isConfigured } from './supabase.js'

// Cache global em memória para evitar re-fetches desnecessários
const memCache = {}
const loadingPromises = {}

// Hook principal — substitui useLocalState com Supabase
export function useSupabaseState(localKey, initialValue) {
  const mapping = KEY_MAP[localKey]
  const [data, setData] = useState(() => {
    // Se já está em cache de memória, usa direto
    if (memCache[localKey] !== undefined) return memCache[localKey]
    // Fallback: tenta localStorage enquanto carrega
    try {
      const stored = localStorage.getItem(localKey)
      if (stored) return JSON.parse(stored)
    } catch {}
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })
  const [loading, setLoading] = useState(!memCache[localKey])
  const isMounted = useRef(true)

  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false } }, [])

  // Fetch inicial do Supabase
  useEffect(() => {
    if (!isConfigured || !mapping || memCache[localKey] !== undefined) {
      setLoading(false)
      return
    }
    if (!loadingPromises[localKey]) {
      loadingPromises[localKey] = fetchFromSupabase(localKey, mapping)
        .then(result => {
          memCache[localKey] = result
          return result
        })
        .catch(err => {
          console.error(`[SiRH77] Erro ao carregar ${localKey}:`, err)
          const fallback = typeof initialValue === 'function' ? initialValue() : initialValue
          memCache[localKey] = fallback
          return fallback
        })
    }
    loadingPromises[localKey].then(result => {
      if (isMounted.current) {
        setData(result)
        setLoading(false)
      }
    })
  }, [localKey])

  // Setter que sincroniza com Supabase
  const setDataWithSync = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      memCache[localKey] = next
      // Persiste no localStorage como backup
      try { localStorage.setItem(localKey, JSON.stringify(next)) } catch {}
      // Sincroniza com Supabase em background
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

// ─── Fetch do Supabase ────────────────────────────────────────────────────────
async function fetchFromSupabase(localKey, mapping) {
  if (mapping.type === 'config') {
    const val = await db.loadConfig(mapping.key)
    return val !== null ? val : null
  }

  if (mapping.type === 'list') {
    // Locations: armazenado como lista de strings
    const rows = await db.loadAll(mapping.table)
    return (rows || []).map(r => r.name || r.data?.name).filter(Boolean)
  }

  // Array de objetos (tipo padrão)
  const rows = await db.loadAll(mapping.table)
  return (rows || []).map(r => {
    const obj = { ...r.data, id: r.id }
    return obj
  })
}

// ─── Sync para Supabase ──────────────────────────────────────────────────────
async function syncToSupabase(localKey, mapping, prev, next) {
  if (mapping.type === 'config') {
    await db.saveConfig(mapping.key, next)
    return
  }

  if (mapping.type === 'list') {
    // Locations: re-insere todas as novas
    const prevSet = new Set(Array.isArray(prev) ? prev : [])
    const nextSet = new Set(Array.isArray(next) ? next : [])
    const added = [...nextSet].filter(x => !prevSet.has(x))
    const removed = [...prevSet].filter(x => !nextSet.has(x))
    for (const name of added) {
      await db.req(`/${mapping.table}`, {
        method: 'POST',
        prefer: 'return=representation,resolution=merge-duplicates',
        headers: { 'Prefer': 'return=representation,resolution=merge-duplicates' },
        body: JSON.stringify({ name }),
      }).catch(() => {})
    }
    // Para removed: busca id e deleta
    for (const name of removed) {
      const rows = await db.req(`/${mapping.table}?name=eq.${encodeURIComponent(name)}&select=id`)
      if (rows?.[0]?.id) await db.delete(mapping.table, rows[0].id)
    }
    return
  }

  // Array: detecta inserções, updates e deleções
  const prevMap = {}
  if (Array.isArray(prev)) prev.forEach(item => { if (item?.id) prevMap[item.id] = item })
  const nextMap = {}
  if (Array.isArray(next)) next.forEach(item => { if (item?.id) nextMap[item.id] = item })

  // Upsert changed/new
  for (const [id, item] of Object.entries(nextMap)) {
    const prevItem = prevMap[id]
    if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(item)) {
      const { id: itemId, ...rest } = item
      await db.upsert(mapping.table, { id: Number(itemId), data: rest })
    }
  }

  // Delete removed
  for (const id of Object.keys(prevMap)) {
    if (!nextMap[id]) {
      await db.delete(mapping.table, Number(id))
    }
  }
}

// ─── Hook de loading global ──────────────────────────────────────────────────
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
