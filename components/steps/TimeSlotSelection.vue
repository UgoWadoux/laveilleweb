<template>
  <div class="p-8">
    <h2 class="text-xl font-bold mb-6">Choisissez votre créneau !</h2>

    <div class="mb-6">
      <h3 class="font-bold mb-1">Créneaux disponibles</h3>
      <p class="text-sm text-gray-600 mb-4">
        Les sessions se font par demi-journées.<br>
        Choisissez votre jour puis votre horaire.
      </p>

      <div class="flex items-center justify-between mb-6">
        <button class="text-lg" @click="prevWeek">&lt;</button>
        <span class="font-medium">Cette semaine</span>
        <button class="text-lg" @click="nextWeek">&gt;</button>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-6">
        <button
            v-for="day in availableDays"
            :key="day.value"
            class="border rounded-md py-3 px-4 text-center transition-colors"
            :class="formData.selectedDay === day.value ? 'border-gray-800 bg-gray-100' : 'border-gray-300'"
            @click="selectDay(day.value)"
        >
          {{ day.label }}
        </button>
      </div>

      <div class="mt-6">
        <h3 class="font-bold mb-3">Horaire</h3>
        <div class="flex gap-4">
          <button
              class="flex-1 py-2 px-4 rounded-full border transition-colors"
              :class="formData.selectedTime === 'matin' ? 'border-gray-800 bg-gray-100' : 'border-gray-300'"
              @click="selectTime('matin')"
          >
            Matin
          </button>
          <button
              class="flex-1 py-2 px-4 rounded-full border transition-colors"
              :class="formData.selectedTime === 'apres-midi' ? 'border-gray-800 bg-gray-100' : 'border-gray-300'"
              @click="selectTime('apres-midi')"
          >
            Après-midi
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <button
          class="w-full py-3 px-4 bg-gray-200 rounded-full text-center transition-colors disabled:opacity-50"
          :disabled="!isFormValid"
          @click="submitStep"
      >
        Valider le créneau
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:form-data', 'next-step'])

// Jours disponibles (exemple)
const availableDays = ref([
  { label: 'Lundi 9 mai', value: 'lundi-9' },
  { label: 'Mardi 10 mai', value: 'mardi-10' },
  { label: 'Mercredi 11 mai', value: 'mercredi-11' },
  { label: 'Jeudi 12 mai', value: 'jeudi-12' },
  { label: 'Vendredi 13 mai', value: 'vendredi-13' },
  { label: 'Samedi 14 mai', value: 'samedi-14' }
])

// Navigation entre les semaines
const prevWeek = () => {
  // Logique pour afficher la semaine précédente
}

const nextWeek = () => {
  // Logique pour afficher la semaine suivante
}

// Sélection du jour et de l'heure
const selectDay = (day) => {
  emit('update:form-data', { ...props.formData, selectedDay: day })
}

const selectTime = (time) => {
  emit('update:form-data', { ...props.formData, selectedTime: time })
}

// Validation du formulaire
const isFormValid = computed(() => {
  return props.formData.selectedDay && props.formData.selectedTime
})

// Soumission de l'étape
const submitStep = () => {
  if (isFormValid.value) {
    emit('next-step')
  }
}
</script>