// Configuration for Guitar Teacher Pro
// This file is automatically updated by GitHub Actions deployment

window.GuitarTeacherConfig = {
  // Update this URL to your deployed API endpoint
  // Examples:
  // Vercel: 'https://your-api-domain.vercel.app/api'
  // Netlify: 'https://your-site-name.netlify.app/.netlify/functions/api'
  // Custom domain: 'https://your-api-domain.com/api'
  // Local development: 'http://localhost:3000/api'

  API_BASE_URL: "http://localhost:3000/api", // <-- Local development

  // Enable/disable API usage (set to false to use mock responses only)
  USE_API: true,

  // Enable debug logging
  DEBUG: false,
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = window.GuitarTeacherConfig;
}
