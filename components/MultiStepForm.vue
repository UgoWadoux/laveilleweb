<template>
  <div class="max-w-4xl mx-auto">
    <!-- Contenu du formulaire -->
    <div class="bg-white rounded-lg shadow-sm">
      <component
          :is="steps[currentStep].component"
          :form-data="formData"
          @update:form-data="updateFormData"
          @next-step="nextStep"
          @prev-step="prevStep"
          @start-memory="startMemoryForm"
          @complete="completeForm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import TimeSlotSelection from './steps/TimeSlotSelection.vue'
import GroupInfoForm from './steps/GroupInfoForm.vue'
import SuccessPage from './steps/SuccessPage.vue'
import MemoryParticipants from './memory-steps/MemoryParticipants.vue'
import MemoryTitle from './memory-steps/MemoryTitle.vue'
import MemoryEmotions from './memory-steps/MemoryEmotions.vue'
import MemoryObject from './memory-steps/MemoryObject.vue'
import MemoryMedia from './memory-steps/MemoryMedia.vue'
import MemoryMusic from './memory-steps/MemoryMusic.vue'

// Définition des étapes
const steps = markRaw([
  // Étapes du formulaire de création de session
  {
    label: 'Choix créneau',
    component: TimeSlotSelection,
    type: 'session'
  },
  {
    label: 'Infos groupe',
    component: GroupInfoForm,
    type: 'session'
  },
  {
    label: 'Confirmation',
    component: SuccessPage,
    type: 'session'
  },
  // Étapes du formulaire de souvenirs
  {
    label: 'Participants',
    component: MemoryParticipants,
    type: 'memory'
  },
  {
    label: 'Titre et description',
    component: MemoryTitle,
    type: 'memory'
  },
  {
    label: 'Émotions',
    component: MemoryEmotions,
    type: 'memory'
  },
  {
    label: 'Objet',
    component: MemoryObject,
    type: 'memory'
  },
  {
    label: 'Photos/Vidéos',
    component: MemoryMedia,
    type: 'memory'
  },
  {
    label: 'Musique',
    component: MemoryMusic,
    type: 'memory'
  }
])

// État du formulaire
const formData = ref({
  // Données du formulaire de création de session
  selectedDay: null,
  selectedTime: null,
  participants: [],
  hasAccessibilityNeeds: false,
  accessibilityDetails: '',
  sessionCode: '',

  // Données du formulaire de souvenirs
  memoryParticipants: [{ name: '' }],
  title: '',
  description: '',
  emotions: [],
  hasObject: false,
  objectDetails: '',
  media: [],
  music: {
    title: '',
    artist: ''
  }
})

// Étape actuelle
const currentStep = ref(0)

// Émission de l'événement pour mettre à jour le titre dans le parent
const emit = defineEmits(['step-change'])

// Méthodes pour naviguer entre les étapes
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    emit('step-change', currentStep.value)
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    emit('step-change', currentStep.value)
  }
}

// Démarrer le formulaire de souvenirs
const startMemoryForm = () => {
  // Passer directement à la première étape du formulaire de souvenirs
  currentStep.value = 3 // Index de MemoryParticipants
  emit('step-change', currentStep.value)
}

// Mise à jour des données du formulaire
const updateFormData = (newData) => {
  formData.value = { ...formData.value, ...newData }
}

// Finalisation du formulaire
const completeForm = () => {
  // Logique pour soumettre le formulaire complet
  console.log('Formulaire complété:', formData.value)
  // Ici vous pourriez appeler une API, etc.

  // Réinitialiser le formulaire et revenir à la première étape
  // ou afficher un message de confirmation
  alert('Formulaire soumis avec succès!')
}
</script>