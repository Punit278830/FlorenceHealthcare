// Production environment configuration
export const api_Url = "http://97.74.84.4/api/";

// Production-specific settings
export const environment = {
  production: true,
  apiUrl: api_Url,
  enableDebugMode: false,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
};
