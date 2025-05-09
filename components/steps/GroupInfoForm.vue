<template>
  <div class="p-8">
    <button class="flex items-center text-sm mb-4" @click="prevStep">
      <Icon name="material-symbols:arrow-back-rounded" class="mr-1" />
      Choix session
    </button>

    <h2 class="text-xl font-bold mb-6">C'est le moment de créer le groupe !</h2>

    <div class="mb-8">
      <h3 class="font-bold mb-2">Participants</h3>
      <p class="text-sm text-gray-600 mb-4">
        Indiquez le prénom de chaque participant pour que nous puissions déterminer le nombre de personnes.
      </p>

      <div class="space-y-2 mb-4">
        <div
            v-for="(participant, index) in localFormData.participants"
            :key="index"
            class="flex items-center"
        >
          <input
              type="text"
              v-model="participant.name"
              placeholder="Nom du participant"
              class="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
              class="ml-2 text-gray-400 hover:text-gray-600"
              @click="removeParticipant(index)"
          >
            <Icon name="proicons:cancel" />
          </button>
        </div>
      </div>

      <button
          class="w-full py-2 px-4 border border-gray-300 rounded text-center"
          @click="addParticipant"
      >
        Ajouter un participant
      </button>
    </div>

    <div class="mb-8">
      <h3 class="font-bold mb-2">Accessibilité</h3>
      <p class="text-sm text-gray-600 mb-4">
        Le groupe a-t-il des besoins particuliers en terme d'accessibilité (ex : fauteuil roulant, appareil auditif) ?
      </p>

      <div class="flex gap-8 my-4">
        <label class="flex items-center">
          <input
              type="radio"
              v-model="localFormData.hasAccessibilityNeeds"
              :value="false"
              class="mr-2"
          />
          Non
        </label>

        <label class="flex items-center">
          <input
              type="radio"
              v-model="localFormData.hasAccessibilityNeeds"
              :value="true"
              class="mr-2"
          />
          Oui
        </label>
      </div>

      <textarea
          v-if="localFormData.hasAccessibilityNeeds"
          v-model="localFormData.accessibilityDetails"
          placeholder="Précisez les besoins d'accessibilité"
          class="w-full border border-gray-300 rounded px-3 py-2 min-h-[100px]"
      ></textarea>
    </div>

    <div class="mt-8">
      <button
          class="w-full py-3 px-4 bg-gray-200 rounded-full text-center transition-colors disabled:opacity-50"
          :disabled="!isFormValid"
          @click="submitStep"
      >
        Valider et créer le groupe
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
  ...props.formData,
  participants: [...(props.formData.participants || [{ name: '' }])]
})

// Synchronisation des données locales avec les props
watch(() => props.formData, (newVal) => {
  localFormData.value = {
    ...newVal,
    participants: [...(newVal.participants || [{ name: '' }])]
  }
}, { deep: true })

// Gestion des participants
const addParticipant = () => {
  localFormData.value.participants.push({ name: '' })
}

// Correction de la fonction removeParticipant pour supprimer correctement la ligne
const removeParticipant = (index) => {
  // Supprimer le participant à l'index spécifié
  localFormData.value.participants.splice(index, 1)

  // S'assurer qu'il y a toujours au moins un participant
  if (localFormData.value.participants.length === 0) {
    addParticipant()
  }

  // Mettre à jour les données du formulaire parent
  emit('update:form-data', {
    ...props.formData,
    participants: localFormData.value.participants
  })
}

// Validation du formulaire
const isFormValid = computed(() => {
  const hasValidParticipants = localFormData.value.participants.some(p => p.name.trim() !== '')

  if (localFormData.value.hasAccessibilityNeeds) {
    return hasValidParticipants && localFormData.value.accessibilityDetails.trim() !== ''
  }

  return hasValidParticipants
})

// Navigation
const prevStep = () => {
  emit('prev-step')
}

// Soumission de l'étape
const submitStep = () => {
  if (isFormValid.value) {
    // Filtrer les participants vides
    const filteredParticipants = localFormData.value.participants.filter(p => p.name.trim() !== '')

    // Générer un code de session
    const sessionCode = generateSessionCode()

    // Mettre à jour les données du formulaire
    emit('update:form-data', {
      ...localFormData.value,
      participants: filteredParticipants,
      sessionCode
    })

    // Passer à l'étape suivante
    emit('next-step')
  }
}

// Génération d'un code de session
const generateSessionCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''

  // Format: CODE168-876GB-IHB09
  for (let i = 0; i < 15; i++) {
    if (i === 4 || i === 10) {
      code += '-'
    } else {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }

  return code
}
</script>