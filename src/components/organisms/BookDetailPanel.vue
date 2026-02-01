<script setup>
import { computed } from 'vue'
import Typography from '@/components/atoms/Typography.vue'
import Button from '@/components/atoms/Button.vue'
import RemoteImage from '@/components/atoms/RemoteImage.vue'
import Separator from '@/components/atoms/Separator.vue'
import { ICONS } from '@/constants/icons' 

const props = defineProps({
  isOpen: Boolean,
  book: Object
})

const emit = defineEmits(['close', 'toggleFavorite'])

const publishYear = computed(() => {
  if (!props.book?.publishedDate) return 'N/A'
  return props.book.publishedDate.split('-')[0]
})

const stars = computed(() => {
  const rating = props.book?.rating || 0
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
})

// CORRECTION 2 : Fonction sécurisée pour ouvrir le lien
const handleOpenPreview = () => {
  if (props.book?.bookingUrl) {
    window.open(props.book.bookingUrl, '_blank')
  } else {
    alert("Aucun extrait disponible pour ce livre.")
  }
}
</script>

<template>
  <div>
    <div 
      class="panel-overlay" 
      :class="{ 'is-visible': isOpen }" 
      @click="emit('close')"
    ></div>

    <aside class="detail-panel" :class="{ 'is-open': isOpen }">
      
      <button class="close-btn" @click="emit('close')">
        <component :is="ICONS.close" size="24" v-if="ICONS.close" />
        <span v-else style="font-size: 1.5rem;">&times;</span>
      </button>

      <div v-if="book" class="panel-content">
        
        <div class="panel-header">
          <div class="cover-wrapper">
             <RemoteImage :src="book.image" :alt="book.title" aspect-ratio="1/1.5" />
          </div>
          
          <div class="header-info">
            <Typography tag="h3" variant="h3" style="margin-bottom: 0.5rem; font-size: 1.4rem;">
              {{ book.title }}
            </Typography>
            
            <Typography tag="p" variant="body" style="color: #555;">
              De : <span style="text-decoration: underline; font-weight: 600;">{{ book.subtitle }}</span>
            </Typography>
          </div>
        </div>
        <div class="actions-area">
          <Button 
            variant="primary" 
            fullWidth 
            class="action-button-orange"
            @click="handleOpenPreview"
          >
            LECTURE DE L'EXTRAIT
          </Button>

          <div class="secondary-actions">
            <button class="icon-action" @click="emit('toggleFavorite', book.id)">
               <component 
                 :is="book.isFav ? (ICONS.bookmarkFill || ICONS.bookmark) : ICONS.bookmark" 
                 size="24" 
                 :style="book.isFav ? 'color: black; fill: black;' : ''"
               />
               <span :style="{ fontWeight: book.isFav ? 'bold' : 'normal' }">
                 {{ book.isFav ? 'Enregistré' : 'Enregistrer' }}
               </span>
            </button>
          </div>
        </div>

        <Separator margin="2rem 0" />

        <div class="meta-grid">
          <div class="meta-row">
            <span class="meta-label">Note</span>
            <span class="meta-value stars">
              {{ stars }} <span class="count">({{ book.ratingCount }})</span>
            </span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Sortie</span>
            <span class="meta-value">{{ publishYear }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Éditeur</span>
            <span class="meta-value">{{ book.publisher }}</span>
          </div>
           <div class="meta-row">
            <span class="meta-label">Pages</span>
            <span class="meta-value">{{ book.pageCount }} pages</span>
          </div>
        </div>

        <Separator margin="2rem 0" />

        <div class="description-area">
          <Typography tag="p" variant="body" style="font-family: monospace; line-height: 1.6;">
            {{ book.description }}
          </Typography>
        </div>

      </div>
    </aside>
  </div>
</template>

<style scoped>
/* --- OVERLAY --- */
.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* Un peu plus sombre */
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 900;
}
.panel-overlay.is-visible {
  opacity: 1;
  pointer-events: all;
}

/* --- PANEL --- */
.detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 40vw; /* Un peu plus large pour bien loger le header horizontal */
  min-width: 400px;
  max-width: 600px;
  
  background-color: #FDF6E3;
  border-left: 3px solid #000;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1000;
  overflow-y: auto;
  box-shadow: -10px 0 30px rgba(0,0,0,0.2);
}

.detail-panel.is-open {
  transform: translateX(0);
}

.panel-content {
  padding: 2.5rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10; /* S'assure qu'il est au dessus */
}

/* CORRECTION 1 : HEADER HORIZONTAL */
.panel-header {
  margin-top: 1rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row; /* Aligné horizontalement */
  gap: 1.5rem;
  align-items: flex-start; /* Calé en haut */
}

.cover-wrapper {
  width: 120px; /* Taille fixe pour l'image */
  flex-shrink: 0;
  box-shadow: 5px 5px 0px rgba(0,0,0,0.15);
  border: 1px solid #000;
}

.header-info {
  flex: 1; /* Prend le reste de la place */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 5px; /* Petit ajustement optique */
}

/* --- ACTIONS --- */
.action-button-orange {
  background-color: #FF8F50 !important;
  color: #000 !important;
  border: 2px solid #000 !important;
  font-weight: 700 !important;
  height: 50px;
  border-radius: 0 !important;
  font-size: 1rem;
}
.action-button-orange:hover {
  background-color: #ff7626 !important;
}

.secondary-actions {
  display: flex;
  justify-content: center; /* Centré */
  margin-top: 1.5rem;
  padding: 0.5rem;
}

.icon-action {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-family: monospace;
  cursor: pointer;
  font-size: 0.9rem;
  transition: transform 0.1s;
}
.icon-action:active {
  transform: scale(0.95);
}

/* --- META GRID --- */
.meta-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: 'Montserrat', sans-serif;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed #ccc; /* Petit style sympa */
  padding-bottom: 0.5rem;
}

.meta-label {
  color: #666;
  font-weight: 500;
}

.meta-value {
  font-weight: 700;
  text-align: right;
  color: #000;
}

/* Mobile */
@media (max-width: 600px) {
  .detail-panel {
    width: 90vw;
    min-width: auto;
  }
  /* Sur mobile, on repasse en vertical si c'est trop serré ? 
     Non, on garde horizontal mais on réduit l'image */
  .cover-wrapper {
    width: 90px;
  }
}
</style>