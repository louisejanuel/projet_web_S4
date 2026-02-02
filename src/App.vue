<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchBooks } from '@/services/googleBooks' 
import Typography from './components/atoms/Typography.vue'
import Button from './components/atoms/Button.vue'
import SearchBar from './components/atoms/SearchBar.vue' 
import EventCard from './components/molecules/EventCard.vue'
import BookDetailPanel from './components/organisms/BookDetailPanel.vue'
import FilterDropdown from './components/molecules/FilterDropdown.vue'
import { ICONS } from '@/constants/icons'

// --- DONNÉES ---
const books = ref([]) 
const savedBooks = ref([])
const isLoading = ref(false)
const searchQuery = ref('') 

// --- ETAT DES FILTRES ---
const currentCategory = ref('') 
const selectedSort = ref(['relevance']) 

const categoryOptions = [
  { label: 'Tout', value: '' },
  { label: 'Fiction', value: 'subject:fiction' },
  { label: 'Art', value: 'subject:art' },
  { label: 'Histoire', value: 'subject:history' },
  { label: 'Science', value: 'subject:science' },
  { label: 'Biographie', value: 'subject:biography' },
  { label: 'Fantastique', value: 'subject:fantasy' }
]

const sortOptions = [
  { label: 'Pertinence', value: 'relevance' },
  { label: 'Plus récent', value: 'newest' }
]

// --- PAGINATION ---
const currentPage = ref(0)
const maxResults = 40

// --- GESTION FAVORIS ---
const isBookSaved = (id) => savedBooks.value.some(book => book.id === id)

const saveToLocalStorage = () => {
  localStorage.setItem('myLibrary', JSON.stringify(savedBooks.value))
}

const toggleFav = (id) => {
  let book = books.value.find(b => b.id === id)
  if (!book) book = savedBooks.value.find(b => b.id === id)
  if (!book) return 

  if (isBookSaved(id)) {
    savedBooks.value = savedBooks.value.filter(b => b.id !== id)
    book.isFav = false
    const bookInSearch = books.value.find(b => b.id === id)
    if (bookInSearch) bookInSearch.isFav = false
  } else {
    book.isFav = true
    savedBooks.value.push(book)
  }
  saveToLocalStorage()
}

const sortBooksLocal = () => {
  if (selectedSort.value[0] === 'newest') {
    books.value.sort((a, b) => {
      const dateA = new Date(a.publishedDate || '0000').getTime()
      const dateB = new Date(b.publishedDate || '0000').getTime()
      return dateB - dateA 
    })
  }
}

// --- LOGIQUE API ---
const loadBooks = async () => {
  isLoading.value = true
  const startIndex = currentPage.value * maxResults
  let query = searchQuery.value.trim()
  if (currentCategory.value) query = query ? `${query}+${currentCategory.value}` : currentCategory.value
  if (!query) query = 'subject:fiction'

  try {
    const data = await fetchBooks(query, startIndex, maxResults, 'relevance') 
    const processedBooks = (data || []).map(book => ({
      ...book,
      isFav: isBookSaved(book.id) 
    }))
    books.value = processedBooks
    sortBooksLocal()
    // Scroll sur le conteneur principal
    const mainContent = document.querySelector('.main-content')
    if (mainContent) mainContent.scrollTop = 0
  } catch (e) {
    console.error(e)
    books.value = []
  }
  isLoading.value = false
}

watch([currentCategory, selectedSort], () => {
  if (selectedSort.value[0] === 'relevance') {
    currentPage.value = 0 
    loadBooks()
  } else {
    sortBooksLocal()
  }
})

const handleSearch = () => {
  currentPage.value = 0 
  loadBooks()
  currentTab.value = 'explorer'
}

const clearSearch = () => {
  searchQuery.value = ''
  handleSearch() 
}

const nextPage = () => {
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

onMounted(() => {
  const storedBooks = localStorage.getItem('myLibrary')
  if (storedBooks) {
    try { savedBooks.value = JSON.parse(storedBooks) } catch (e) {}
  }
  loadBooks()
})

const currentTab = ref('home') 
const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'explorer', label: 'Explorer' },
  { id: 'saved', label: 'Enregistrés' },
]

// --- IMAGES HOME (Open Library) ---
const homeCovers = [
  'https://covers.openlibrary.org/b/id/8259447-L.jpg',
  'https://covers.openlibrary.org/b/id/8259833-L.jpg',
  'https://covers.openlibrary.org/b/id/10522670-L.jpg',
  'https://covers.openlibrary.org/b/id/7222246-L.jpg',
  'https://covers.openlibrary.org/b/id/12556708-L.jpg',
  'https://covers.openlibrary.org/b/id/8231649-L.jpg',
  'https://covers.openlibrary.org/b/id/6987347-L.jpg',
  'https://covers.openlibrary.org/b/id/10603741-L.jpg',
  'https://covers.openlibrary.org/b/id/8378335-L.jpg',
  'https://covers.openlibrary.org/b/id/6438081-L.jpg',
  'https://covers.openlibrary.org/b/id/8115286-L.jpg',
  'https://covers.openlibrary.org/b/id/240727-L.jpg',
  'https://covers.openlibrary.org/b/id/7350170-L.jpg',
  'https://covers.openlibrary.org/b/id/6563630-L.jpg',
  'https://covers.openlibrary.org/b/id/7882672-L.jpg',
  'https://covers.openlibrary.org/b/id/10582962-L.jpg'
]

const selectedBook = ref(null)
const isPanelOpen = ref(false)
const openDetail = (book) => { selectedBook.value = book; isPanelOpen.value = true }
const closeDetail = () => { isPanelOpen.value = false }
</script>

<template>
  <div class="app-layout">
    
    <header class="main-header">
      <div class="header-left">
        <img src="./assets/logo_book.png" alt="Dog-eared page" class="logo-img" />
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
            :isActive="currentTab === item.id"
            @click="currentTab = item.id"
          />
        </nav>
      </div>
    </header>

    <main class="main-content">
      
      <div v-if="currentTab === 'home'" class="home-container">
          <div class="book-grid-wall">
            <img 
              v-for="(img, i) in [...homeCovers, ...homeCovers, ...homeCovers, ...homeCovers]" 
              :key="i" 
              :src="img" 
              class="wall-cover" 
            />
          </div>

          <div class="hero-overlay">
            <div class="hero-card">
              <Typography tag="h1" variant="h1" style="margin-bottom: 1rem; font-size: 3rem;">
                The Dog-Eared Page
              </Typography>
              
              <Typography tag="p" variant="body" style="font-size: 1.2rem; margin-bottom: 2rem; color: #444;">
                Plongez dans un océan d'histoires. <br> Cherchez, découvrez et créez votre bibliothèque idéale.
              </Typography>

              <Button 
                label="COMMENCER L'EXPLORATION" 
                variant="primary" 
                class="hero-btn"
                @click="currentTab = 'explorer'"
              >
                 <span style="margin-left:10px;">➔</span>
              </Button>
            </div>
          </div>
      </div>

      <div v-else class="content-area">
        
        <div v-if="currentTab === 'explorer'">
          <div class="explorer-header">
            <div class="header-texts">
              <Typography tag="h2" variant="h2">
                {{ searchQuery ? `Résultats pour "${searchQuery}"` : 'Explorer la bibliothèque' }}
              </Typography>
            </div>
          </div>

          <div class="filters-bar">
             <div class="sort-group">
               <Typography tag="span" variant="body" style="margin-right: 10px; font-size: 0.9rem; font-weight: 600;">
                 Trier par :
               </Typography>
               <FilterDropdown label="Tri" :options="sortOptions" v-model="selectedSort" singleSelect />
             </div>
             <div class="vertical-separator"></div>
             <div class="categories-list">
               <Button v-for="cat in categoryOptions" :key="cat.value" :label="cat.label" :variant="currentCategory === cat.value ? 'primary' : 'secondary'" @click="currentCategory = cat.value" style="white-space: nowrap;" />
             </div>
          </div>

          <div v-if="isLoading" class="loader-container">
            <Typography tag="h3" variant="h3">Chargement des livres...</Typography>
          </div>
          <div v-else class="books-wrapper">
            <div class="books-grid">
              <EventCard v-for="book in books" :key="book.id" class="grid-item" :title="book.title" :subtitle="book.subtitle" :imageUrl="book.image" :description="book.description" :isFavorite="book.isFav" @toggleFavorite="toggleFav(book.id)" @clickDetail="openDetail(book)" />
            </div>
            <div class="pagination-bar">
              <Button label="Précédent" variant="secondary" :disabled="currentPage === 0" @click="prevPage" />
              <Typography tag="span" variant="body" style="font-weight: bold;">Page {{ currentPage + 1 }}</Typography>
              <Button label="Suivant" variant="secondary" :disabled="books.length === 0 || isLoading" @click="nextPage" />
            </div>
          </div>
          <div v-if="!isLoading && books.length === 0" style="margin-top:2rem;">
             <Typography tag="p" variant="body">Aucun livre trouvé.</Typography>
          </div>
        </div>

        <div v-if="currentTab === 'saved'">
          <Typography tag="h2" variant="h2" style="margin-bottom: 2rem;">Ma Liste de lecture</Typography>
          
          <div v-if="savedBooks.length === 0" class="empty-state-container">
            <div class="empty-icon-wrapper">
              <component :is="ICONS.search || 'span'" size="64" stroke-width="1.5" />
            </div>
            <Typography tag="h3" variant="h3" style="margin-bottom: 1rem;">Votre liste est vide pour le moment</Typography>
            <Typography tag="p" variant="body" style="max-width: 450px; margin-bottom: 2rem; color: #666;">
              Vous n'avez pas encore enregistré de livres. Explorez notre collection et cliquez sur le cœur pour retrouver vos favoris ici.
            </Typography>
            <Button label="Explorer la bibliothèque" variant="primary" @click="currentTab = 'explorer'" />
          </div>

          <div v-else class="books-grid">
              <EventCard v-for="book in savedBooks" :key="book.id" class="grid-item" :title="book.title" :subtitle="book.subtitle" :imageUrl="book.image" :description="book.description" :isFavorite="true" @toggleFavorite="toggleFav(book.id)" @clickDetail="openDetail(book)" />
          </div>
        </div>

      </div>
    </main>

    <BookDetailPanel :isOpen="isPanelOpen" :book="selectedBook" @close="closeDetail" @toggleFavorite="toggleFav" />
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
.app-layout { display: flex; flex-direction: column; height: 100vh; width: 100vw; overflow: hidden; }
.main-header { background-color: #AAD7B8; display: flex; align-items: center; justify-content: space-between; padding: 0 3rem; border-bottom: 3px solid #000; flex-shrink: 0; }
.header-left .logo-img { height: 120px; object-fit: contain; position: relative; }
.header-right { display: flex; align-items: center; gap: 2rem; }
.search-container { width: 300px; }
.top-nav { display: flex; align-items: center; }
.main-content { flex: 1; overflow-y: auto; background-color: #FFFDF5; }

/* MODIFICATION : La content-area ne s'applique plus à la Home, donc le padding ne gênera plus */
.content-area { width: 100%; padding: 2rem; box-sizing: border-box; padding-bottom: 4rem; min-height: 100%; }
.explorer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.filters-bar { display: flex; align-items: center; margin-bottom: 2rem; gap: 1.5rem; width: 100%; }
.sort-group { display: flex; align-items: center; flex-shrink: 0; }
.vertical-separator { width: 2px; height: 40px; background-color: #000; flex-shrink: 0; }
.categories-list { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none; }
.categories-list::-webkit-scrollbar { display: none; }
.books-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; align-items: stretch; }
.grid-item { height: 100%; display: flex; flex-direction: column; }
.grid-item :deep(h3) { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; min-height: 2.8em; margin-bottom: 0.5rem; }
.grid-item :deep(p:not(.subtitle)) { display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; flex-grow: 1; }
.pagination-bar { display: flex; justify-content: center; align-items: center; gap: 2rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #ddd; }
.loader-container { padding: 4rem; text-align: center; }

/* --- HOME PAGE STYLE --- */
.home-container {
  position: relative;
  width: 100%;
  height: 100%; /* Prend toute la hauteur du main-content */
  overflow: hidden;
  background: #FDF6E3;
}

/* GRILLE FIXE DE LIVRES */
.book-grid-wall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  display: flex;
  flex-wrap: wrap; 
  justify-content: center;
  align-content: flex-start; 
  gap: 10px; 
  
  padding: 1rem;
  box-sizing: border-box;
  opacity: 0.6;
}

.wall-cover {
  height: 160px; 
  width: auto;
  border-radius: 4px;
  filter: grayscale(100%) blur(1px);
  transition: all 0.3s ease;
  cursor: pointer;
}

.wall-cover:hover {
  filter: grayscale(0%) blur(0px);
  transform: scale(1.1);
  z-index: 10;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

/* OVERLAY (Glassmorphism) */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(253, 246, 227, 0.3); 
  z-index: 20;
}

.hero-card {
  text-align: center;
  padding: 3rem 4rem;
  background: rgba(255, 255, 255, 0.75); 
  backdrop-filter: blur(8px); 
  border: 2px solid #000;
  box-shadow: none; /* Pas d'ombre portée, style flat */
  max-width: 600px;
}

.hero-btn {
  font-size: 1.2rem !important;
  padding: 15px 30px !important;
}

/* EMPTY STATE */
.empty-state-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; }
.empty-icon-wrapper { color: #aaa; margin-bottom: 1.5rem; animation: float 3s ease-in-out infinite; }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }

@media (max-width: 1024px) { .books-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .main-header { padding: 1rem; height: auto; flex-direction: column; gap: 1rem; padding-bottom: 1rem; }
  .header-right { flex-direction: column-reverse; width: 100%; gap: 1rem; }
  .search-container { width: 100%; }
  .filters-bar { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .vertical-separator { display: none; }
  .categories-list { width: 100%; padding-bottom: 10px; }
  .books-grid { grid-template-columns: 1fr; }
  .wall-cover { height: 100px; }
  .hero-card { width: 90%; padding: 2rem; }
}

@media (max-width: 768px) {
  
  .header-left .logo-img {
    height: 60px; 
    margin-bottom: 0.5rem;
  }

  .content-area {
    padding: 1rem; /* On passe de 32px à 16px de marge */
    padding-bottom: 6rem; /* Plus d'espace en bas pour le scroll */
  }

  .pagination-bar {
    gap: 1rem; /* Réduire l'espace entre les boutons */
    flex-wrap: wrap; /* Permettre aux boutons de passer à la ligne si l'écran est minuscule */
  }
  
  .pagination-bar button {
    padding: 8px 12px; /* Boutons un peu plus compacts */
    font-size: 0.9rem;
  }
}
</style>