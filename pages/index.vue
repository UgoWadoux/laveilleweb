<template>
  <div class="px-4 h-[1000px]">
    <h1>
      Home Page
    </h1>
  </div>
</template>

<script setup lang="ts">
/*
import { ref, onMounted } from 'vue'

const { $supabase } = useNuxtApp()
const reservations = ref<Array<{ id: number; reservation_date: string }>>([])

onMounted(async () => {
  const { data, error } = await $supabase
      .from('reservation')
      .select('id, reservation_date')

  if (error) {
    console.error('Erreur Supabase :', error)
  } else if (data) {
    reservations.value = data
    console.log(reservations.value)
  }
})
 */
</script>