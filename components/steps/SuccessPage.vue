<template>
  <div class="p-8 flex flex-col min-h-[500px]">
    <div class="flex justify-between mb-6">
      <button class="flex items-center text-sm" @click="prevStep">
        <Icon name="material-symbols:arrow-back-rounded" class="mr-1" />
        Retour
      </button>
      <button class="text-sm underline" @click="skipStep">
        Passer
      </button>
    </div>

    <div class="flex-1 flex flex-col">
      <h2 class="text-xl font-bold mb-4">Félicitations, vous venez de créer votre session !</h2>

      <p class="text-gray-600 mb-8">
        Vous pouvez maintenant compléter les souvenirs que vous allez vous raconter à <em>La Veillée</em>.
      </p>

      <div class="mb-8">
        <p class="mb-4">Envoyez un lien à vos proches pour qu'ils complètent leur souvenir !</p>
        <div class="flex">
          <div class="flex items-center bg-gray-100 rounded p-2">
            <span class="flex-1 font-mono text-base px-2">{{ formData.sessionCode }}</span>
            <button class="p-2" @click="copyCode">
              <Icon name="ion:copy" class="bg-gray-600" />
            </button>
          </div>
          <button class="p-2">
            <Icon name="lucide:share" class="bg-gray-600"/>
          </button>
        </div>
      </div>

      <button
          class="mt-auto w-full py-3 px-4 bg-gray-200 rounded-full text-center"
          @click="enterMemory"
      >
        Je rentre un souvenir
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['prev-step', 'complete', 'start-memory'])
const { createSession } = useSupabase()
const isCreating = ref(false)
const sessionCreated = ref(false)
const sessionData = ref(null)

// Navigation
const prevStep = () => {
  emit('prev-step')
}

const skipStep = () => {
  emit('complete')
}

// Créer la session dans Supabase
const createSessionInSupabase = async () => {
  if (sessionCreated.value) return

  isCreating.value = true

  try {
    const session = await createSession(props.formData)
    sessionData.value = session
    sessionCreated.value = true

    console.log('Session créée:', session) // Pour déboguer

    // Mettre à jour le code de session et l'ID de session dans le formulaire
    emit('update:form-data', {
      ...props.formData,
      sessionCode: session.code,
      sessionId: session.id // Assurez-vous que cette ligne est présente
    })
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error)
    alert('Une erreur est survenue lors de la création de la session')
  } finally {
    isCreating.value = false
  }
}

// Appeler la création de session au montage du composant
onMounted(async () => {
  if (!props.formData.sessionCode) {
    await createSessionInSupabase()
  } else {
    sessionCreated.value = true
    sessionData.value = { code: props.formData.sessionCode }
  }
})

// Copier le code
const copyCode = () => {
  navigator.clipboard.writeText(props.formData.sessionCode)
      .then(() => {
        alert('Code copié dans le presse-papier !')
      })
      .catch(err => {
        console.error('Erreur lors de la copie :', err)
      })
}

// Entrer un souvenir
const enterMemory = () => {
  emit('start-memory')
}
</script>