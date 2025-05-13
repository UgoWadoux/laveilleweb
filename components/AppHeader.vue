<template>
  <header class="bg-gray-100 h-24 flex items-center px-4 relative">
    <!-- Burger menu à gauche (mobile) -->
    <button
        class="md:hidden mr-4"
        @click="menuOpen = !menuOpen"
        aria-label="Ouvrir le menu"
    >
      <span class="relative w-8 h-8 flex flex-col justify-center items-center">
        <span
            class="block h-1 w-8 bg-gray-800 rounded transition-all duration-300"
            :class="menuOpen ? 'rotate-45 translate-y-2' : ''"
        ></span>
        <span
            class="block h-1 w-8 bg-gray-800 rounded my-1 transition-all duration-300"
            :class="menuOpen ? 'opacity-0' : ''"
        ></span>
        <span
            class="block h-1 w-8 bg-gray-800 rounded transition-all duration-300"
            :class="menuOpen ? '-rotate-45 -translate-y-2' : ''"
        ></span>
      </span>
    </button>
    <!-- Logo -->
    <p class="font-bold text-lg flex-1">Logo</p>
    <!-- Navigation desktop -->
    <nav class="hidden md:block">
      <ul class="flex gap-x-6">
        <li>
          <NuxtLink to="/" class="text-gray-800 hover:text-blue-500 transition">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/reservation" class="text-gray-800 hover:text-blue-500 transition">Reservation</NuxtLink>
        </li>
      </ul>
    </nav>
    <!-- Menu mobile -->
    <transition name="slide-down">
      <nav
          v-if="menuOpen"
          class="absolute top-full left-0 w-full bg-gray-100 shadow-md md:hidden z-20"
      >
        <ul class="flex flex-col py-4 px-6 gap-y-2">
          <li>
            <NuxtLink to="/" class="text-gray-800 py-2 block hover:text-blue-500" @click="menuOpen = false">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/reservation" class="text-gray-800 py-2 block hover:text-blue-500" @click="menuOpen = false">Reservation</NuxtLink>
          </li>
        </ul>
      </nav>
    </transition>
  </header>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const menuOpen = ref(false)
</script>

<style scoped>

</style>
