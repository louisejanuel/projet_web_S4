<script setup>
import { ref, watch } from 'vue'
import Loader from './Loader.vue'
import { ICONS } from '@/constants/icons'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: 'Image' },
  aspectRatio: { type: String, default: '3/2' }
})

const isLoading = ref(true)
const hasError = ref(false)

// si la source change, on reset les états
watch(() => props.src, () => {
  isLoading.value = true
  hasError.value = false
})

const onLoad = () => { isLoading.value = false }
const onError = () => { 
  isLoading.value = false 
  hasError.value = true 
}
</script>

<template>
  <div class="image-wrapper" :style="{ aspectRatio: aspectRatio }">
    <div v-if="isLoading" class="state-container">
      <Loader />
    </div>

    <div v-if="hasError" class="state-container error-state">
      <component :is="ICONS.image" size="32" color="#666" />
    </div>

    <img 
      v-show="!isLoading && !hasError"
      :src="src" 
      :alt="alt" 
      class="remote-img"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<style scoped>
.image-wrapper {
  position: relative;
  width: 100%;
  background-color: #eee;
  border: 2px solid #000; /* Le cadre noir de l'image */
  overflow: hidden;
}

.state-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.remote-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>