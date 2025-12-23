import axios from 'axios'

const API_BASE_URL = '/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Response Error:', error)
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Dữ liệu không tìm thấy')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Lỗi server. Vui lòng thử lại sau.')
    }
    
    throw error
  }
)

export const apiService = {
  // Get all categories
  async getCategories() {
    try {
      const response = await api.get('/categories')
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },

  // Get all topics
  async getAllTopics() {
    try {
      const response = await api.get('/topics')
      return response.data
    } catch (error) {
      console.error('Failed to fetch topics:', error)
      throw error
    }
  },

  // Get topics by category
  async getTopicsByCategory(categoryId) {
    try {
      const response = await api.get(`/topics?category_id=${categoryId}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch topics for category ${categoryId}:`, error)
      throw error
    }
  },

  // Get sections for a topic
  async getSections(topicId) {
    try {
      const response = await api.get(`/sections/topic/${topicId}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch sections for topic ${topicId}:`, error)
      throw error
    }
  },

  // Get related topics
  async getRelatedTopics(topicId) {
    try {
      const response = await api.get(`/related-topics/${topicId}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch related topics for topic ${topicId}:`, error)
      throw error
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/categories') // Use categories as health check
      return { status: 'ok', data: response.data }
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }
}