<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Typography from '@/components/atoms/Typography.vue'
import Button from '@/components/atoms/Button.vue'
import EventCard from '@/components/molecules/EventCard.vue'
import BookDetailPanel from '@/components/organisms/BookDetailPanel.vue'
import { ICONS } from '@/constants/icons'

const router = useRouter()
const savedBooks = ref([])

onMounted(() => {
  const storedBooks = localStorage.getItem('myLibrary')
  if (storedBooks) {
    try { savedBooks.value = JSON.parse(storedBooks) } catch (e) {}
  }
})

const toggleFav = (id) => {
  savedBooks.value = savedBooks.value.filter(b => b.id !== id)
  localStorage.setItem('myLibrary', JSON.stringify(savedBooks.value))
}

const selectedBook = ref(null)
const isPanelOpen = ref(false)
const openDetail = (book) => { selectedBook.value = book; isPanelOpen.value = true }
const closeDetail = () => { isPanelOpen.value = false }
</script>

<template>
  <div class="content-area">
    <Typography tag="h2" variant="h2" style="margin-bottom: 2rem;">Ma Liste de lecture</Typography>
    
    <div v-if="savedBooks.length === 0" class="empty-state-container">
      <div class="empty-icon-wrapper">
        <component :is="ICONS.search || 'span'" size="64" stroke-width="1.5" />
      </div>
      <Typography tag="h3" variant="h3" style="margin-bottom: 1rem;">Votre liste est vide pour le moment</Typography>
      <Typography tag="p" variant="body" style="max-width: 450px; margin-bottom: 2rem; color: #666;">
        Vous n'avez pas encore enregistré de livres. Explorez notre collection et cliquez sur le cœur pour retrouver vos favoris ici.
      </Typography>
      <Button label="Explorer la bibliothèque" variant="primary" @click="router.push('/explorer')" />
    </div>

    <div v-else class="books-grid">
        <EventCard v-for="book in savedBooks" :key="book.id" class="grid-item" :title="book.title" :subtitle="book.subtitle" :imageUrl="book.image" :description="book.description" :isFavorite="true" @toggleFavorite="toggleFav(book.id)" @clickDetail="openDetail(book)" />
    </div>

    <BookDetailPanel :isOpen="isPanelOpen" :book="selectedBook" @close="closeDetail" @toggleFavorite="toggleFav" />
  </div>
</template>

<style scoped>
.content-area { width: 100%; padding: 2rem; box-sizing: border-box; padding-bottom: 4rem; min-height: 100%; }
.books-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; align-items: stretch; }
.grid-item { height: 100%; display: flex; flex-direction: column; }
.grid-item :deep(h3) { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; min-height: 2.8em; margin-bottom: 0.5rem; }
.grid-item :deep(p:not(.subtitle)) { display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; flex-grow: 1; }

.empty-state-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; }
.empty-icon-wrapper { color: #aaa; margin-bottom: 1.5rem; animation: float 3s ease-in-out infinite; }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }

@media (max-width: 1024px) { 
  .books-grid { grid-template-columns: repeat(2, 1fr); } 
}

@media (max-width: 768px) {
  .content-area { padding: 1rem; padding-bottom: 4rem; text-align: center; }
  .content-area :deep(h2) { font-size: 1.5rem; }
  .books-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .empty-state-container { padding: 2rem 1rem; }
}
</style>