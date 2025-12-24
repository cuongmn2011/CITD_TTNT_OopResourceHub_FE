/**
 * API Configuration
 * Centralized configuration for backend API endpoint
 */

// Backend API Base URL
// Change this to switch between local development and production
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://oopresourcehub-api-669515337272.asia-southeast1.run.app'

// For local development, uncomment below:
// export const API_BASE_URL = 'http://localhost:8000'

// API version prefix
export const API_VERSION = '/api/v1'

// Full API endpoint
export const API_ENDPOINT = `${API_BASE_URL}${API_VERSION}`
