// This script ensures the API configuration is available before the React app loads
(function() {
  // Default API URL if config.js fails to load
  window.APP_CONFIG = window.APP_CONFIG || {
    API_URL: 'https://cv.tdconsulting.vn',
    VERSION: '1.0.0',
    ENV: 'production'
  };
  
  // Expose API_URL directly for backward compatibility
  window.API_URL = window.APP_CONFIG.API_URL;
  
  // Log configuration loading
  console.log('Config loaded:', window.APP_CONFIG);
  
  // Detect environment
  const hostname = window.location.hostname;
  if (hostname.includes('github.io')) {
    console.log('Running on GitHub Pages');
  } else if (hostname.includes('huygoodboy.io.vn')) {
    console.log('Running on custom domain');
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('Running in local development environment');
  }
})(); 