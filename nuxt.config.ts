import { config } from 'dotenv'
config()

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  
  // Docker & Railway deployment configuration
  nitro: {
    preset: 'node-server',
    experimental: {
      wasm: true
    },
    https: {
      cert: process.env.SSL_CERT_PATH,
      key: process.env.SSL_KEY_PATH
    },
    routeRules: {
      '/.git/**': { redirect: { to: '/', statusCode: 301 } }
    }
  },
  
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    sessionSecret: process.env.SESSION_SECRET,
    lineChannelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    lineChannelSecret: process.env.LINE_CHANNEL_SECRET,
    lineWebhookUrl: process.env.LINE_WEBHOOK_URL,
    sslCertPath: process.env.SSL_CERT_PATH,
    sslKeyPath: process.env.SSL_KEY_PATH,
    public: {
      appBaseUrl: process.env.NUXT_APP_BASE_URL || 'http://localhost:3000'
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  // SSR for API routes
  ssr: true
})
