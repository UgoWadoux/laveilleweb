<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6 text-center">{{ stepTitles[currentStep] }}</h1>
      <MultiStepForm @step-change="updateCurrentStep" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MultiStepForm from '~/components/MultiStepForm.vue'

const currentStep = ref(0)
const stepTitles = [
  'Choix créneau',
  'Infos groupe accessibilité non',
  'Page de transition'
]

const updateCurrentStep = (step) => {
  currentStep.value = step
}
</script>