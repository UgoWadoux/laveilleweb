<template>
  <div class="p-6">
    <div class="flex justify-between mb-4">
      <button class="flex items-center text-sm" @click="prevStep">
        <Icon name="material-symbols:arrow-back-rounded" class="mr-1" />
        Retour
      </button>
      <button class="text-sm underline" @click="skipStep">
        Passer
      </button>
    </div>

    <h2 class="text-lg font-bold mb-4">Votre souvenir</h2>

    <div class="mb-6">
      <p class="font-medium mb-4">Ajouter une musique</p>
      <p class="text-xs text-gray-500 mb-4">Renseignez le titre et l'auteur</p>

      <div class="mb-4">
        <input
            type="text"
            v-model="localFormData.music.title"
            placeholder="Titre - Auteur"
            class="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
    </div>

    <div class="mt-4 text-center text-sm text-gray-500">
      <p>Ce souvenir sera modifiable pendant 48h.</p>
    </div>

    <div class="mt-8">
      <button
          class="w-full py-3 px-4 bg-gray-200 rounded-full text-center"
          @click="submitStep"
      >
        Valider
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:form-data', 'next-step', 'prev-step', 'complete'])

// Copie locale des données du formulaire
const localFormData = ref({
  ...props.formData,
  music: {
    title: props.formData.music?.title || '',
    artist: props.formData.music?.artist || ''
  }
})

// Synchronisation des données locales avec les props
watch(() => props.formData, (newVal) => {
  localFormData.value = {
    ...newVal,
    music: {
      title: newVal.music?.title || '',
      artist: newVal.music?.artist || ''
    }
  }
}, { deep: true })

// Navigation
const prevStep = () => {
  emit('prev-step')
}

const skipStep = () => {
  emit('complete')
}

// Soumission de l'étape
const submitStep = () => {
  // Mettre à jour les données du formulaire
  emit('update:form-data', {
    ...localFormData.value
  })

  // Compléter le formulaire
  emit('complete')
}
</script>