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
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['prev-step', 'complete', 'start-memory'])

// Navigation
const prevStep = () => {
  emit('prev-step')
}

const skipStep = () => {
  emit('complete')
}

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

// Entrer un souvenir - maintenant ça passe à l'étape suivante du même formulaire
const enterMemory = () => {
  emit('start-memory')
}
</script>