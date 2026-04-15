<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from './components/atoms/Button.vue'
import SearchBar from './components/atoms/SearchBar.vue' 

const router = useRouter()
const route = useRoute() // Permet de savoir sur quelle page on est

const searchQuery = ref('') 

const menuItems = [
  { id: '/', label: 'Home' },
  { id: '/explorer', label: 'Explorer' },
  { id: '/saved', label: 'Enregistrés' },
]

// Si on cherche depuis n'importe où, on redirige vers Explorer
const handleSearch = () => {
  router.push('/explorer')
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="app-layout">
    
    <header class="main-header">
      <div class="header-left">
        <img 
          src="./assets/logo_book.png" 
          alt="Dog-eared page" 
          class="logo-img" 
          @click="router.push('/')" 
        />
      </div>

      <div class="header-right">
        <div class="search-container">
          <SearchBar 
            v-model="searchQuery" 
            placeholder="Rechercher un livre, un auteur..." 
            @search="handleSearch"
            @clear="clearSearch"
          />
        </div>
        <nav class="top-nav">
          <Button 
            v-for="item in menuItems" 
            :key="item.id"
            variant="link" 
            :label="item.label"
            :isActive="route.path === item.id"
            @click="router.push(item.id)"
          />
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view :globalSearchQuery="searchQuery" />
    </main>

    <footer class="main-footer">
      <span>The Dog-Eared Page</span>
      <span>© Louise Januel - IMAC 2026 - Tous droits réservés</span>
    </footer>

  </div>
</template>

<style>
html, body {
  margin: 0; padding: 0; height: 100%; background-color: #FDF6E3; 
}
</style>

<style scoped>
.app-layout { 
  display: flex; 
  flex-direction: column; 
  min-height: 100vh;
  width: 100vw;
}

.main-header { background-color: #AAD7B8; display: flex; align-items: center; justify-content: space-between; padding: 0 3rem; border-bottom: 3px solid #000; height: 100px; flex-shrink: 0; }
.header-left .logo-img { height: 120px; object-fit: contain; position: relative; cursor: pointer; }
.header-right { display: flex; align-items: center; gap: 2rem; }
.search-container { width: 300px; }
.top-nav { display: flex; align-items: center; }

.main-content { 
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #FFFDF5; 
}

.main-footer {
  background-color: #AAD7B8;
  border-top: 3px solid #000;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3rem;
  flex-shrink: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .main-header { 
    padding: 1rem; 
    height: auto; 
    flex-direction: column; 
    gap: 1rem; 
  }
  .header-left .logo-img { 
    height: 60px; 
    margin-bottom: 0;
  }
  .header-right { 
    flex-direction: column-reverse; 
    width: 100%; 
    gap: 1rem; 
    align-items: center; 
  }
  .search-container { 
    width: 100%; 
  }
  .top-nav { 
    justify-content: center; 
    flex-wrap: wrap; 
    gap: 0.5rem; 
  }
  .main-footer {
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 5px;
    text-align: center;
  }
}
</style>