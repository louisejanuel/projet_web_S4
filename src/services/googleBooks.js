import axios from 'axios'

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

// On accepte bien le paramètre 'orderBy' ici
export const fetchBooks = async (query, startIndex = 0, maxResults = 40, orderBy = 'relevance') => {
  try {
    const params = {
      q: query,
      startIndex: startIndex,
      maxResults: maxResults,
      orderBy: orderBy
    }

    if (API_KEY) params.key = API_KEY

    const response = await axios.get(BASE_URL, { params })

    if (!response.data.items) return []

    return response.data.items.map(item => ({
      id: item.id,
      title: item.volumeInfo.title || 'Titre inconnu',
      subtitle: item.volumeInfo.authors?.join(', ') || 'Auteur inconnu',
      description: item.volumeInfo.description || '',
      // CORRECTION ICI : On utilise un service d'image fiable et HTTPS
      image: item.volumeInfo.imageLinks?.thumbnail 
             || item.volumeInfo.imageLinks?.smallThumbnail 
             || 'https://placehold.co/128x192?text=No+Cover', 
      bookingUrl: item.volumeInfo.previewLink || item.volumeInfo.infoLink,
      publisher: item.volumeInfo.publisher || 'Éditeur inconnu',
      publishedDate: item.volumeInfo.publishedDate || 'Date inconnue',
      rating: item.volumeInfo.averageRating || 0,
      ratingCount: item.volumeInfo.ratingsCount || 0,
      pageCount: item.volumeInfo.pageCount || 0,
      isFav: false
    }))

  } catch (error) {
    console.error('ERREUR API :', error)
    return []
  }
}