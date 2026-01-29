<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchBooks } from '@/services/googleBooks' 
import Typography from './components/atoms/Typography.vue'
import Button from './components/atoms/Button.vue'
import EventCard from './components/molecules/EventCard.vue'

// --- DONNÉES ---
const books = ref([]) 
const isLoading = ref(false)

// --- PAGINATION ---
const currentPage = ref(0)       // Page actuelle (commence à 0)
const maxResults = 40         // Maximum autorisé par l'API Google
const totalItems = ref(0)        // (Optionnel) pour savoir si on peut encore avancer

// Fonction de chargement principale
const loadBooks = async () => {
  isLoading.value = true
  
  // Calcul de l'index de départ (ex: page 0 = 0, page 1 = 40, page 2 = 80...)
  const startIndex = currentPage.value * maxResults
  
  // Requête "*" = tout chercher. 
  // On passe startIndex et maxResults à la fonction fetchBooks
  try {
    const query = 'subject:fiction'
    const data = await fetchBooks(query, startIndex, maxResults)
    // Selon comment est fait ton service, adapte ici. 
    // Si fetchBooks renvoie directement un tableau :
    books.value = data || []

    // Remonter en haut de page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  
    isLoading.value = false
    
    // Si tu veux gérer le scroll vers le haut à chaque changement de page
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
  } catch (e) {
    console.error(e)
    books.value = []
  }
  
  isLoading.value = false
}

// Navigation
const nextPage = () => {
  // On n'avance que s'il y a des livres sur la page actuelle
  if (books.value.length > 0) {
    currentPage.value++
    loadBooks()
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    loadBooks()
  }
}

// Au chargement
onMounted(() => {
  loadBooks()
})

// --- NAVIGATION TABS ---
const currentTab = ref('explorer') 
const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'explorer', label: 'Explorer' },
  { id: 'saved', label: 'Enregistrés' },
]

// --- ACTIONS ---
const toggleFav = (id) => {
  const book = books.value.find(b => b.id === id)
  if (book) book.isFav = !book.isFav
}

const openPreview = (url) => {
  if (url) window.open(url, '_blank')
}
</script>

<template>
  <div class="app-layout">
    
    <header class="main-header">
      <div class="header-left">
        <img src="./assets/logo_tickest.png" alt="Tickest" class="logo-img" />
      </div>

      <div class="header-right">
        <nav class="top-nav">
          <Button 
            v-for="item in menuItems" 
            :key="item.id"
            variant="link" 
            :label="item.label"
            :isActive="currentTab === item.id"
            @click="currentTab = item.id"
          />
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="content-area">
        
        <div v-if="currentTab === 'explorer'">
          <div class="explorer-header">
            <Typography tag="h2" variant="h2">Explorer la bibliothèque</Typography>
            <Typography tag="p" variant="body">Page {{ currentPage + 1 }}</Typography>
          </div>

          <div v-if="isLoading" class="loader-container">
            <Typography tag="h3" variant="h3">Chargement des livres...</Typography>
          </div>

          <div v-else class="books-wrapper">
            <div class="books-grid">
              <EventCard 
                v-for="book in books"
                :key="book.id"
                class="grid-item"
                :title="book.title" 
                :subtitle="book.subtitle"
                :imageUrl="book.image"
                :description="book.description"
                :isFavorite="book.isFav"
                @toggleFavorite="toggleFav(book.id)"
                @clickDetail="openPreview(book.bookingUrl)"
              />
            </div>

            <div class="pagination-bar">
              <Button 
                label="Précédent" 
                variant="secondary" 
                :disabled="currentPage === 0"
                @click="prevPage"
              />
              
              <Typography tag="span" variant="body" style="font-weight: bold;">
                Page {{ currentPage + 1 }}
              </Typography>

              <Button 
              label="Suivant" 
              variant="secondary" 
              :disabled="books.length === 0 || isLoading"
              @click="nextPage"
              />
            </div>
          </div>
          
           <div v-if="!isLoading && books.length === 0" style="margin-top:2rem;">
             <Typography tag="p" variant="body">Aucun livre trouvé.</Typography>
          </div>
        </div>

        <div v-if="currentTab === 'home'">
          <Typography tag="h2" variant="h2">Bienvenue sur Tickest Books</Typography>
        </div>
        <div v-if="currentTab === 'saved'">
          <Typography tag="h2" variant="h2">Ma Liste de lecture</Typography>
        </div>

      </div>
    </main>

  </div>
</template>

<style>
/* CSS Global */
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
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* --- HEADER --- */
.main-header {
  height: 80px;
  background-color: #FDF6E3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3rem;
  border-bottom: 3px solid #000;
  flex-shrink: 0;
}

.header-left .logo-img {
  height: 50px;
  object-fit: contain;
}

.top-nav {
  display: flex;
  align-items: center;
}

/* --- MAIN --- */
.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: #FFFDF5; 
}

.content-area {
  width: 100%;
  padding: 2rem;
  box-sizing: border-box; 
  padding-bottom: 4rem; /* Espace pour la pagination */
}

.explorer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

/* --- GRILLE --- */
.books-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 2rem;
  align-items: stretch; 
}

.grid-item {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* --- PAGINATION --- */
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
}

.loader-container {
  padding: 4rem;
  text-align: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-header {
    padding: 0 1rem;
    height: auto;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1rem;
  }
  .books-grid {
    grid-template-columns: 1fr;
  }
  .explorer-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>