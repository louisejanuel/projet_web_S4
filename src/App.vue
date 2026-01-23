<script setup>
import { ref, computed } from 'vue'
import Typography from './components/atoms/Typography.vue'
import Button from './components/atoms/Button.vue'
import { ICONS } from '@/constants/icons' // Juste pour récupérer l'icone MapPin pour le header

// Gestion des onglets
const currentTab = ref('home') 

const menuItems = [
  { id: 'home', label: 'Home', icon: 'house' },
  { id: 'explorer', label: 'Explorer', icon: 'search' },
  { id: 'saved', label: 'Enregistrés', icon: 'bookmark' },
]

const currentTabLabel = computed(() => {
  const item = menuItems.find(i => i.id === currentTab.value)
  return item ? item.label : 'Tickest'
})
</script>

<template>
  <div class="app-layout">
    
    <aside class="sidebar">
      <div class="logo-container">
        <img src="./assets/logo_tickest.png" alt="Tickest Logo" class="logo-img" />
      </div>

      <nav class="nav-menu">
        <Button 
          v-for="item in menuItems" 
          :key="item.id"
          variant="nav" 
          fullWidth
          :iconName="item.icon"
          :label="item.label"
          :isActive="currentTab === item.id"
          @click="currentTab = item.id"
        />
      </nav>

      </aside>

    <main class="main-content">
      
      <header class="top-bar">
        <Typography tag="h1" variant="h2">
          {{ currentTabLabel }}
        </Typography>
        
        <div class="location-badge">
          <component :is="ICONS.location" size="20" stroke-width="2.5" />
          <Typography tag="span" variant="body" bold style="margin:0;">Paris, FR</Typography>
        </div>
      </header>

      <div class="content-area">
        
        <div v-if="currentTab === 'home'">
          <Typography tag="p" variant="body">Bienvenue sur la home de Tickest.</Typography>
        </div>

        <div v-if="currentTab === 'explorer'">
          <Typography tag="p" variant="body">Barre de recherche et filtres ici...</Typography>
        </div>

        <div v-if="currentTab === 'saved'">
          <Typography tag="p" variant="body">Tes événements favoris.</Typography>
        </div>

      </div>

    </main>

  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #FDF6E3; 
}
</style>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* --- SIDEBAR STYLE --- */
.sidebar {
  width: 220px;
  background-color: #A8D5BA; 
  border-right: 3px solid #000; 
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo-img {
  width: 150px;
  object-fit: contain;
  /* filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.2));  */
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* --- MAIN CONTENT STYLE --- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #FFFDF5; 
  overflow-y: auto;
}

.top-bar {
  padding: 2rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #000;
  background-color: #FFD27F; 
}

.location-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid #000;
  background-color: white;
  box-shadow: 4px 4px 0px #000;
  font-family: 'Montserrat', sans-serif;
}

.content-area {
  padding: 3rem;
}
</style>