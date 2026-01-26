const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json'

export async function fetchEvents(lat, long, keyword = '') {
  try {
    // Construction des paramètres
    const params = new URLSearchParams({
      apikey: API_KEY,
      latlong: `${lat},${long}`, // Recherche autour de l'utilisateur
      radius: '50', // Rayon de 50km
      unit: 'km',
      locale: 'fr-fr', // Pour avoir les dates/textes en français si dispo
      size: '50',
      sort: 'date,asc', // Les plus proches dans le temps
    })

    if (keyword) params.append('keyword', keyword)

    const response = await fetch(`${BASE_URL}?${params.toString()}`)
    
    if (!response.ok) throw new Error('Erreur réseau Ticketmaster')
    
    const data = await response.json()

    // Si pas d'événements trouvés
    if (!data._embedded || !data._embedded.events) return []

    // On transforme la donnée brute en donnée propre pour ton App
    return data._embedded.events.map(event => {
      
      // 1. Trouver la meilleure image (Souvent la 16:9 haute définition)
      const bestImage = event.images.find(img => img.width > 600 && img.ratio === "3_2") 
        || event.images.find(img => img.ratio === "16_9") 
        || event.images[0]

      // 2. Formater la date (ex: 2026-06-16 -> 16 JUIN 2026)
      const dateObj = new Date(event.dates.start.localDate)
      const formattedDate = dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).toUpperCase() // "16 JUIN 2026"

      // 3. Gérer la description (Souvent manquante)
      let desc = event.info || event.pleaseNote || "Aucune description disponible pour cet événement. Réservez vite vos places !"
      
      // 4. Lieu et Ville
      const venue = event._embedded && event._embedded.venues ? event._embedded.venues[0] : null
      const venueName = venue ? `${venue.name}, ${venue.city.name}` : 'Lieu inconnu'

      return {
        id: event.id,
        name: event.name,
        venue: venueName,
        date: formattedDate,
        image: bestImage ? bestImage.url : '', // URL de l'image
        description: desc,
        bookingUrl: event.url, // Lien vers Ticketmaster
        isFav: false // Par défaut
      }
    })

  } catch (error) {
    console.error("Erreur Ticketmaster:", error)
    return []
  }
}