// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/eslint', '@nuxt/icon'],
  imports: {
    autoImport: true
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL, // sera remplacé par NUXT_PUBLIC_SUPABASE_URL
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_KEY // sera remplacé par NUXT_PUBLIC_SUPABASE_ANON_KEY
    }
  }
})