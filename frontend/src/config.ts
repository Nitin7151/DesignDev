export const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, use relative path
  : 'http://localhost:3001/api' // In development, use full URL