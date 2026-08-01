<script setup>
defineProps({
  videoId: { type: String, required: true },
  title: { type: String, default: 'Video de YouTube' },
})
</script>

<template>
  <div class="ratio ratio-16x9 abt-surface overflow-hidden">
    <iframe
      :src="`https://www.youtube.com/embed/${videoId}`"
      :title="title"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      frameborder="0"
    ></iframe>
  </div>
</template>
