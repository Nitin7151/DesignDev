export const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, use relative path since both frontend and backend are on same origin
  : 'http://localhost:3001/api' // In development, use full URL since frontend runs on different port