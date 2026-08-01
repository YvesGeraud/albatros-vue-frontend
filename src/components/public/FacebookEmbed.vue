<script setup>
defineProps({
  url: { type: String, required: true },
})
</script>

<template>
  <div class="abt-surface overflow-hidden">
    <div class="ratio ratio-16x9">
      <iframe
        :src="`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true`"
        title="Publicación de Facebook"
        style="border: none; overflow: hidden"
        scrolling="no"
        frameborder="0"
        allowfullscreen="true"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      ></iframe>
    </div>
    <div class="text-center py-2">
      <a :href="url" target="_blank" rel="noopener" class="small abt-mono">Ver en Facebook ↗</a>
    </div>
  </div>
</template>
