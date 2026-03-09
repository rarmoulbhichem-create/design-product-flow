

# Plan : Page "Exemples" avec demos de landing pages

## Objectif
Créer une page `/templates` accessible depuis le bouton "Voir les exemples" qui affiche de vrais exemples de landing pages générées, une par template disponible (10 templates), avec des données de produits réalistes adaptées au marché algérien.

## Ce qui sera créé

### 1. Fichier de données démo (`src/lib/demoProjects.ts`)
Un fichier contenant 10 projets de démonstration pré-remplis, un par template :
- **Elegant** : Parfum de luxe
- **Bold** : Sneakers sport
- **Minimal** : Montre connectée
- **Suspended** : Lampe design
- **Luxury** : Bijou en or
- **Fashion** : Robe de soirée
- **Tech** : Écouteurs Bluetooth
- **Flash Sale** : Robot cuisine en promo
- **Neon** : Manette gaming
- **Editorial** : Livre / carnet artisanal

Chaque projet contiendra des données complètes (`GeneratedProject`) : product, pricing en DZD, hero, testimonials, benefits, FAQ, etc.

### 2. Page Templates (`src/pages/Templates.tsx`)
- Grille de cartes affichant chaque template avec :
  - Nom du template et badge de style (dark/light)
  - Produit exemple avec prix
  - Bouton "Voir la démo" ouvrant une preview
- Modal plein écran avec la preview complète de la landing page (réutilisant le composant `LandingPreview` existant ou un rendu simplifié)
- Responsive : 1 col mobile, 2 cols tablette, 3 cols desktop

### 3. Modifications existantes
- **`src/App.tsx`** : Ajout de la route `/templates` (publique, pas protégée)
- **`src/pages/Landing.tsx`** : Le lien "Voir les exemples" pointe déjà vers `/templates` -- aucun changement nécessaire

## Architecture technique

```text
src/lib/demoProjects.ts    ← données statiques (10 projets demo)
src/pages/Templates.tsx    ← nouvelle page avec grille + modal preview
src/App.tsx                ← ajout route /templates
```

La page sera publique (pas de `ProtectedRoute`) pour que les visiteurs non connectés puissent voir les exemples depuis la landing page.

