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
      <p class="font-medium mb-4">Ajoutez des photos ou vidéos</p>

      <div class="mb-4">
        <button
            @click="selectMedia"
            class="w-full py-3 px-4 border border-dashed border-gray-300 rounded text-center"
        >
          Sélectionner les médias
        </button>

        <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            multiple
            accept="image/*,video/*"
            class="hidden"
        />
      </div>

      <div v-if="localFormData.media.length > 0" class="grid grid-cols-3 gap-2">
        <div
            v-for="(media, index) in localFormData.media"
            :key="index"
            class="relative aspect-square bg-gray-100 rounded overflow-hidden"
        >
          <img
              v-if="media.type.startsWith('image')"
              :src="media.preview"
              class="w-full h-full object-cover"
              alt="Media preview"
          />
          <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-200"
          >
            <Icon name="material-symbols:video-file" size="32" />
          </div>

          <button
              @click="removeMedia(index)"
              class="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            <Icon name="material-symbols:close" size="16" />
          </button>
        </div>

        <div v-if="localFormData.media.length >= 4" class="relative aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center text-xl font-bold">
          4+
        </div>
      </div>
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

const emit = defineEmits(['update:form-data', 'next-step', 'prev-step'])

// Référence à l'input de fichier
const fileInput = ref(null)

// Copie locale des données du formulaire
const localFormData = ref({
  ...props.formData,
  media: [...(props.formData.media || [])]
})

// Synchronisation des données locales avec les props
watch(() => props.formData, (newVal) => {
  localFormData.value = {
    ...newVal,
    media: [...(newVal.media || [])]
  }
}, { deep: true })

// Sélection de médias
const selectMedia = () => {
  fileInput.value.click()
}

// Gestion des fichiers sélectionnés
const handleFileChange = (event) => {
  const files = Array.from(event.target.files)

  files.forEach(file => {
    // Créer une URL pour la prévisualisation
    const preview = URL.createObjectURL(file)

    // Ajouter le fichier à la liste des médias
    localFormData.value.media.push({
      file,
      type: file.type,
      preview
    })
  })

  // Réinitialiser l'input pour permettre de sélectionner les mêmes fichiers
  event.target.value = null
}

// Suppression d'un média
const removeMedia = (index) => {
  // Libérer l'URL de prévisualisation
  URL.revokeObjectURL(localFormData.value.media[index].preview)

  // Supprimer le média
  localFormData.value.media.splice(index, 1)
}

// Navigation
const prevStep = () => {
  emit('prev-step')
}

const skipStep = () => {
  emit('next-step')
}

// Soumission de l'étape
const submitStep = () => {
  // Mettre à jour les données du formulaire
  emit('update:form-data', {
    ...localFormData.value
  })

  // Passer à l'étape suivante
  emit('next-step')
}
</script>