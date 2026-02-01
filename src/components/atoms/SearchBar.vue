<script setup>
// Props : Ce que le composant reçoit
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Rechercher...'
  }
})

// Emits : Les événements qu'il envoie au parent
// 'update:modelValue' est nécessaire pour que v-model fonctionne
const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="search-wrapper">
    <input 
      type="text" 
      :value="modelValue"
      @input="handleInput"
      @keyup.enter="emit('search')"
      :placeholder="placeholder" 
      class="search-input"
    />
    
    <button 
      v-if="modelValue" 
      @click="emit('clear')" 
      class="clear-btn"
      title="Effacer"
    >
      &times;
    </button>
  </div>
</template>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 300px; /* Largeur max par défaut */
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 15px; /* Place pour la croix à droite */
  border: 2px solid #000;
  background: #FFFDF5;
  font-family: 'Montserrat', sans-serif; /* Ou ta font globale */
  font-size: 0.9rem;
  outline: none;
  border-radius: 0;
  box-sizing: border-box; /* Important pour que le padding ne casse pas la largeur */
  transition: background 0.2s;
}

.search-input:focus {
  background: #fff;
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  color: #666;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  color: #000;
}
</style>