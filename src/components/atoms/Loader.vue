<template>
  <div class="loader"></div>
</template>

<style scoped>
.loader {
  width: 24px;
  height: 24px;
  border: 4px solid #000; /* Bordure noire épaisse */
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>