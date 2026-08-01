<script setup>
defineProps({
  url: { type: String, required: true },
  caption: { type: String, default: '' },
})
</script>

<template>
  <div class="abt-surface overflow-hidden">
    <img :src="url" :alt="caption || 'Foto del evento'" class="img-fluid w-100" />
  </div>
</template>
