import axios from 'axios'

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

export const fetchBooks = async (query, startIndex = 0, maxResults = 40) => {
  try {
    const params = {
      q: query,
      startIndex: startIndex,
      maxResults: maxResults,
    }

    if (API_KEY) params.key = API_KEY

    const response = await axios.get(BASE_URL, { params })

    if (!response.data.items) return []

    return response.data.items.map(item => ({
      id: item.id,
      title: item.volumeInfo.title || 'Titre inconnu',
      
      // --- CHANGEMENT ICI : On récupère les auteurs ---
      // S'il y a des auteurs, on les joint avec une virgule. Sinon, "Auteur inconnu".
      subtitle: item.volumeInfo.authors?.join(', ') || 'Auteur inconnu',
      // -----------------------------------------------

      description: item.volumeInfo.description || '',
      image: item.volumeInfo.imageLinks?.thumbnail 
             || item.volumeInfo.imageLinks?.smallThumbnail 
             || 'https://via.placeholder.com/150?text=No+Cover',
      bookingUrl: item.volumeInfo.infoLink || item.saleInfo?.buyLink,
      isFav: false
    }))

  } catch (error) {
    console.error('❌ ERREUR API :', error)
    return []
  }
}