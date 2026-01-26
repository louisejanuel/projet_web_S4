import { ref } from 'vue'

// État global (pour que la loc soit dispo partout)
const userCity = ref('Paris') // Valeur par défaut
const userCoordinates = ref(null)
const isLoadingLoc = ref(false)
const errorLoc = ref(null)

export function useLocation() {

  // Fonction pour transformer Latitude/Longitude en Nom de Ville
  // On utilise l'API gratuite OpenStreetMap (Nominatim)
  async function getCityFromCoords(lat, lon) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      )
      const data = await response.json()
      // On cherche la ville, le village ou la municipalité dans la réponse
      const city = data.address.city || data.address.town || data.address.village || 'Localisation inconnue'
      return city
    } catch (e) {
      console.error("Erreur géocodage:", e)
      return 'Paris'
    }
  }

  // La fonction principale à appeler
  function requestLocation() {
    if (!navigator.geolocation) {
      errorLoc.value = "Géolocalisation non supportée"
      return
    }

    isLoadingLoc.value = true

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Succès
        const { latitude, longitude } = position.coords
        userCoordinates.value = { lat: latitude, long: longitude }
        
        // On récupère le nom de la ville
        const city = await getCityFromCoords(latitude, longitude)
        userCity.value = city
        isLoadingLoc.value = false
      },
      (err) => {
        // Erreur (l'utilisateur refuse)
        errorLoc.value = "Accès refusé"
        isLoadingLoc.value = false
        console.warn(err)
      }
    )
  }

  return {
    userCity,
    userCoordinates,
    isLoadingLoc,
    errorLoc,
    requestLocation
  }
}