<script setup>
defineProps({
  thickness: {
    type: String,
    default: '2px' // Épais par défaut pour ton style
  },
  color: {
    type: String,
    default: '#000'
  },
  margin: {
    type: String,
    default: '2rem 0'
  }
})
</script>

<template>
  <hr 
    class="separator" 
    :style="{ 
      borderTopWidth: thickness, 
      borderColor: color,
      margin: margin
    }" 
  />
</template>

<style scoped>
.separator {
  border: none;
  border-top-style: solid;
  width: 100%;
  opacity: 1;
}
</style>