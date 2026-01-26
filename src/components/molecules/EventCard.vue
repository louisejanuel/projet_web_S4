<script setup>
import Typography from '@/components/atoms/Typography.vue'
import Button from '@/components/atoms/Button.vue'
import RemoteImage from '@/components/atoms/RemoteImage.vue'
import SaveButton from '@/components/atoms/SaveButton.vue'
import Separator from '@/components/atoms/Separator.vue' // Import du nouvel atome
import { ICONS } from '@/constants/icons'

const props = defineProps({
  title: String,
  subtitle: String,
  date: String,
  imageUrl: String,
  description: {
    type: String,
    default: "Cet événement exceptionnel réunit les plus grands talents de la scène actuelle pour une soirée inoubliable. Venez vibrer au rythme de la musique dans une ambiance électrique. Une expérience unique à vivre en live..."
  },
  isFavorite: Boolean
})

const emit = defineEmits(['toggleFavorite', 'clickDetail'])
</script>

<template>
  <article class="event-card">
    
    <div class="card-content-wrapper">
      <div class="card-body">
        
        <div class="card-visual">
          <div class="img-container">
            <RemoteImage :src="imageUrl" :alt="title" aspect-ratio="1/1.3" />
          </div>
          
          <Typography tag="span" variant="caption" bold class="date-text">
            {{ date }}
          </Typography>
        </div>

        <div class="card-info">
          <div class="header-row">
            <div class="titles-wrapper">
               <h3 class="title-flat">{{ title }}</h3>
              
              <div class="subtitle-flat">
                <component :is="ICONS.location" :size="16" />
                <Typography tag="span" variant="caption" style="line-height: 1;">
                  {{ subtitle }}
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
          VOIR DÉTAILS
        </Button>
      </div>

      <div class="card-footer">
        <button class="footer-action">
          <component :is="ICONS.share" size="18" />
          Partager
        </button>

        <button class="footer-action" @click="emit('clickDetail')">
          <component :is="ICONS.ticket" size="18" />
          Réserver
        </button>
      </div>
    </div>

    <Separator margin="1rem 0 0 0" />

  </article>
</template>

<style scoped>
/* --- CONTENEUR GLOBAL --- */
.event-card {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem; 
}

.card-content-wrapper {
  padding: 0 0.5rem; /* Petite marge de sécurité latérale */
}

/* --- ÉTAGE 1 : BODY --- */
.card-body {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Visuel */
.card-visual {
  width: 110px; 
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.img-container {
  width: 100%;
  background: transparent;
}

.date-text {
  font-family: monospace;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  margin: 0 0 8px 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  line-height: 1.2;
  height: 2.4em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtitle-flat {
  display: flex;       /* Flexbox activé */
  align-items: center; /* Centrage vertical */
  gap: 6px;           /* Espace entre icone et texte */
  color: #333;
}

.desc-flat {
  margin-top: 1rem;
  font-family: monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 5; 
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* --- ÉTAGE 2 : BOUTON --- */
.main-action-area {
  margin-bottom: 0.75rem; 
}

:deep(.flat-button) {
  border-radius: 0 !important;
  box-shadow: none !important;
  border: 2px solid #000 !important;
  height: 48px;
  background-color: #FF8F50; 
  color: #000;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 1rem;
}

:deep(.flat-button:hover) {
  background-color: #ff7b2e;
  transform: none !important;
}

/* --- ÉTAGE 3 : FOOTER --- */
.card-footer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.footer-action {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #000;
  padding: 8px 0;
  transition: opacity 0.2s;
}

.footer-action:hover {
  opacity: 0.6;
}

/* --- RESPONSIVE --- */
@media (max-width: 600px) {
  .card-body {
    flex-direction: column;
    gap: 1rem;
  }
  .card-visual {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .img-container {
    width: 80px;
  }
}
</style>