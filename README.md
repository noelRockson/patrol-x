# Patrol-X Frontend

Interface frontend pour le système de surveillance en temps réel Patrol-X.

## 🚀 Installation

```bash
npm install
```

## 🏃 Démarrage

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📦 Technologies

- **React 18** - Bibliothèque UI
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Leaflet** - Cartographie interactive
- **Leaflet** - Bibliothèque de cartes
- **Framer Motion** - Animations
- **Zustand** - State management
- **Axios** - HTTP client

## 📂 Structure

```
src/
 ├─ components/
 │   ├─ SidebarPriority.jsx  # Colonne gauche - Priorités
 │   ├─ MapView.jsx           # Colonne centrale - Carte (React Leaflet)
 │   ├─ Chat.jsx              # Colonne droite - Chat
 │   ├─ ChatMessage.jsx       # Composant message
 │   ├─ Logo.jsx              # Composant logo
 │   └─ Layout.jsx            # Layout principal
 ├─ context/
 │   └─ store.js              # Store Zustand
 ├─ api/
 │   └─ api.js                # Appels API (simulés)
 ├─ utils/
 │   └─ communesData.js       # Données géographiques des communes
 ├─ styles/
 │   └─ leaflet.css           # Styles personnalisés Leaflet
 ├─ App.jsx
 └─ main.jsx
```

## 🌐 API

Les endpoints sont simulés avec des délais pour simuler un backend réel :

- `GET /zone/:name` - Récupère l'état des lieux d'une zone
- `POST /ask` - Pose une question à l'IA

Pour connecter le vrai backend, modifiez `VITE_API_URL` dans `.env`

## 🎨 Fonctionnalités

- ✅ Carte interactive avec React Leaflet
- ✅ Affichage des 7 communes de Port-au-Prince avec polygones colorés
- ✅ Noms des communes visibles sur la carte
- ✅ Zones cliquables avec animations hover
- ✅ Zoom automatique sur la commune sélectionnée
- ✅ Chat conversationnel avec messages
- ✅ Priorités dynamiques (Urgent, Pertinent, Ignoré)
- ✅ Interface responsive en 3 colonnes
- ✅ Logo professionnel (SVG + composant React)

## 🗺️ Communes disponibles

La carte affiche les 7 principales communes de Port-au-Prince :
- **Delmas** (395,260 hab.)
- **Pétion-Ville** (283,052 hab.)
- **Croix-des-Bouquets** (229,127 hab.)
- **Carrefour** (465,019 hab.)
- **Port-au-Prince** (987,310 hab.)
- **Cité Soleil** (241,093 hab.)
- **Tabarre** (118,477 hab.)

Chaque commune a une couleur distincte et peut être sélectionnée pour voir l'état des lieux en temps réel.

## 🎨 Logo

Le logo Patrol-X est disponible dans `public/assets/logo.svg` et via le composant `Logo.jsx`.

**Style** : Minimal, moderne, professionnel
**Éléments** : Bouclier/radar + onde + lettre X stylisée
**Couleur** : Bleu primaire (#2563EB) + neutres

Pour générer le PNG 512×512, consultez `public/assets/README.md`.

