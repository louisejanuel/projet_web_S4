<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Button from '@/components/atoms/Button.vue'

const props = defineProps({
  label: String,
  options: Array,
  modelValue: Array,    
  singleSelect: Boolean
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref(null)

// Gestion du clic extérieur pour fermer le menu
const closeOnClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeOnClickOutside))
onUnmounted(() => document.removeEventListener('click', closeOnClickOutside))

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleSelection = (optionValue) => {
  let newValues = [...props.modelValue]

  if (props.singleSelect) {
    // Mode unique (ex: Tri) : on remplace tout par la nouvelle valeur
    newValues = [optionValue]
    isOpen.value = false // On ferme après le choix pour l'UX
  } else {
    // Mode multiple (ex: Catégories) : on ajoute ou on enlève
    if (newValues.includes(optionValue)) {
      newValues = newValues.filter(v => v !== optionValue)
    } else {
      newValues.push(optionValue)
    }
  }
  
  emit('update:modelValue', newValues)
}
</script>

<template>
  <div class="filter-dropdown" ref="dropdownRef">
    <Button 
      variant="secondary" 
      :label="label + (modelValue.length > 0 && !singleSelect ? ' (' + modelValue.length + ')' : '')" 
      @click="toggleDropdown"
      class="dropdown-trigger"
      :style="isOpen ? 'background-color: #e0e0e0;' : ''"
    />

    <div v-if="isOpen" class="dropdown-menu">
      <div 
        v-for="option in options" 
        :key="option.value" 
        class="dropdown-item"
        @click="handleSelection(option.value)"
      >
        <div class="checkbox-visual" :class="{ checked: modelValue.includes(option.value) }">
          <span v-if="modelValue.includes(option.value)">✓</span>
        </div>
        
        <span class="item-label">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-dropdown {
  position: relative;
  display: inline-block;
}

/* Style du menu flottant */
.dropdown-menu {
  position: absolute;
  top: 110%; /* Juste en dessous du bouton */
  left: 0;
  background-color: #FFFDF5;
  border: 2px solid #000;
  min-width: 200px;
  box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background-color: #FDF6E3;
}

/* Visuel Checkbox/Radio */
.checkbox-visual {
  width: 18px;
  height: 18px;
  border: 2px solid #000;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  background: white;
}

.checkbox-visual.checked {
  background: #000;
  color: #fff;
}

.item-label {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
}
</style>