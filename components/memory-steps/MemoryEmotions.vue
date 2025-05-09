<template>
  <div class="p-6">
    <div class="flex justify-between mb-4">
      <button class="flex items-center text-sm" @click="prevStep">
        <Icon name="material-symbols:arrow-back-rounded" class="mr-1" />
        Retour
      </button>
    </div>

    <h2 class="text-lg font-bold mb-4">Votre souvenir</h2>

    <div class="mb-6">
      <p class="font-medium mb-4">Quelles sont les émotions principales de ce souvenir ?*</p>

      <div class="flex flex-wrap gap-2 mb-4">
        <button
            v-for="emotion in availableEmotions"
            :key="emotion"
            @click="toggleEmotion(emotion)"
            class="px-3 py-1 rounded-full text-sm border transition-colors"
            :class="localFormData.emotions.includes(emotion) ? 'bg-gray-200 border-gray-400' : 'border-gray-300'"
        >
          {{ emotion }}
        </button>
      </div>
    </div>

    <div class="mb-6">
      <p class="font-medium mb-4">Avez-vous un objet en lien avec ce souvenir à apporter ?</p>

      <div class="flex gap-8 my-4">
        <label class="flex items-center">
          <input
              type="radio"
              v-model="localFormData.hasObject"
              :value="false"
              class="mr-2"
          />
          Non
        </label>

        <label class="flex items-center">
          <input
              type="radio"
              v-model="localFormData.hasObject"
              :value="true"
              class="mr-2"
          />
          Oui
        </label>
      </div>
    </div>

    <div class="mt-8">
      <button
          class="w-full py-3 px-4 bg-gray-200 rounded-full text-center transition-colors disabled:opacity-50"
          :disabled="!isFormValid"
          @click="submitStep"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:form-data', 'next-step', 'prev-step'])

// Émotions disponibles
const availableEmotions = [
  'Joie', 'Mélancolie', 'Tristesse', 'Amusement', 'Peur', 'Stress', 'Fierté'
]

// Copie locale des données du formulaire
const localFormData = ref({
  ...props.formData,
  emotions: [...(props.formData.emotions || [])]
})

// Synchronisation des données locales avec les props
watch(() => props.formData, (newVal) => {
  localFormData.value = {
    ...newVal,
    emotions: [...(newVal.emotions || [])]
  }
}, { deep: true })

// Gestion des émotions
const toggleEmotion = (emotion) => {
  if (localFormData.value.emotions.includes(emotion)) {
    localFormData.value.emotions = localFormData.value.emotions.filter(e => e !== emotion)
  } else {
    localFormData.value.emotions.push(emotion)
  }
}

// Validation du formulaire
const isFormValid = computed(() => {
  return localFormData.value.emotions.length > 0
})

// Navigation
const prevStep = () => {
  emit('prev-step')
}

// Soumission de l'étape
const submitStep = () => {
  if (isFormValid.value) {
    // Mettre à jour les données du formulaire
    emit('update:form-data', {
      ...localFormData.value
    })

    // Si l'utilisateur a un objet, passer à l'étape de l'objet
    // Sinon, passer directement à l'étape des médias
    if (localFormData.value.hasObject) {
      emit('next-step')
    } else {
      // Passer l'étape de l'objet
      emit('update:form-data', {
        ...localFormData.value,
        objectDetails: ''
      })
      emit('next-step')
      emit('next-step') // Passer à l'étape des médias
    }
  }
}
</script>