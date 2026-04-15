# Prog_web_S4 - The Dog-Eared Page

Voici le repository de mon projet de programmation Web fait dans le cadre du cours de M. Libert en 2026.

**Date :** 2026
**Auteur :** Louise JANUEL - IMAC
**Version en ligne :** [https://louisejanuel.github.io/projet_web_S4/](https://louisejanuel.github.io/projet_web_S4/)

## Présentation du projet
Ce projet a été réalisé dans le cadre de l'évaluation du cours de **Programmation Web 3** encadré par M. Libert.
Il s'agit d'une Single Page Application développée avec **Vue.js**, permettant aux utilisateurs d'explorer, de rechercher, de trier et de sauvegarder des livres. 

L'application exploite l'API publique **Google Books** pour récupérer les données en temps réel et utilise le stockage local du navigateur pour conserver la liste de lecture de l'utilisateur.

## Instructions pour lancer le projet en local

**Pré-requis :** Vous devez disposer de Node.js installé sur votre machine.

Clonez le dépôt, ouvrez un terminal à la racine du projet et installez les paquets nécessaires :

```bash
npm install
```

Tapez ensuite ceci pour lancer le projet :

```bash
npm run dev
```

### Configuration de la clé API
Pour des raisons de sécurité, la clé de l'API Google Books n'est pas incluse sur Github. Vous devez donc créer votre propre configuration locale :
1. Créez un fichier `.env` à la racine du projet.
2. Copiez/collez la ligne suivante à l'intérieur :
```env
VITE_GOOGLE_BOOKS_API_KEY=votre_cle_api_google_books_ici
```