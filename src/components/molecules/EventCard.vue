<script setup>
import Typography from '@/components/atoms/Typography.vue'
import Button from '@/components/atoms/Button.vue'
import RemoteImage from '@/components/atoms/RemoteImage.vue'
import SaveButton from '@/components/atoms/SaveButton.vue'
import Separator from '@/components/atoms/Separator.vue'
import { ICONS } from '@/constants/icons'

const props = defineProps({
  title: String,
  subtitle: String, // Ce sera l'Auteur
  imageUrl: String,
  description: {
    type: String,
    default: "Aucune description disponible pour ce livre."
  },
  isFavorite: Boolean
})

const emit = defineEmits(['toggleFavorite', 'clickDetail'])
</script>

<template>
  <article class="book-card">
    
    <div class="card-content-wrapper">
      <div class="card-body">
        
        <div class="card-visual">
          <div class="img-container">
            <RemoteImage :src="imageUrl" :alt="title" aspect-ratio="1/1.5" />
          </div>
          </div>

        <div class="card-info">
          <div class="header-row">
            <div class="titles-wrapper">
               <h3 class="title-flat">{{ title }}</h3>
              
              <div class="subtitle-flat">
                <Typography tag="span" variant="caption" style="font-family: monospace; font-size: 0.9rem;">
                  De <span style="text-decoration: underline;">{{ subtitle }}</span>
                </Typography>
              </div>
            </div>
            
            <SaveButton :isActive="isFavorite" @toggle="emit('toggleFavorite')" />
          </div>

          <p class="desc-flat">
            {{ description }}
          </p>
        </div>
      </div>

      <div class="main-action-area">
        <Button 
          variant="primary" 
          fullWidth 
          class="flat-button" 
          @click="emit('clickDetail')"
        >
          VOIR LES DÉTAILS
        </Button>
      </div>
    </div>

    <Separator margin="2rem 0 0 0" />

  </article>
</template>

<style scoped>
/* --- CONTENEUR --- */
.book-card {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem; 
}

.card-content-wrapper {
  padding: 0 0.5rem;
}

/* --- BODY --- */
.card-body {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Visuel */
.card-visual {
  width: 100px; /* Largeur fixe livre */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0; 
}

.img-container {
  width: 100%;
  background: #eee; 
  box-shadow: 4px 4px 0px rgba(0,0,0,0.1); 
}

/* Infos */
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.titles-wrapper {
  flex: 1;
}

.title-flat {
  margin: 0 0 4px 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.3rem;
  line-height: 1.5;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.subtitle-flat {
  color: #444;
  margin-bottom: 0.5rem;
}

.desc-flat {
  margin-top: 0.5rem;
  font-family: monospace; /* Style machine à écrire */
  font-size: 0.85rem;
  line-height: 1.6;
  color: #333;
  display: -webkit-box;
  line-clamp: 4; /* Limite à 4 lignes */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* --- BOUTON --- */
.main-action-area {
  margin-bottom: 1rem; 
}

/* Force le style Flat Orange */
:deep(.flat-button) {
  border-radius: 0 !important;
  box-shadow: none !important;
  border: 2px solid #000 !important;
  height: 48px;
  background-color: #FF8F50; 
  color: #000;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1rem;
}
:deep(.flat-button:hover) {
  background-color: #ff7b2e;
}

/* Mobile */
@media (max-width: 600px) {
  .card-body {
    flex-direction: row; /* On garde l'alignement cote à cote même sur mobile pour les livres */
  }
  .card-visual {
    width: 80px; /* Un peu plus petit sur mobile */
  }
}
</style>