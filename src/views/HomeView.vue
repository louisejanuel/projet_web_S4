<script setup>
import { useRouter } from 'vue-router'
import Typography from '@/components/atoms/Typography.vue'
import Button from '@/components/atoms/Button.vue'

const router = useRouter()

const homeCovers = [
  'https://covers.openlibrary.org/b/id/8259447-L.jpg',
  'https://covers.openlibrary.org/b/id/8259833-L.jpg',
  'https://covers.openlibrary.org/b/id/10522670-L.jpg',
  'https://covers.openlibrary.org/b/id/7222246-L.jpg',
  'https://covers.openlibrary.org/b/id/12556708-L.jpg',
  'https://covers.openlibrary.org/b/id/8231649-L.jpg',
  'https://covers.openlibrary.org/b/id/6987347-L.jpg',
  'https://covers.openlibrary.org/b/id/10603741-L.jpg',
  'https://covers.openlibrary.org/b/id/8378335-L.jpg',
  'https://covers.openlibrary.org/b/id/6438081-L.jpg',
  'https://covers.openlibrary.org/b/id/8115286-L.jpg',
  'https://covers.openlibrary.org/b/id/240727-L.jpg',
  'https://covers.openlibrary.org/b/id/7350170-L.jpg',
  'https://covers.openlibrary.org/b/id/6563630-L.jpg',
  'https://covers.openlibrary.org/b/id/7882672-L.jpg',
  'https://covers.openlibrary.org/b/id/10582962-L.jpg'
]
</script>

<template>
  <div class="home-container">
    
    <div class="book-wall">
      
      <div class="marquee-row scroll-left">
        <div class="marquee-content">
          <img v-for="(img, i) in [...homeCovers, ...homeCovers]" :key="'l1'+i" :src="img" class="wall-cover" />
        </div>
      </div>

      <div class="marquee-row scroll-right">
        <div class="marquee-content">
          <img v-for="(img, i) in [...homeCovers].reverse().concat([...homeCovers].reverse())" :key="'l2'+i" :src="img" class="wall-cover" />
        </div>
      </div>

      <div class="marquee-row scroll-left">
        <div class="marquee-content">
          <img v-for="(img, i) in [...homeCovers, ...homeCovers]" :key="'l3'+i" :src="img" class="wall-cover" />
        </div>
      </div>

      <div class="marquee-row scroll-right">
        <div class="marquee-content">
          <img v-for="(img, i) in [...homeCovers].reverse().concat([...homeCovers].reverse())" :key="'l4'+i" :src="img" class="wall-cover" />
        </div>
      </div>

      <div class="marquee-row scroll-left">
        <div class="marquee-content">
          <img v-for="(img, i) in [...homeCovers, ...homeCovers]" :key="'l5'+i" :src="img" class="wall-cover" />
        </div>
      </div>

    </div>

    <div class="hero-overlay">
      <div class="hero-card">
        <Typography tag="h1" variant="h1" style="margin-bottom: 1rem; font-size: 3rem;">
          The Dog-Eared Page
        </Typography>
        
        <Typography tag="p" variant="body" style="font-size: 1.2rem; margin-bottom: 2rem; color: #444;">
          Plongez dans un océan d'histoires. <br> Cherchez, découvrez et créez votre bibliothèque idéale.
        </Typography>

        <Button label="COMMENCER L'EXPLORATION" variant="primary" class="hero-btn" @click="router.push('/explorer')">
            <span style="margin-left:10px;">➔</span>
        </Button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.home-container { 
  flex: 1; 
  position: relative; 
  width: 100%; 
  height: 100%; 
  overflow: hidden; 
  background: #FDF6E3; 
}

/* --- LE MUR ANIMÉ --- */
.book-wall { 
  position: absolute; 
  /* On le fait déborder de tous les côtés pour éviter de voir les coins lors de la rotation */
  top: -20%; 
  left: -10%; 
  width: 120%; 
  height: 140%; 
  
  display: flex; 
  flex-direction: column; 
  gap: 1.5rem; 
  
  /* L'inclinaison façon Steam / dynamique */
  transform: rotate(-10deg); 
  opacity: 0.6; 
}

/* Structure des lignes qui défilent */
.marquee-row { 
  display: flex; 
  overflow: hidden; 
  user-select: none; /* Empêche de sélectionner les images par erreur */
}

/* Le conteneur qui glisse */
.marquee-content { 
  display: flex; 
  gap: 1.5rem; 
  width: max-content; 
}

/* Les images */
.wall-cover { 
  height: 180px; 
  width: auto; 
  border-radius: 4px; 
  /* ETAT INITIAL : Flou et Gris */
  filter: grayscale(100%) blur(1.5px); 
  transition: all 0.3s ease; 
  cursor: pointer; 
}

/* ETAT HOVER : L'évènement interactif */
.wall-cover:hover { 
  filter: grayscale(0%) blur(0px); 
  transform: scale(1.1); 
  z-index: 10; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.3); 
}

/* --- ANIMATIONS (Dans le temps) --- */
/* Durée de 60 secondes pour un défilement très lent et agréable */
.scroll-left .marquee-content { 
  animation: scrollLeft 60s linear infinite; 
}

.scroll-right .marquee-content { 
  animation: scrollRight 60s linear infinite; 
}

/* On translate de 0 à -50% (car on a dupliqué la liste des livres par 2) */
@keyframes scrollLeft { 
  0% { transform: translateX(0); } 
  100% { transform: translateX(-50%); } 
}

@keyframes scrollRight { 
  0% { transform: translateX(-50%); } 
  100% { transform: translateX(0); } 
}

/* --- PREMIER PLAN --- */
.hero-overlay { 
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: rgba(253, 246, 227, 0.4); /* Voile plus léger car les livres sont déjà un peu gris */
  z-index: 20; 
}

.hero-card { 
  text-align: center; 
  padding: 3rem 4rem; 
  background: rgba(255, 255, 255, 0.75); 
  backdrop-filter: blur(8px); 
  border: 2px solid #000; 
  box-shadow: none; 
  max-width: 600px; 
}

.hero-btn { 
  font-size: 1.2rem !important; 
  padding: 15px 30px !important; 
}

/* --- RESPONSIVE MOBILE --- */
@media (max-width: 768px) {
  .wall-cover { height: 100px; }
  .book-wall { gap: 0.5rem; }
  .hero-card { 
    width: 90%; 
    padding: 1.5rem; 
  }
  .hero-card :deep(h1) { font-size: 2rem !important; margin-bottom: 0.5rem !important; }
  .hero-card :deep(p) { font-size: 1rem !important; margin-bottom: 1.5rem !important; }
  .hero-btn { font-size: 1rem !important; padding: 10px 20px !important; }
}
</style>