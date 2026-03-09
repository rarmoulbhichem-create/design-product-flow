

## Plan : Ajouter déconnexion et annulation de demande de paiement

### 1. Ajouter un bouton "Déconnexion" dans la sidebar

**Fichier : `src/components/layout/AppSidebar.tsx`**

- Importer `LogOut` de lucide-react
- Utiliser `signOut` depuis `useAuth()`
- Ajouter un bouton "Déconnexion" dans le `SidebarFooter`, avant ou après le bloc upgrade

### 2. Permettre à l'utilisateur d'annuler sa demande de paiement en attente

**Fichier : `src/pages/Upgrade.tsx`**

- Au chargement, vérifier si l'utilisateur a une demande `pending` existante dans `payment_requests`
- Si oui, afficher un état "demande en cours" avec un bouton "Annuler la demande"
- Le bouton supprime la ligne de `payment_requests` (ou met le statut à `cancelled`)

**Migration SQL nécessaire :**
- Ajouter une politique RLS permettant aux utilisateurs de supprimer leurs propres demandes de paiement en attente (actuellement, DELETE n'est pas autorisé)

### 3. Résultat attendu

- L'utilisateur peut se déconnecter depuis la sidebar
- S'il a déjà soumis une demande de paiement, il voit son statut et peut l'annuler si elle est encore en attente

