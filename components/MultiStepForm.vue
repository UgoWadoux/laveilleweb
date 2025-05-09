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
import { ref, markRaw, watch } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import TimeSlotSelection from './steps/TimeSlotSelection.vue'
import GroupInfoForm from './steps/GroupInfoForm.vue'
import SuccessPage from './steps/SuccessPage.vue'
import MemoryParticipants from './memory-steps/MemoryParticipants.vue'
import MemoryTitle from './memory-steps/MemoryTitle.vue'
import MemoryEmotions from './memory-steps/MemoryEmotions.vue'
import MemoryObject from './memory-steps/MemoryObject.vue'
import MemoryMedia from './memory-steps/MemoryMedia.vue'
import MemoryMusic from './memory-steps/MemoryMusic.vue'

const { getSessionByCode } = useSupabase()
const route = useRoute()

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
  sessionId: null,

  // Données du formulaire de souvenirs
  memoryParticipants: [],
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

// Vérifier si on a un code de session dans l'URL
onMounted(async () => {
  const sessionCode = route.query.code
  if (sessionCode) {
    await loadSessionByCode(sessionCode)
  }
})

// Charger une session existante par son code
const loadSessionByCode = async (code) => {
  try {
    const session = await getSessionByCode(code)
    if (session) {
      console.log('Session chargée:', session) // Pour déboguer

      // Mettre à jour les données du formulaire avec les données de la session
      formData.value = {
        ...formData.value,
        selectedDay: session.selected_day,
        selectedTime: session.selected_time,
        participants: session.participants,
        hasAccessibilityNeeds: session.has_accessibility_needs,
        accessibilityDetails: session.accessibility_details,
        sessionCode: session.code,
        sessionId: session.id // Assurez-vous que cette ligne est présente
      }

      // Si on a un paramètre memory=true, aller directement au formulaire de souvenirs
      if (route.query.memory === 'true') {
        startMemoryForm()
      } else {
        // Sinon, aller à la page de confirmation
        currentStep.value = 2 // Index de SuccessPage
        emit('step-change', currentStep.value)
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la session:', error)
  }
}

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

  // Rediriger vers la page de confirmation ou de liste des souvenirs
  navigateTo(`/session/${formData.value.sessionCode}`)
}
</script>