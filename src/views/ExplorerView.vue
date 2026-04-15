<script setup>
import { ref, onMounted, watch, computed } from 'vue' // <-- AJOUT de computed
import { fetchBooks } from '@/services/googleBooks' 
import Typography from '@/components/atoms/Typography.vue'
import Button from '@/components/atoms/Button.vue'
import EventCard from '@/components/molecules/EventCard.vue'
import BookDetailPanel from '@/components/organisms/BookDetailPanel.vue'
import FilterDropdown from '@/components/molecules/FilterDropdown.vue'

const props = defineProps({
  globalSearchQuery: String
})

const rawBooks = ref([]) 

const isLoading = ref(false)
const currentCategory = ref('') 
const selectedSort = ref(['relevance']) 
const currentPage = ref(0)
const maxResults = 40

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

const isBookSaved = (id) => {
  const saved = JSON.parse(localStorage.getItem('myLibrary') || '[]')
  return saved.some(book => book.id === id)
}

const toggleFav = (id) => {
  let saved = JSON.parse(localStorage.getItem('myLibrary') || '[]')
  let book = rawBooks.value.find(b => b.id === id)
  if (!book) return 

  if (isBookSaved(id)) {
    saved = saved.filter(b => b.id !== id)
    book.isFav = false
  } else {
    book.isFav = true
    saved.push(book)
  }
  localStorage.setItem('myLibrary', JSON.stringify(saved))
}

// LA DONNÉE CALCULÉE
const displayedBooks = computed(() => {
  let result = [...rawBooks.value]

  if (selectedSort.value[0] === 'newest') {
    result.sort((a, b) => {
      const dateA = new Date(a.publishedDate || '0000').getTime()
      const dateB = new Date(b.publishedDate || '0000').getTime()
      return dateB - dateA 
    })
  } else {
  }

  return result
})

// Appel API
const loadBooks = async () => {
  isLoading.value = true
  const startIndex = currentPage.value * maxResults
  
  let query = props.globalSearchQuery?.trim() || ''
  if (currentCategory.value) query = query ? `${query}+${currentCategory.value}` : currentCategory.value
  if (!query) query = 'subject:fiction'

  try {
    const data = await fetchBooks(query, startIndex, maxResults, 'relevance') 
    const processedBooks = (data || []).map(book => ({
      ...book,
      isFav: isBookSaved(book.id) 
    }))
    
    rawBooks.value = processedBooks
    
    document.querySelector('.main-content').scrollTop = 0
  } catch (e) {
    console.error(e)
    rawBooks.value = []
  }
  isLoading.value = false
}

// Watchers
watch(() => props.globalSearchQuery, () => {
  currentPage.value = 0
  loadBooks()
})

watch(currentCategory, () => {
  currentPage.value = 0 
  loadBooks()
})

const nextPage = () => { if (rawBooks.value.length > 0) { currentPage.value++; loadBooks() } }
const prevPage = () => { if (currentPage.value > 0) { currentPage.value--; loadBooks() } }

onMounted(() => { loadBooks() })

const selectedBook = ref(null)
const isPanelOpen = ref(false)
const openDetail = (book) => { selectedBook.value = book; isPanelOpen.value = true }
const closeDetail = () => { isPanelOpen.value = false }
</script>

<template>
  <div class="content-area">
    <div class="explorer-header">
      <Typography tag="h2" variant="h2">
        {{ globalSearchQuery ? `Résultats pour "${globalSearchQuery}"` : 'Explorer la bibliothèque' }}
      </Typography>
    </div>

    <div class="filters-bar">
        <div class="sort-group">
          <Typography tag="span" variant="body" style="margin-right: 10px; font-size: 0.9rem; font-weight: 600;">Trier par :</Typography>
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
        <EventCard 
          v-for="book in displayedBooks" 
          :key="book.id" 
          class="grid-item" 
          :title="book.title" 
          :subtitle="book.subtitle" 
          :imageUrl="book.image" 
          :description="book.description" 
          :isFavorite="book.isFav" 
          @toggleFavorite="toggleFav(book.id)" 
          @clickDetail="openDetail(book)" 
        />
      </div>
      <div class="pagination-bar">
        <Button label="Précédent" variant="secondary" :disabled="currentPage === 0" @click="prevPage" />
        <Typography tag="span" variant="body" style="font-weight: bold;">Page {{ currentPage + 1 }}</Typography>
        <Button label="Suivant" variant="secondary" :disabled="rawBooks.length === 0 || isLoading" @click="nextPage" />
      </div>
    </div>
    
    <div v-if="!isLoading && rawBooks.length === 0" style="margin-top:2rem;">
        <Typography tag="p" variant="body">Aucun livre trouvé.</Typography>
    </div>

    <BookDetailPanel :isOpen="isPanelOpen" :book="selectedBook" @close="closeDetail" @toggleFavorite="toggleFav" />
  </div>
</template>

<style scoped>
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

@media (max-width: 1024px) { 
  .books-grid { grid-template-columns: repeat(2, 1fr); } 
}

@media (max-width: 768px) {
  .content-area { padding: 1rem; padding-bottom: 4rem; }
  .explorer-header { flex-direction: column; align-items: center; text-align: center; gap: 1rem; }
  .explorer-header :deep(h2) { font-size: 1.5rem; }
  
  .filters-bar { flex-direction: column; align-items: stretch; gap: 1rem; }
  .sort-group { justify-content: space-between; width: 100%; }
  .vertical-separator { display: none; }
  
  .categories-list { width: 100%; padding-bottom: 10px; overflow-x: auto; justify-content: flex-start; }
  
  .books-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  
  .pagination-bar { gap: 1rem; flex-wrap: wrap; justify-content: center; }
  .pagination-bar button { padding: 8px 12px; font-size: 0.9rem; }
}
</style>