type Env = {
  apiBaseUrl: string
  nodeEnv: 'development' | 'production' | 'test'
}

function getEnvVar(key: string, fallback?: string): string {
  const v = (import.meta as any).env?.[key]
  if (v == null || v === '') {
    if (fallback != null) return fallback
    console.warn(`Missing env var ${key}`)
    return ''
  }
  return v
}

export const env: Env = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5001/api').replace(/\/$/, ''),
  nodeEnv: (getEnvVar('MODE', 'development') as Env['nodeEnv'])
}


