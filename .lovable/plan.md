

## Problème

La page `/admin` existe mais il n'y a aucun lien dans la sidebar pour y accéder. L'utilisateur doit taper `/admin` manuellement dans l'URL, ce qui n'est pas pratique.

## Plan

### 1. Ajouter un lien "Administration" dans la sidebar (visible uniquement pour les admins)

**Fichier : `src/components/layout/AppSidebar.tsx`**

- Ajouter un état `isAdmin` avec un `useEffect` qui appelle `supabase` pour vérifier si l'utilisateur connecté a le rôle `admin` via la fonction `has_role`.
- Importer `useAuth` pour obtenir le `user`.
- Si `isAdmin` est `true`, afficher un lien supplémentaire avec l'icône `Shield` vers `/admin` dans la section navigation secondaire (ou dans une section dédiée "Admin").

### 2. Résultat attendu

- Les utilisateurs normaux ne voient aucun changement dans la sidebar.
- Les administrateurs voient un lien "Administration" avec l'icône bouclier qui mène à `/admin`.

