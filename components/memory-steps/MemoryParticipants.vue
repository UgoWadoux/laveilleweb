<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Remplir souvenir</h2>

    <div class="mb-6">
      <p class="font-medium mb-2">Pour qui voulez-vous remplir le souvenir ?</p>
      <p class="text-sm text-gray-600 mb-4">Vous pouvez remplir votre propre souvenir ou celui de quelqu'un d'autre.</p>

      <div v-if="sessionParticipants.length > 0" class="space-y-3">
        <!-- Afficher tous les participants avec des champs de texte stylisés -->
        <div
            v-for="(participant, index) in sessionParticipants"
            :key="participant.id"
            class="relative"
        >
          <div
              class="border rounded-lg p-4 cursor-pointer"
              :class="{
              'border-black border-2': selectedParticipantIds.includes(participant.id),
              'border-gray-300': !selectedParticipantIds.includes(participant.id)
            }"
              @click="toggleParticipant(participant.id)"
          >
            <div class="text-lg">
              {{ participant.name }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center p-4 bg-gray-100 rounded">
        <p class="text-gray-600">Aucun participant n'a été configuré. Veuillez retourner à l'étape de configuration du groupe.</p>
      </div>
    </div>

    <div class="mt-8">
      <button
          class="w-full py-3 px-4 bg-gray-200 rounded-full text-center transition-colors disabled:opacity-50"
          :disabled="!isFormValid"
          @click="submitStep"
      >
        Je rempli le souvenir
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

const emit = defineEmits(['update:form-data', 'next-step'])

// Récupérer les participants configurés dans la première partie du formulaire
const sessionParticipants = computed(() => {
  // Ajouter un ID à chaque participant pour faciliter la sélection
  return (props.formData.participants || []).map((participant, index) => ({
    ...participant,
    id: index.toString()
  }))
})

// Tableau pour stocker les IDs des participants sélectionnés
const selectedParticipantIds = ref([])

// Fonction pour basculer la sélection d'un participant
const toggleParticipant = (id) => {
  if (selectedParticipantIds.value.includes(id)) {
    selectedParticipantIds.value = selectedParticipantIds.value.filter(participantId => participantId !== id)
  } else {
    selectedParticipantIds.value.push(id)
  }
}

// Initialiser les participants du souvenir si déjà présents
watch(() => props.formData.memoryParticipants, (newVal) => {
  if (newVal && newVal.length > 0) {
    // Essayer de faire correspondre les participants du souvenir avec ceux de la session
    selectedParticipantIds.value = newVal
        .map(memoryParticipant => {
          const sessionParticipant = sessionParticipants.value.find(
              p => p.name === memoryParticipant.name
          )
          return sessionParticipant ? sessionParticipant.id : null
        })
        .filter(id => id !== null)
  } else if (sessionParticipants.value.length > 0) {
    // Par défaut, sélectionner le premier participant
    selectedParticipantIds.value = [sessionParticipants.value[0].id]
  }
}, { immediate: true })

// Validation du formulaire
const isFormValid = computed(() => {
  // Au moins un participant doit être sélectionné
  return selectedParticipantIds.value.length > 0
})

// Soumission de l'étape
const submitStep = () => {
  if (isFormValid.value) {
    // Créer un tableau de participants pour le souvenir
    const memoryParticipants = selectedParticipantIds.value
        .map(id => {
          const participant = sessionParticipants.value.find(p => p.id === id)
          return {
            name: participant.name,
            id: participant.id
          }
        })

    // Mettre à jour les données du formulaire
    emit('update:form-data', {
      ...props.formData,
      memoryParticipants
    })

    // Passer à l'étape suivante
    emit('next-step')
  }
}
</script>