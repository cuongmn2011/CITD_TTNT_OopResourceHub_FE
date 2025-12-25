/**
 * API Configuration
 * Switch between local and production backend easily
 */

const API_CONFIGS = {
  local: {
    baseURL: 'http://localhost:8000/api/v1',
    name: 'Local Development'
  },
  cloudrun: {
    baseURL: 'https://oopresourcehub-api-669515337272.asia-southeast1.run.app/api/v1',
    name: 'Production (Google Cloud Run)'
  }
}

// Change this to switch between environments
// Options: 'local', 'cloudrun'
const CURRENT_ENV = 'cloudrun'
// const CURRENT_ENV = 'local'

export const API_CONFIG = API_CONFIGS[CURRENT_ENV]
export const API_BASE_URL = API_CONFIG.baseURL

console.log(`[API Config] Using ${API_CONFIG.name} - ${API_BASE_URL}`)
