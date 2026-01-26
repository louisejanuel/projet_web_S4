<script setup>
import { ICONS } from '@/constants/icons'

const props = defineProps({
  isActive: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <button class="save-btn" @click.stop="emit('toggle')">
    <component 
      :is="ICONS.bookmark" 
      size="24" 
      :fill="isActive ? '#000' : 'none'" 
      color="#000"
      stroke-width="2.5"
    />
  </button>
</template>

<style scoped>
.save-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.save-btn:hover {
  transform: scale(1.1);
}

.save-btn:active {
  transform: scale(0.9);
}
</style>