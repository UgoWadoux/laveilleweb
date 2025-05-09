<!-- pages/session/[code].vue -->
<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6 text-center">Souvenirs de la session</h1>

      <div v-if="isLoading" class="text-center py-8">
        Chargement des souvenirs...
      </div>

      <div v-else-if="!session" class="text-center py-8">
        Session non trouvée. <NuxtLink to="/" class="text-blue-500 underline">Retour à l'accueil</NuxtLink>
      </div>

      <template v-else>
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-xl font-bold mb-2">Informations de la session</h2>
          <p><strong>Code:</strong> {{ session.code }}</p>
          <p><strong>Jour:</strong> {{ session.selected_day }}</p>
          <p><strong>Horaire:</strong> {{ session.selected_time }}</p>
          <p><strong>Participants:</strong>
            <span v-for="(p, i) in session.participants" :key="i">
              {{ p.name }}{{ i < session.participants.length - 1 ? ', ' : '' }}
            </span>
          </p>
        </div>

        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Souvenirs</h2>
          <button
              @click="navigateTo(`/reservation?code=${session.code}&memory=true`)"
              class="px-4 py-2 bg-gray-200 rounded-full"
          >
            Ajouter un souvenir
          </button>
        </div>

        <div v-if="memories.length === 0" class="text-center py-8 bg-white rounded-lg shadow-sm">
          <p class="mb-4">Aucun souvenir n'a encore été ajouté à cette session.</p>
        </div>

        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
              v-for="memory in memories"
              :key="memory.id"
              class="bg-white rounded-lg shadow-sm p-4"
          >
            <h3 class="text-lg font-bold mb-2">{{ memory.title }}</h3>

            <div class="mb-3 text-sm text-gray-600">
              <div v-if="memory.participants && memory.participants.length > 0">
                Participants:
                <span v-for="(p, i) in memory.participants" :key="i">
                  {{ p.name }}{{ i < memory.participants.length - 1 ? ', ' : '' }}
                </span>
              </div>
            </div>

            <p class="mb-3">{{ memory.description }}</p>

            <div v-if="memory.emotions && memory.emotions.length > 0" class="mb-3">
              <div class="flex flex-wrap gap-2">
                <span
                    v-for="emotion in memory.emotions"
                    :key="emotion"
                    class="px-2 py-1 bg-gray-100 rounded-full text-xs"
                >
                  {{ emotion }}
                </span>
              </div>
            </div>

            <div v-if="memory.has_object" class="mb-3">
              <div class="text-sm font-medium">Objet associé:</div>
              <div>{{ memory.object_details }}</div>
            </div>

            <div v-if="memory.media_urls && memory.media_urls.length > 0" class="mb-3">
              <div class="grid grid-cols-2 gap-2">
                <div
                    v-for="(media, i) in memory.media_urls"
                    :key="i"
                    class="aspect-square bg-gray-100 rounded overflow-hidden"
                >
                  <img
                      v-if="media.type === 'image'"
                      :src="media.url"
                      class="w-full h-full object-cover"
                      alt="Media"
                  />
                  <div
                      v-else
                      class="w-full h-full flex items-center justify-center bg-gray-200"
                  >
                    <span>Vidéo</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="memory.music_info && memory.music_info.title" class="text-sm">
              <div class="font-medium">Musique:</div>
              <div>{{ memory.music_info.title }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

const route = useRoute()
const { getSessionByCode, getMemoriesBySessionCode } = useSupabase()

const sessionCode = ref(route.params.code)
const session = ref(null)
const memories = ref([])
const isLoading = ref(true)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  isLoading.value = true

  try {
    // Charger la session
    session.value = await getSessionByCode(sessionCode.value)

    if (session.value) {
      // Charger les souvenirs
      memories.value = await getMemoriesBySessionCode(sessionCode.value)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    isLoading.value = false
  }
}
</script>