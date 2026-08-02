<script setup>
import { onMounted, ref } from 'vue'
import { fetchTestimonials } from '../../api/testimonials'

const testimonials = ref([])

onMounted(async () => {
  try {
    testimonials.value = await fetchTestimonials()
  } catch {
    testimonials.value = []
  }
})
</script>

<template>
  <section v-if="testimonials.length" class="container py-5">
    <h2 class="abt-display h3 mb-4">Lo que dicen quienes ya bailaron con nosotros</h2>
    <div class="row g-3">
      <div v-for="testimonial in testimonials" :key="testimonial.id" class="col-md-4">
        <div class="abt-surface abt-card-accent abt-card-accent-purple p-3 h-100 d-flex flex-column">
          <span v-if="testimonial.rating" class="abt-kicker abt-text-purple mb-2">
            {{ '★'.repeat(testimonial.rating) }}{{ '☆'.repeat(5 - testimonial.rating) }}
          </span>
          <p class="small flex-grow-1 fst-italic" style="color: var(--abt-text);">
            “{{ testimonial.content }}”
          </p>
          <div class="d-flex align-items-center gap-2 mt-2">
            <img
              v-if="testimonial.avatar_url"
              :src="testimonial.avatar_url"
              class="rounded-circle"
              style="width: 40px; height: 40px; object-fit: cover;"
              :alt="testimonial.customer_name"
            />
            <div>
              <div class="small fw-semibold" style="color: var(--abt-text);">{{ testimonial.customer_name }}</div>
              <div v-if="testimonial.event_type" class="abt-mono small abt-text-muted">{{ testimonial.event_type }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
