
# LandPage AI — Générateur de Landing Pages WordPress

## Vue d'ensemble
Application SaaS permettant de créer des landing pages e-commerce professionnelles en moins de 10 minutes à partir de photos produits, avec export WordPress.

---

## 1. Interface & Design (Dark Theme Premium)

### Style visuel
- **Thème sombre** avec fond #0A0A0F et accents violet/bleu gradient
- **Typographie** : Inter pour l'UI, polices premium pour les landing pages générées
- **Composants** : Cards avec glassmorphism, animations fluides, indicateurs de progression

### Layout principal
- **Sidebar gauche** : Navigation (Dashboard, Projets, Templates, Paramètres)
- **Zone centrale** : Wizard ou éditeur de page
- **Preview** : Aperçu temps réel de la landing page

---

## 2. Wizard en 7 étapes

### Étape 1 — Informations projet
- Nom du projet
- Type de produit (physique, digital, service)
- Secteur d'activité (mode, tech, beauté, food, etc.)
- Public cible
- Objectif (vente directe, leads, précommande)

### Étape 2 — Import photos
- Upload drag & drop (jusqu'à 10 photos)
- Aperçu miniatures
- Détection automatique du produit principal
- Option : URL du produit existant

### Étape 3 — Choix du style visuel
- 4 styles prédéfinis : Studio, Luxe, Minimaliste, Lifestyle
- Preview de chaque style appliqué à la photo
- Options avancées : éclairage, ratio (1:1, 16:9, 9:16)

### Étape 4 — Identité de marque
- Upload logo (optionnel)
- Sélection couleur principale → génération palette automatique
- Choix typographies (3 suggestions basées sur le secteur)
- Preview du brand guide généré

### Étape 5 — Génération visuelle IA
- Bouton "Générer les visuels"
- Progress bar avec étapes : suppression fond, mise en scène, variantes
- Galerie des images générées (4-6 variantes)
- Sélection des images à utiliser
- Régénération individuelle possible

### Étape 6 — Assemblage landing page
- Sélection des sections à inclure :
  - ✓ Hero (image + titre + CTA)
  - ✓ Bénéfices produit (3-6 points)
  - ✓ Galerie produit
  - ✓ Témoignages (générés ou importés)
  - ✓ Section prix/offre
  - ✓ FAQ
  - ✓ CTA final
  - ✓ Footer
- Copywriting généré automatiquement par l'IA
- Édition inline de chaque section

### Étape 7 — Preview & Export
- Preview desktop/tablet/mobile
- Score SEO et PageSpeed estimé
- Options d'export :
  - ZIP (HTML/CSS/assets)
  - Plugin WordPress
  - Compatible Elementor/Gutenberg/WooCommerce
- Bouton "Publier"

---

## 3. Génération IA (Lovable Cloud)

### Images
- Utilisation de **Gemini 2.5 Flash Image** pour :
  - Suppression de fond automatique
  - Mise en scène lifestyle du produit
  - Génération de variantes visuelles
  - Ajustement éclairage/ambiance

### Texte (Copywriting)
- Utilisation de **Gemini 3 Flash** pour :
  - Titre accrocheur
  - Description produit
  - Bénéfices clients
  - Témoignages réalistes
  - FAQ pertinentes
  - CTA optimisés conversion

---

## 4. Authentification & Plans

### Authentification
- Inscription email/mot de passe
- Connexion Google (optionnel futur)
- Gestion de session sécurisée

### Plans tarifaires
| Fonctionnalité | Gratuit | Pro (€29/mois) |
|----------------|---------|----------------|
| Landing pages | 1/mois | Illimitées |
| Images IA | 10/mois | 500/mois |
| Export ZIP | ✓ | ✓ |
| Export WordPress | ✗ | ✓ |
| Styles premium | ✗ | ✓ |
| Support prioritaire | ✗ | ✓ |

---

## 5. Base de données (Lovable Cloud)

### Tables
- **users** : profil utilisateur lié à auth
- **user_roles** : gestion des rôles (séparé pour sécurité)
- **projects** : projets de landing page
- **project_images** : images uploadées et générées
- **generated_pages** : HTML/CSS des pages créées
- **usage_tracking** : suivi quotas images/pages

---

## 6. Dashboard utilisateur

- Liste des projets avec statut et date
- Aperçu miniature de chaque landing page
- Compteur d'utilisation (images restantes, pages du mois)
- Accès rapide "Nouveau projet"
- Upgrade vers Pro (si gratuit)

---

## 7. Export WordPress

### Contenu du ZIP généré
```
landing-page-export/
├── index.html
├── style.css
├── assets/
│   ├── images/
│   └── fonts/
└── wordpress-plugin/
    ├── plugin.php
    └── templates/
```

### Compatibilité
- Gutenberg : blocs personnalisés
- Elementor : widgets importables
- WooCommerce : intégration produit

---

## Étapes d'implémentation

1. **Configuration** — Lovable Cloud + Auth + Base de données
2. **UI/Composants** — Design system dark theme + composants réutilisables
3. **Wizard étapes 1-4** — Formulaires et uploads
4. **Intégration IA** — Edge functions pour génération images et texte
5. **Wizard étapes 5-7** — Génération, assemblage, preview
6. **Export** — Génération ZIP et plugin WordPress
7. **Plans & Paiement** — Stripe pour abonnements Pro
8. **Dashboard** — Gestion projets et quotas

