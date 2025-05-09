<template>
  <div class="p-6">
    <div class="flex justify-between mb-4">
      <button class="flex items-center text-sm" @click="prevStep">
        <Icon name="material-symbols:arrow-back-rounded" class="mr-1" />
        Retour
      </button>
    </div>

    <h2 class="text-lg font-bold mb-4">Votre souvenir</h2>

    <div class="mb-6" v-if="localFormData.hasObject">
      <p class="font-medium mb-4">Avez-vous un objet en lien avec ce souvenir à apporter ?*</p>

      <div class="mb-4">
        <input
            type="text"
            v-model="localFormData.objectDetails"
            placeholder="Précisez lequel..."
            class="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
    </div>

    <div class="mt-8">
      <button
          class="w-full py-3 px-4 bg-gray-200 rounded-full text-center transition-colors disabled:opacity-50"
          :disabled="localFormData.hasObject && !localFormData.objectDetails.trim()"
          @click="submitStep"
      >
        Suivant
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

// Copie locale des données du formulaire
const localFormData = ref({
  ...props.formData,
  objectDetails: props.formData.objectDetails || ''
})

// Synchronisation des données locales avec les props
watch(() => props.formData, (newVal) => {
  localFormData.value = {
    ...newVal,
    objectDetails: newVal.objectDetails || ''
  }
}, { deep: true })

// Navigation
const prevStep = () => {
  emit('prev-step')
}

// Soumission de l'étape
const submitStep = () => {
  // Si l'utilisateur a un objet mais n'a pas fourni de détails, ne pas continuer
  if (localFormData.value.hasObject && !localFormData.value.objectDetails.trim()) {
    return
  }

  // Mettre à jour les données du formulaire
  emit('update:form-data', {
    ...localFormData.value
  })

  // Passer à l'étape suivante
  emit('next-step')
}
</script>