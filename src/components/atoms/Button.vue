<script setup>
import { computed } from 'vue'
import { ICONS } from '@/constants/icons'

const props = defineProps({
  label: { type: String, default: '' },
  iconName: { type: String, default: null },
  variant: {
    type: String,
    default: 'primary', // primary, secondary, nav, link
  },
  isActive: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const iconComponent = computed(() => {
  return props.iconName ? ICONS[props.iconName] : null
})

const classes = computed(() => {
  return {
    [`btn--${props.variant}`]: true,
    'btn--active': props.isActive,
    'btn--full': props.fullWidth
  }
})
</script>

<template>
  <button class="btn" :class="classes" @click="emit('click')">
    <component 
      v-if="iconComponent" 
      :is="iconComponent" 
      class="btn-icon" 
      :size="20" 
      stroke-width="2.5"
    />
    <span v-if="label" class="btn-label">{{ label }}</span>
    <slot />
  </button>
</template>

<style scoped>
/* --- BASE --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 20px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  border: 2px solid #000;
  box-shadow: none;
  background: white;
  color: black;
  border-radius: 0px;
}

.btn:active {
  transform: none;
  box-shadow: none;
  opacity: 0.9;
}

.btn--full {
  width: 100%;
}

/* PRIMARY */
.btn--primary {
  background-color: #FF8F50; 
}
.btn--primary:hover {
  background-color: #ff7b2e;
}

/* SECONDARY */
.btn--secondary {
  background-color: #fff;
}
.btn--secondary:hover {
  background-color: #f0f0f0;
}

/* NAV */
.btn--nav {
  border: 2px solid transparent;
  background-color: transparent;
  color: #333;
  justify-content: flex-start;
  padding-left: 20px;
}
.btn--nav:hover {
  background-color: rgba(0,0,0, 0.05);
  border: 2px solid #000;
}
.btn--nav.btn--active {
  background-color: #fff;
  border: 2px solid #000;
}

/* LINK */
.btn--link {
  background: transparent;
  border: none;
  box-shadow: none;
  color: #666;
  padding: 0.5rem 0;
  margin: 0 1rem;
}

.btn--link:hover {
  color: #000;
}

.btn--link.btn--active {
  color: #000;
  border-bottom: 3px solid #000; 
  background: transparent;
}

@media (max-width: 768px) {
  .btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  .btn--link {
    margin: 0 0.25rem;
    padding: 0.25rem 0;
  }
}
</style>