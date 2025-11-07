<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  heading?: string
  buttonText?: string
  buttonLink?: string
  buttonBackgroundSrc?: string
  patternSrc?: string
  backgroundColor?: string
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  heading: "We’re now open in Leeds! Reserve your table at India Bistro UK today and enjoy the best Indian food in town.",
  buttonText: 'BOOK A TABLE',
  buttonLink: '/contact',
  buttonBackgroundSrc: new URL('../assets/images/button_orange_bg_diamond.svg', import.meta.url).href,
  patternSrc: new URL('../assets/images/home_popup_pattern.svg', import.meta.url).href,
  backgroundColor: '#AA8137',
  textColor: '#FFFFFF'
})

const isVisible = ref(false)
const DISPLAY_INTERVAL_MS = 24 * 60 * 60 * 1000
const STORAGE_KEY = 'ib-home-popup-last-shown'
const POPUP_DELAY_MS = 1000
let showTimer: number | null = null

const canUseLocalStorage = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false
    }

    const testKey = '__ib_popup_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

const hasSeenPopupRecently = () => {
  if (!canUseLocalStorage()) {
    return false
  }

  const lastShownRaw = window.localStorage.getItem(STORAGE_KEY)
  if (!lastShownRaw) {
    return false
  }

  const lastShown = Number(lastShownRaw)
  if (Number.isNaN(lastShown)) {
    return false
  }

  return Date.now() - lastShown < DISPLAY_INTERVAL_MS
}

const markPopupShown = () => {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, Date.now().toString())
}

onMounted(() => {
  if (hasSeenPopupRecently()) {
    return
  }

  showTimer = window.setTimeout(() => {
    isVisible.value = true
    markPopupShown()
  }, POPUP_DELAY_MS)
})

const closePopup = () => {
  isVisible.value = false
}

onUnmounted(() => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="popup-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
        @click="closePopup"
      >
        <div
          class="popup-container relative flex overflow-hidden shadow-2xl h-full"
          @click.stop
          :style="{ backgroundColor: props.backgroundColor }"
        >
          <!-- Close Button -->
          <button
            @click="closePopup"
            class="absolute right-4 top-4 z-10 flex w-8 items-center justify-center rounded-full bg-black/20 text-white transition-all hover:bg-black/40 hover:scale-110 p-2"
            aria-label="Close popup"
          >
            <svg height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          
          <!-- Left Side - Pattern -->
          <div
            class="hidden w-1/2 bg-repeat-y h-full md:block"
            :style="{
              backgroundImage: `url(${props.patternSrc})`,
              opacity: 1.0,
              backgroundSize: 'contain',
              backgroundPosition: 'center'
            }"
          ></div>

          <!-- Right Side - Content -->
          <div class="flex w-full flex-col items-center justify-center gap-8 px-8 py-12 md:w-1/2 md:px-12 md:py-16">
            <!-- Heading -->
            <h2
              class="text-center font-normal uppercase leading-tight tracking-[0.15em] md:text-2xl lg:text-3xl"
              :style="{
                color: props.textColor,
                fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem) !important'
              }"
            >
              {{ props.heading }}
            </h2>

            <!-- Button -->
            <a
              :href="props.buttonLink"
              class="tab-button relative inline-block transition-all duration-300 hover:scale-105"
            >
              <span class="tab-bg absolute inset-0">
                <img
                  :src="props.buttonBackgroundSrc"
                  alt="Button Decoration"
                  class="h-full w-full"
                />
              </span>
              <span class="tab-text relative z-10 block px-8 py-3 text-sm md:text-base lg:text-xl font-medium uppercase tracking-wider text-white md:px-10 md:py-4">
                {{ props.buttonText }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.popup-container {
  max-height: 70vh;
  max-width: 50vw;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .popup-container {
    width: 95%;
  }
}
</style>
