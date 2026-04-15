<script setup>
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
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 2px solid #000;
  background: #FFFDF5;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  outline: none;
  border-radius: 0;
  box-sizing: border-box;
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