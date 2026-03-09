

# Plan: Application Multilingue (Français/Arabe)

## Objectif
Rendre toute l'application disponible en français et en arabe avec possibilité de basculer entre les deux langues.

---

## Architecture proposée

### 1. Création d'un système i18n centralisé

**Nouveau fichier `src/lib/i18n.ts`** :
- Objet de traductions structuré avec toutes les chaînes de l'app
- Hook `useLanguage()` pour accéder aux traductions
- Support RTL automatique pour l'arabe

```text
src/lib/i18n.ts
├── translations: { ar: {...}, fr: {...} }
├── useLanguage() → { t, lang, setLang, dir }
└── LanguageProvider (context)
```

### 2. Context global pour la langue de l'interface

**Mise à jour `src/contexts/AppContext.tsx`** :
- Ajout de `interfaceLanguage: "ar" | "fr"` (distinct de `selectedLanguage` pour les landing pages)
- Persistance dans `localStorage`

### 3. Sélecteur de langue dans l'interface

**Mise à jour `AppSidebar.tsx` ou création d'un composant `LanguageSwitcher`** :
- Bouton toggle AR/FR dans le header ou sidebar
- Change la langue de l'interface en temps réel

---

## Fichiers à modifier

| Fichier | Changements |
|---------|------------|
| `src/lib/i18n.ts` | **Créer** - Traductions + hook |
| `src/contexts/AppContext.tsx` | Ajouter `interfaceLanguage` |
| `src/components/ProductUpload.tsx` | Utiliser `t.xxx` au lieu du texte en dur |
| `src/components/ExportPage.tsx` | Utiliser traductions |
| `src/components/LandingPreview.tsx` | Étendre les traductions existantes |
| `src/pages/Landing.tsx` | Traduire en AR/FR |
| `src/pages/Dashboard.tsx` | Traduire en AR/FR |
| `src/components/layout/AppSidebar.tsx` | Traduire + ajouter switcher |

---

## Structure des traductions

```typescript
const translations = {
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    myProjects: "مشاريعي",
    templates: "القوالب",
    settings: "الإعدادات",
    newProject: "مشروع جديد",
    
    // Upload
    uploadTitle: "ارفع صور المنتج",
    uploadSubtitle: "احصل على صفحة هبوط كاملة",
    generateLanding: "إنشاء صفحة الهبوط",
    // ... 50+ autres clés
  },
  fr: {
    dashboard: "Tableau de bord",
    myProjects: "Mes Projets",
    // ...
  }
}
```

---

## Détails techniques

1. **Direction du texte** : `dir="rtl"` pour l'arabe, `dir="ltr"` pour le français - appliqué au `<html>` ou au conteneur principal

2. **Persistance** : La langue choisie est sauvegardée dans `localStorage` et restaurée au chargement

3. **Séparation des langues** :
   - `interfaceLanguage` : Langue de l'UI (menus, boutons)
   - `selectedLanguage` : Langue du contenu généré (landing page)

4. **Composant LanguageSwitcher** : Bouton compact avec drapeaux 🇩🇿/🇫🇷 dans le header

