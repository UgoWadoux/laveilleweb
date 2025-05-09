<template>
  <div class="p-6">
    <div class="flex items-center mb-4">
      <button class="flex items-center text-sm" @click="prevStep">
        <Icon name="material-symbols:arrow-back-rounded" class="mr-1" />
        Retour
      </button>
    </div>

    <h2 class="text-lg font-bold mb-4">Votre souvenir</h2>

    <div class="mb-6">
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Titre*</label>
        <p class="text-xs text-gray-500 mb-2">Nommez en un titre qui représente votre souvenir...</p>
        <input
            type="text"
            v-model="localFormData.title"
            placeholder="Ex : Vacances au camping"
            class="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Description*</label>
        <p class="text-xs text-gray-500 mb-2">Décrivez ce dans sa globalité, en mentionnant tous les détails qui vous semblent importants...</p>
        <textarea
            v-model="localFormData.description"
            placeholder="Description..."
            class="w-full border border-gray-300 rounded px-3 py-2 min-h-[120px]"
        ></textarea>
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

// Copie locale des données du formulaire
const localFormData = ref({
  ...props.formData
})

// Synchronisation des données locales avec les props
watch(() => props.formData, (newVal) => {
  localFormData.value = { ...newVal }
}, { deep: true })

// Validation du formulaire
const isFormValid = computed(() => {
  return localFormData.value.title.trim() !== '' &&
      localFormData.value.description.trim() !== ''
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

    // Passer à l'étape suivante
    emit('next-step')
  }
}
</script>