<script setup>
import { ref, computed, watch } from 'vue' // Ajout de watch
import { useLocation } from '@/composables/useLocation'
import { fetchEvents } from '@/services/ticketmaster' // Import du service
import Typography from './components/atoms/Typography.vue'
import Button from './components/atoms/Button.vue'
import { ICONS } from '@/constants/icons'
import EventCard from './components/molecules/EventCard.vue'

// --- LOCALISATION ---
const { userCity, userCoordinates, isLoadingLoc, requestLocation } = useLocation() // J'ai ajouté userCoordinates ici

// --- DONNÉES ÉVÉNEMENTS ---
const events = ref([])
const isLoadingEvents = ref(false)

// Fonction pour charger les données
const loadEventsData = async () => {
  if (!userCoordinates.value) return

  isLoadingEvents.value = true
  // On appelle l'API avec les coordonnées GPS réelles
  const results = await fetchEvents(userCoordinates.value.lat, userCoordinates.value.long)
  events.value = results
  isLoadingEvents.value = false
}

// Dès qu'on a les coordonnées, on charge les events
watch(userCoordinates, (newCoords) => {
  if (newCoords) {
    loadEventsData()
  }
})

// Au démarrage
import { onMounted } from 'vue'
onMounted(() => {
  requestLocation()
})

// --- NAVIGATION (Inchangé) ---
const currentTab = ref('explorer') // On se met direct sur explorer pour tester
const menuItems = [
  { id: 'home', label: 'Home', icon: 'house' },
  { id: 'explorer', label: 'Explorer', icon: 'search' },
  { id: 'saved', label: 'Enregistrés', icon: 'bookmark' },
]
const currentTabLabel = computed(() => {
  const item = menuItems.find(i => i.id === currentTab.value)
  return item ? item.label : 'Tickest'
})

// --- FAVORIS (Logique simple pour l'instant) ---
const toggleFav = (id) => {
  const evt = events.value.find(e => e.id === id)
  if (evt) evt.isFav = !evt.isFav
}

// --- RESERVATION ---
const openBooking = (url) => {
  if (url) window.open(url, '_blank')
}
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
        <Typography tag="h1" variant="h2">{{ currentTabLabel }}</Typography>
        <div class="location-badge">
          <component :is="ICONS.location" size="20" stroke-width="2.5" />
          <Typography tag="span" variant="body" bold style="margin:0;">
            <span v-if="isLoadingLoc">Localisation...</span>
            <span v-else>{{ userCity }}</span>
          </Typography>
        </div>
      </header>

      <div class="content-area">
        
        <div v-if="currentTab === 'home'">
          <Typography tag="p" variant="body">Bienvenue sur la home de Tickest.</Typography>
        </div>

        <div v-if="currentTab === 'explorer'">
          <div class="search-header" style="margin-bottom: 2rem;">
            <Typography tag="h2" variant="h2">
              Événements à {{ userCity }}
            </Typography>
            <Typography tag="p" variant="body">
              Les meilleurs concerts et spectacles autour de vous.
            </Typography>
          </div>

          <div v-if="isLoadingEvents" style="text-align:center; padding: 2rem;">
            <Typography tag="p" variant="body">Recherche des événements en cours...</Typography>
          </div>

          <div v-else class="events-grid">
            <EventCard 
              v-for="event in events"
              :key="event.id"
              :title="event.name"
              :subtitle="event.venue"
              :date="event.date"
              :imageUrl="event.image"
              :description="event.description"
              :isFavorite="event.isFav"
              @toggleFavorite="toggleFav(event.id)"
              @clickDetail="openBooking(event.bookingUrl)"
            />
          </div>
          
          <div v-if="!isLoadingEvents && events.length === 0" style="margin-top:2rem;">
             <Typography tag="p" variant="body">Aucun événement trouvé dans ce rayon.</Typography>
          </div>
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

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); /* Responsive auto */
  gap: 2rem;
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr; /* 1 colonne sur mobile */
  }
}

</style>