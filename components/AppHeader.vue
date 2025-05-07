<script setup lang="ts">

</script>

<template>
  <header class="header bg-gray-100 h-24 flex items-center justify-between">
    <p>Logo</p>
    <nav>
      <ul class="flex items-center justify-between flex-row gap-x-2">
        <NuxtLink to="/" >
          <span>Home</span>
        </NuxtLink>
        <NuxtLink to="/reservation" >
          <span>Reservation</span>
        </NuxtLink>
      </ul>
    </nav>
  </header>
</template>

<style scoped>

</style>