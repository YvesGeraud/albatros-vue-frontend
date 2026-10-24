<script setup>
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import { submitPackageQuote } from '../../api/quotes'
import { useSiteStore } from '../../stores/site'
import { mergeEventPackages } from '../../data/eventPackages'

const siteStore = useSiteStore()
const packages = computed(() => mergeEventPackages(siteStore.eventPackages))
const activePackage = ref('estandar')

// --- Quote modal ---
const modalOpen = ref(false)
const submitting = ref(false)
const submitted = ref(false)
const errors = ref({})
const generalError = ref('')

const emptyForm = () => ({
  package: 'estandar',
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  guests: '',
  event_date: '',
  event_location: '',
  venue_type: '',
  notes: '',
})
const form = reactive(emptyForm())

const selectedPackage = computed(() => packages.value.find((p) => p.id === form.package))
const today = new Date().toISOString().slice(0, 10)

function openQuote(pkg) {
  Object.assign(form, emptyForm(), { package: pkg.id })
  errors.value = {}
  generalError.value = ''
  submitted.value = false
  modalOpen.value = true
}

function closeQuote() {
  if (submitting.value) return
  modalOpen.value = false
}

function onKeydown(e) {
  if (e.key === 'Escape') closeQuote()
}

watch(modalOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})

function validate() {
  const e = {}
  if (!form.customer_name.trim()) e.customer_name = 'Escribe tu nombre completo.'
  if (!form.customer_phone.trim() && !form.customer_email.trim()) {
    e.contact = 'Déjanos un teléfono o un correo para contactarte.'
  }
  if (form.customer_email && !/^\S+@\S+\.\S+$/.test(form.customer_email)) {
    e.customer_email = 'El correo no parece válido.'
  }
  if (!form.guests || Number(form.guests) < 1) e.guests = 'Indica cuántos invitados aproximadamente.'
  if (!form.event_location.trim()) e.event_location = 'Indica dónde será el evento.'
  if (!form.venue_type) e.venue_type = 'Selecciona si es salón o jardín.'
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  generalError.value = ''
  if (!validate()) return

  submitting.value = true
  try {
    await submitPackageQuote({
      ...form,
      guests: Number(form.guests),
      customer_phone: form.customer_phone || null,
      customer_email: form.customer_email || null,
      event_date: form.event_date || null,
      notes: form.notes || null,
    })
    submitted.value = true
  } catch (err) {
    const serverErrors = err.response?.data?.errors
    if (serverErrors) {
      errors.value = Object.fromEntries(Object.entries(serverErrors).map(([k, v]) => [k, v[0]]))
    }
    generalError.value = 'No pudimos enviar tu solicitud. Revisa los datos e inténtalo de nuevo.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section id="paquetes" class="abt-accordion-gallery-section">
    <div class="container">
      <!-- Section Header -->
      <div class="abt-gallery-intro text-center mb-5">
        <span class="abt-kicker abt-text-gold d-inline-block mb-2">
          ★ PAQUETES PARA EVENTOS ★
        </span>
        <h2 class="abt-display h1 text-white mb-3">
          Elige el Paquete <span class="abt-gradient-text">Ideal para tu Evento</span>
        </h2>
        <p class="abt-text-muted lead mx-auto mb-0" style="max-width: 46rem;">
          Tres niveles de producción pensados para cada tipo de celebración. Cuéntanos de tu evento y te enviaremos una cotización a la medida.
        </p>
      </div>

      <!-- Accordion Gallery Container -->
      <div class="abt-accordion-wrapper">
        <div
          v-for="item in packages"
          :key="item.id"
          class="abt-accordion-panel"
          :class="{ active: activePackage === item.id }"
          @click="activePackage = item.id"
          @mouseenter="activePackage = item.id"
        >
          <!-- Background Image with Overlay -->
          <div
            class="abt-accordion-bg"
            :style="{ backgroundImage: `url(${item.image})` }"
          ></div>
          <div class="abt-accordion-gradient"></div>

          <!-- Collapsed Label (Visible when panel is narrow) -->
          <div class="abt-collapsed-content">
            <span class="abt-collapsed-period">{{ item.name }}</span>
            <span class="abt-collapsed-genre">{{ item.tagline }}</span>
          </div>

          <!-- Expanded Content (Visible when active) -->
          <div class="abt-expanded-content">
            <div class="abt-expanded-inner">
              <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span class="abt-badge-decade" :style="{ borderColor: item.color, color: item.color }">
                  <i class="bi bi-stars me-1"></i> {{ item.badge }}
                </span>
                <span class="abt-badge-genre">
                  {{ item.tagline }}
                </span>
              </div>

              <h3 class="abt-panel-title abt-display">{{ item.title }}</h3>
              <p class="abt-panel-desc mb-3">{{ item.description }}</p>

              <div class="abt-panel-setup mb-4">
                <span class="abt-setup-label">Incluye:</span>
                <div class="d-flex gap-2 flex-wrap mt-1">
                  <span
                    v-for="tag in item.highlights"
                    :key="tag"
                    class="abt-setup-tag"
                  >
                    <i class="bi bi-check-circle-fill me-1" :style="{ color: item.color }"></i>
                    {{ tag }}
                  </span>
                </div>
              </div>

              <button type="button" class="abt-btn-neon" @click.stop="openQuote(item)">
                <i class="bi bi-chat-heart me-2"></i> Me interesa, cotizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quote Modal -->
    <Teleport to="body">
      <Transition name="abt-modal">
        <div
          v-if="modalOpen"
          class="abt-quote-backdrop"
          @click.self="closeQuote"
        >
          <div class="abt-quote-modal" role="dialog" aria-modal="true" aria-labelledby="abt-quote-title">
            <button type="button" class="abt-quote-close" aria-label="Cerrar" @click="closeQuote">
              <i class="bi bi-x-lg"></i>
            </button>

            <!-- Success state -->
            <div v-if="submitted" class="text-center py-4">
              <i class="bi bi-check-circle-fill abt-quote-success-icon"></i>
              <h3 class="abt-display h4 text-white mt-3 mb-2">¡Solicitud enviada!</h3>
              <p class="abt-text-muted mb-4">
                Recibimos tu interés en el <strong class="text-white">{{ selectedPackage?.title }}</strong>.
                Nuestro equipo se pondrá en contacto contigo muy pronto.
              </p>
              <button type="button" class="abt-btn-neon" @click="closeQuote">Listo</button>
            </div>

            <!-- Form -->
            <form v-else novalidate @submit.prevent="submit">
              <span class="abt-kicker d-block mb-1" :style="{ color: selectedPackage?.color }">
                COTIZACIÓN
              </span>
              <h3 id="abt-quote-title" class="abt-display h4 text-white mb-1">{{ selectedPackage?.title }}</h3>
              <p class="abt-text-muted small mb-4">Completa tus datos y te contactaremos con una cotización personalizada.</p>

              <div class="row g-3">
                <div class="col-12">
                  <label class="abt-quote-label" for="pq-package">Paquete</label>
                  <select id="pq-package" v-model="form.package" class="abt-quote-input">
                    <option v-for="p in packages" :key="p.id" :value="p.id">{{ p.title }}</option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="abt-quote-label" for="pq-name">Nombre completo *</label>
                  <input id="pq-name" v-model="form.customer_name" type="text" class="abt-quote-input" autocomplete="name" maxlength="255" />
                  <div v-if="errors.customer_name" class="abt-quote-error">{{ errors.customer_name }}</div>
                </div>

                <div class="col-sm-6">
                  <label class="abt-quote-label" for="pq-phone">Teléfono</label>
                  <input id="pq-phone" v-model="form.customer_phone" type="tel" class="abt-quote-input" autocomplete="tel" maxlength="30" />
                  <div v-if="errors.customer_phone" class="abt-quote-error">{{ errors.customer_phone }}</div>
                </div>
                <div class="col-sm-6">
                  <label class="abt-quote-label" for="pq-email">Correo electrónico</label>
                  <input id="pq-email" v-model="form.customer_email" type="email" class="abt-quote-input" autocomplete="email" maxlength="255" />
                  <div v-if="errors.customer_email" class="abt-quote-error">{{ errors.customer_email }}</div>
                </div>
                <div v-if="errors.contact" class="col-12 mt-1">
                  <div class="abt-quote-error">{{ errors.contact }}</div>
                </div>

                <div class="col-sm-6">
                  <label class="abt-quote-label" for="pq-guests">Número de invitados *</label>
                  <input id="pq-guests" v-model="form.guests" type="number" min="1" max="5000" class="abt-quote-input" />
                  <div v-if="errors.guests" class="abt-quote-error">{{ errors.guests }}</div>
                </div>
                <div class="col-sm-6">
                  <label class="abt-quote-label" for="pq-date">Fecha del evento</label>
                  <input id="pq-date" v-model="form.event_date" type="date" :min="today" class="abt-quote-input" />
                  <div v-if="errors.event_date" class="abt-quote-error">{{ errors.event_date }}</div>
                </div>

                <div class="col-sm-7">
                  <label class="abt-quote-label" for="pq-location">Ubicación del evento *</label>
                  <input
                    id="pq-location"
                    v-model="form.event_location"
                    type="text"
                    class="abt-quote-input"
                    placeholder="Ej. Salón Las Palmas, Apizaco, Tlax."
                    maxlength="255"
                  />
                  <div v-if="errors.event_location" class="abt-quote-error">{{ errors.event_location }}</div>
                </div>
                <div class="col-sm-5">
                  <label class="abt-quote-label" for="pq-venue">Tipo de lugar *</label>
                  <select id="pq-venue" v-model="form.venue_type" class="abt-quote-input">
                    <option value="" disabled>Selecciona...</option>
                    <option value="salon">Salón</option>
                    <option value="jardin">Jardín</option>
                  </select>
                  <div v-if="errors.venue_type" class="abt-quote-error">{{ errors.venue_type }}</div>
                </div>

                <div class="col-12">
                  <label class="abt-quote-label" for="pq-notes">Comentarios (opcional)</label>
                  <textarea id="pq-notes" v-model="form.notes" rows="2" class="abt-quote-input" maxlength="2000" placeholder="Tipo de evento, horario, peticiones especiales..."></textarea>
                </div>
              </div>

              <div v-if="generalError" class="abt-quote-error mt-3">{{ generalError }}</div>

              <div class="d-flex justify-content-end gap-2 mt-4">
                <button type="button" class="abt-btn-outline" :disabled="submitting" @click="closeQuote">Cancelar</button>
                <button type="submit" class="abt-btn-neon" :disabled="submitting">
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  {{ submitting ? 'Enviando...' : 'Enviar solicitud' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.abt-accordion-gallery-section {
  padding: 5.5rem 0;
  background: radial-gradient(circle at 50% 10%, rgba(22, 19, 31, 0.8) 0%, #0a0912 100%);
  position: relative;
  overflow: hidden;
}

.abt-kicker {
  font-family: var(--abt-font-mono);
  font-size: 0.82rem;
  letter-spacing: 2px;
  font-weight: 600;
}

.abt-text-gold {
  color: #f0a838;
}

.abt-gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #b06bff 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Accordion Outer Wrapper */
.abt-accordion-wrapper {
  display: flex;
  height: 520px;
  width: 100%;
  gap: 0.75rem;
  border-radius: 24px;
  overflow: hidden;
}

/* Individual Panel */
.abt-accordion-panel {
  position: relative;
  flex: 1;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: #16131f;
  border: 1px solid rgba(176, 107, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: flex 0.65s cubic-bezier(0.25, 1, 0.5, 1),
              border-color 0.3s ease,
              box-shadow 0.3s ease;
  user-select: none;
}

.abt-accordion-panel:hover {
  border-color: rgba(176, 107, 255, 0.45);
}

.abt-accordion-panel.active {
  flex: 3.5;
  border-color: rgba(176, 107, 255, 0.6);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(176, 107, 255, 0.2);
}

/* Background Image */
.abt-accordion-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: saturate(0.9) brightness(0.65);
  transform: scale(1.05);
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.5s ease;
}

.abt-accordion-panel:hover .abt-accordion-bg {
  filter: saturate(1.1) brightness(0.75);
}

.abt-accordion-panel.active .abt-accordion-bg {
  transform: scale(1);
  filter: saturate(1.15) brightness(0.8);
}

/* Dark Gradient Vignette */
.abt-accordion-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 9, 18, 0.2) 0%,
    rgba(10, 9, 18, 0.5) 40%,
    rgba(10, 9, 18, 0.95) 100%
  );
  transition: opacity 0.4s ease;
}

/* Collapsed Content (Vertical Package Name) */
.abt-collapsed-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 2.5rem;
  z-index: 3;
  opacity: 1;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.abt-accordion-panel.active .abt-collapsed-content {
  opacity: 0;
}

.abt-collapsed-period {
  font-family: var(--abt-font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.abt-collapsed-genre {
  display: none;
}

/* Expanded Content */
.abt-expanded-content {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2.5rem;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: opacity 0.5s ease 0.15s, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.15s;
}

.abt-accordion-panel.active .abt-expanded-content {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.abt-expanded-inner {
  max-width: 42rem;
}

.abt-badge-decade {
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-family: var(--abt-font-mono);
  font-weight: 700;
  background: rgba(10, 9, 18, 0.7);
  border: 1px solid;
  backdrop-filter: blur(8px);
}

.abt-badge-genre {
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  color: #f2effa;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
}

.abt-panel-title {
  color: #ffffff;
  font-size: 1.85rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}

.abt-panel-desc {
  color: #d1cbe5;
  font-size: 0.95rem;
  line-height: 1.55;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}

.abt-setup-label {
  font-size: 0.78rem;
  font-family: var(--abt-font-mono);
  color: #9d97b3;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.abt-setup-tag {
  display: inline-flex;
  align-items: center;
  font-size: 0.82rem;
  padding: 0.3rem 0.75rem;
  background: rgba(22, 19, 31, 0.75);
  border: 1px solid rgba(176, 107, 255, 0.25);
  border-radius: 9999px;
  color: #f2effa;
  backdrop-filter: blur(6px);
}

/* Quote Modal */
.abt-quote-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(5, 4, 10, 0.75);
  backdrop-filter: blur(6px);
  overflow-y: auto;
}

.abt-quote-modal {
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  padding: 2rem;
  background: var(--abt-surface);
  border: 1px solid rgba(176, 107, 255, 0.3);
  border-radius: 20px;
  box-shadow: var(--abt-shadow-lg), var(--abt-shadow-glow-purple);
}

.abt-quote-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: var(--abt-text);
  transition: background var(--abt-transition-fast);
}

.abt-quote-close:hover {
  background: rgba(255, 255, 255, 0.16);
}

.abt-quote-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.8rem;
  color: var(--abt-text-muted);
}

.abt-quote-input {
  width: 100%;
  padding: 0.6rem 0.85rem;
  font-size: 0.95rem;
  color: var(--abt-text);
  background: rgba(10, 9, 18, 0.7);
  border: 1px solid rgba(176, 107, 255, 0.2);
  border-radius: 10px;
  color-scheme: dark;
  transition: border-color var(--abt-transition-fast), box-shadow var(--abt-transition-fast);
}

.abt-quote-input:focus {
  outline: none;
  border-color: var(--abt-purple);
  box-shadow: 0 0 0 3px rgba(176, 107, 255, 0.2);
}

.abt-quote-input option {
  background: var(--abt-surface);
}

.abt-quote-error {
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: #ff7a8a;
}

.abt-quote-success-icon {
  font-size: 3.5rem;
  color: var(--abt-whatsapp);
}

.abt-modal-enter-active,
.abt-modal-leave-active {
  transition: opacity 0.25s ease;
}

.abt-modal-enter-active .abt-quote-modal,
.abt-modal-leave-active .abt-quote-modal {
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.abt-modal-enter-from,
.abt-modal-leave-to {
  opacity: 0;
}

.abt-modal-enter-from .abt-quote-modal,
.abt-modal-leave-to .abt-quote-modal {
  transform: translateY(20px) scale(0.98);
}

/* Responsive Behavior for Mobile & Tablets */
@media (max-width: 991px) {
  .abt-accordion-wrapper {
    flex-direction: column;
    height: auto;
    gap: 0.85rem;
  }

  .abt-accordion-panel {
    flex: none;
    height: 120px;
    transition: height 0.6s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease;
  }

  .abt-accordion-panel.active {
    flex: none;
    height: 460px;
  }

  .abt-collapsed-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    height: 100%;
  }

  .abt-collapsed-period {
    writing-mode: horizontal-tb;
    transform: none;
    font-size: 1.5rem;
  }

  .abt-collapsed-genre {
    display: inline-block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
  }

  .abt-expanded-content {
    padding: 1.5rem;
  }

  .abt-panel-title {
    font-size: 1.4rem;
  }

  .abt-panel-desc {
    font-size: 0.88rem;
  }

  .abt-quote-modal {
    padding: 1.5rem;
  }
}
</style>
