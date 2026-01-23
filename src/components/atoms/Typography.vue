<script setup>
import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'p'
  },
  variant: {
    type: String,
    default: 'body',
    validator: (value) => ['h1', 'h2', 'h3', 'body', 'caption'].includes(value)
  },
  color: {
    type: String,
    default: 'inherit'
  },
  bold: {
    type: Boolean,
    default: false
  }
})

const classes = computed(() => {
  return {
    [`typography--${props.variant}`]: true,
    'typography--bold': props.bold
  }
})
</script>

<template>
  <component 
    :is="tag" 
    class="typography" 
    :class="classes"
    :style="{ color: color }"
  >
    <slot />
  </component>
</template>

<style scoped>
.typography {
  margin: 0;
  font-family: 'Montserrat', sans-serif;  line-height: 1.5;
  transition: color 0.3s;
}

.typography--h1 {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.typography--h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.typography--h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.typography--body {
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.typography--caption {
  font-size: 0.8rem;
  color: #666;
}

.typography--bold {
  font-weight: 700 !important;
}
</style>