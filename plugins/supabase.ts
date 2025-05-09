import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const supabaseAnonKey = config.public.supabaseAnonKey

    const supabase: SupabaseClient = createClient(
        supabaseUrl,
        supabaseAnonKey
    )

    // Injection de l'instance Supabase accessible server & client
    nuxtApp.provide('supabase', supabase)
})