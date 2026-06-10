import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// KEY_MAP: localStorage key → tabela Supabase
export const KEY_MAP = {
  'sirh_officers_v7':     { table: 'officers' },
  'sirh_locations':       { table: 'locations', type: 'list' },
  'sirh_ferias_v3':       { table: 'ferias' },
  'sirh_afastamentos_v2': { table: 'afastamentos' },
  'sirh_cursos':          { table: 'cursos' },
  'sirh_vantagens_v3':    { table: 'vantagens' },
  'sirh_promocoes_v2':    { table: 'promocoes' },
  'sirh_corregedoria':    { table: 'corregedoria' },
  'sirh_corr_processos':  { table: 'corr_processos' },
  'sirh_corr_elogios':    { table: 'corr_elogios' },
  'sirh_corr_milae':      { table: 'corr_milae' },
  'sirh_corr_expedientes':{ table: 'corr_expedientes' },
  'sirh_corr_numeracao':  { table: 'config', type: 'config', key: 'numeracao' },
  'sirh_corr_prazos':     { table: 'config', type: 'config', key: 'prazos' },
  'sirh_users':           { table: 'app_users' },
  'sirh_pelotoes':        { table: 'pelotoes' },
  'sirh_escalas':         { table: 'escalas' },
  'sirh_extras':          { table: 'esc_extras' },
}
