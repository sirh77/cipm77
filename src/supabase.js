// Supabase client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Mapa: localStorage key → tabela Supabase + tipo de armazenamento
export const KEY_MAP = {
  'sirh_officers_v7':     { table: 'officers',          type: 'array' },
  'sirh_locations':       { table: 'locations',          type: 'list'  },
  'sirh_ferias_v3':       { table: 'ferias',             type: 'array' },
  'sirh_afastamentos_v2': { table: 'afastamentos',       type: 'array' },
  'sirh_cursos':          { table: 'cursos',             type: 'array' },
  'sirh_vantagens_v3':    { table: 'vantagens',          type: 'array' },
  'sirh_promocoes_v2':    { table: 'promocoes',          type: 'array' },
  'sirh_corregedoria':    { table: 'corregedoria',       type: 'array' },
  'sirh_corr_processos':  { table: 'corr_processos',     type: 'array' },
  'sirh_corr_elogios':    { table: 'corr_elogios',       type: 'array' },
  'sirh_corr_milae':      { table: 'corr_milae',         type: 'array' },
  'sirh_corr_expedientes':{ table: 'corr_expedientes',   type: 'array' },
  'sirh_corr_numeracao':  { table: 'config',             type: 'config', key: 'numeracao' },
  'sirh_corr_prazos':     { table: 'config',             type: 'config', key: 'prazos'    },
  'sirh_users':           { table: 'app_users',          type: 'array' },
}

class SupabaseClient {
  constructor(url, key) {
    this.url = url
    this.key = key
  }

  async req(path, options = {}) {
    const { prefer, headers: extraHeaders, ...fetchOptions } = options
    const res = await fetch(`${this.url}/rest/v1${path}`, {
      ...fetchOptions,
      headers: {
        'apikey': this.key,
        'Authorization': `Bearer ${this.key}`,
        'Content-Type': 'application/json',
        'Prefer': prefer || 'return=representation',
        ...(extraHeaders || {}),
      },
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Supabase error: ${res.status} — ${err}`)
    }
    if (res.status === 204) return null
    return res.json()
  }

  // Load all rows from a table
  async loadAll(table) {
    return this.req(`/${table}?select=*`)
  }

  // Upsert single row (id-based)
  async upsert(table, row) {
    return this.req(`/${table}`, {
      method: 'POST',
      prefer: 'return=representation,resolution=merge-duplicates',
      headers: { 'Prefer': 'return=representation,resolution=merge-duplicates' },
      body: JSON.stringify(row),
    })
  }

  // Delete row by id
  async delete(table, id) {
    return this.req(`/${table}?id=eq.${id}`, { method: 'DELETE', prefer: '' })
  }

  // Load config value
  async loadConfig(key) {
    const rows = await this.req(`/config?key=eq.${key}&select=value`)
    return rows?.[0]?.value ?? null
  }

  // Save config value
  async saveConfig(key, value) {
    return this.req('/config', {
      method: 'POST',
      prefer: 'return=representation,resolution=merge-duplicates',
      headers: { 'Prefer': 'return=representation,resolution=merge-duplicates' },
      body: JSON.stringify({ key, value }),
    })
  }
}

export const db = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export const isConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY)
