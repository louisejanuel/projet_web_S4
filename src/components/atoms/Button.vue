<script setup>
import { computed } from 'vue'
// Assure-toi que le chemin vers tes icônes est correct
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
  
  /* MODIFICATION ICI : Style "Flat" (Plat) */
  border: 2px solid #000;
  box-shadow: none; /* On enlève l'ombre portée */
  background: white;
  color: black;
  border-radius: 0px;
}

/* Au clic, on change juste un peu l'opacité ou la couleur au lieu de déplacer le bouton */
.btn:active {
  transform: none; /* Plus de déplacement */
  box-shadow: none;
  opacity: 0.9;
}

.btn--full {
  width: 100%;
}

/* --- VARIANTE : PRIMARY (Orange) --- */
.btn--primary {
  background-color: #FF8F50; 
}
.btn--primary:hover {
  background-color: #ff7b2e;
}

/* --- VARIANTE : SECONDARY (Blanc/Gris clair pour les filtres) --- */
.btn--secondary {
  background-color: #fff;
}
.btn--secondary:hover {
  background-color: #f0f0f0;
}

/* --- VARIANTE : NAV (Sidebar) --- */
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

/* --- VARIANTE : LINK (Header) --- */
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
</style>