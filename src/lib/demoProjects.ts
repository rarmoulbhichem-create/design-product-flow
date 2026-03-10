import type { GeneratedProject, LandingTemplate } from "@/types/project";

function createDemoProject(overrides: Partial<GeneratedProject> & { template: LandingTemplate }): GeneratedProject {
  const base: GeneratedProject = {
    product: {
      name: "Produit Demo",
      brand: "Marque",
      category: "Général",
      subcategory: "",
      shortDescription: "Description courte",
      longDescription: "Description longue du produit avec tous les détails nécessaires pour convaincre le client.",
      targetAudience: "Tous",
      specifications: [],
      tags: [],
    },
    pricing: {
      price: 5900,
      originalPrice: 8900,
      currency: "DA",
      discountPercent: 34,
      shippingInfo: "Livraison gratuite partout en Algérie",
      guarantee: "Garantie 30 jours satisfait ou remboursé",
    },
    landingPage: {
      hero: {
        headline: "Titre principal",
        subheadline: "Sous-titre accrocheur",
        ctaText: "Commander maintenant",
        ctaSubtext: "Livraison gratuite",
        badge: "Nouveau",
      },
      trustBadges: ["Livraison gratuite", "Paiement à la livraison", "Garantie 30 jours"],
      benefits: [
        { icon: "Star", title: "Qualité premium", description: "Matériaux de haute qualité" },
        { icon: "Shield", title: "Garanti", description: "Satisfaction garantie" },
        { icon: "Zap", title: "Rapide", description: "Livraison express" },
      ],
      socialProof: { rating: 4.8, reviewCount: 1250, satisfactionRate: 97 },
      testimonials: [
        { name: "Amina B.", location: "Alger", rating: 5, text: "Excellent produit, je recommande vivement !", verified: true, date: "2025-01-15" },
        { name: "Karim D.", location: "Oran", rating: 5, text: "Qualité exceptionnelle, livraison rapide.", verified: true, date: "2025-02-01" },
        { name: "Fatima Z.", location: "Constantine", rating: 4, text: "Très bon rapport qualité-prix.", verified: true, date: "2025-01-28" },
      ],
      features: [
        { title: "Design élégant", description: "Un design soigné qui attire l'attention" },
        { title: "Facile à utiliser", description: "Simple et intuitif pour tous" },
      ],
      faq: [
        { question: "Comment commander ?", answer: "Cliquez sur le bouton Commander et remplissez le formulaire." },
        { question: "Quel est le délai de livraison ?", answer: "Entre 2 et 5 jours ouvrables selon votre wilaya." },
      ],
      urgency: { text: "Offre limitée !", subtext: "Plus que quelques unités", stockText: "Stock limité" },
      finalCta: {
        headline: "Ne ratez pas cette offre !",
        subheadline: "Commandez maintenant et profitez de la livraison gratuite",
        buttonText: "Je commande",
        guaranteeText: "Garantie satisfait ou remboursé 30 jours",
      },
    },
    seo: { metaTitle: "", metaDescription: "", h1: "", keywords: [] },
    design: { primaryColor: "#6366f1", secondaryColor: "#8b5cf6", accentColor: "#f59e0b", backgroundColor: "#ffffff", textColor: "#1a1a2e", mood: "modern" },
    productImageUrl: "",
    generatedImages: [],
    template: "elegant",
  };

  return { ...base, ...overrides, product: { ...base.product, ...overrides.product }, pricing: { ...base.pricing, ...overrides.pricing }, landingPage: { ...base.landingPage, ...overrides.landingPage, hero: { ...base.landingPage.hero, ...overrides.landingPage?.hero }, socialProof: { ...base.landingPage.socialProof, ...overrides.landingPage?.socialProof }, urgency: { ...base.landingPage.urgency, ...overrides.landingPage?.urgency }, finalCta: { ...base.landingPage.finalCta, ...overrides.landingPage?.finalCta } } };
}

export const DEMO_PROJECTS: { template: LandingTemplate; label: string; product: string; price: string }[] = [
  { template: "elegant", label: "Élégant", product: "Parfum Royal Oud", price: "7 900 DA" },
  { template: "bold", label: "Audacieux", product: "Air Max Pulse DZ", price: "14 500 DA" },
  { template: "minimal", label: "Minimal", product: "Montre Connectée X3", price: "12 900 DA" },
  { template: "suspended", label: "Suspendu", product: "Lampe Lévitation", price: "9 500 DA" },
  { template: "luxury", label: "Luxe", product: "Collier Perle d'Or", price: "24 900 DA" },
  { template: "fashion", label: "Mode", product: "Robe Velours Nuit", price: "8 900 DA" },
  { template: "tech", label: "Tech", product: "EarPods Pro Max", price: "6 900 DA" },
  { template: "flashsale", label: "Flash Sale", product: "Robot Cuisine Chef", price: "18 900 DA" },
  { template: "neon", label: "Néon", product: "Manette RGB Gamer", price: "5 900 DA" },
  { template: "editorial", label: "Éditorial", product: "Carnet Artisan Cuir", price: "3 500 DA" },
];

export function getDemoProject(template: LandingTemplate): GeneratedProject {
  switch (template) {
    case "elegant":
      return createDemoProject({
        template: "elegant",
        productImageUrl: "/demos/parfum-royal-oud.jpg",
        product: { name: "Royal Oud", brand: "Maison Élégance", category: "Parfum", subcategory: "Eau de Parfum", shortDescription: "Parfum oriental boisé d'exception", longDescription: "Royal Oud est un parfum captivant qui allie la profondeur du oud à la fraîcheur des agrumes. Chaque flacon est une œuvre d'art, conçue pour ceux qui recherchent l'excellence.", targetAudience: "Hommes et femmes élégants", specifications: [{ label: "Volume", value: "100ml" }, { label: "Famille", value: "Oriental boisé" }, { label: "Tenue", value: "12h+" }], tags: ["parfum", "luxe", "oud"] },
        pricing: { price: 7900, originalPrice: 11900, currency: "DA", discountPercent: 34, shippingInfo: "Livraison gratuite", guarantee: "Garantie authenticité" },
        landingPage: { hero: { headline: "L'élégance en un souffle", subheadline: "Découvrez Royal Oud — le parfum qui laisse une empreinte inoubliable", ctaText: "Commander maintenant", ctaSubtext: "Livraison gratuite en Algérie", badge: "Bestseller" }, trustBadges: ["100% Authentique", "Livraison gratuite", "Satisfait ou remboursé"], benefits: [{ icon: "Star", title: "Tenue 12h+", description: "Un sillage qui dure toute la journée" }, { icon: "Shield", title: "100% Original", description: "Certifié authentique" }, { icon: "Heart", title: "Coffret premium", description: "Emballage cadeau offert" }], socialProof: { rating: 4.9, reviewCount: 2340, satisfactionRate: 98 }, testimonials: [{ name: "Amina B.", location: "Alger", rating: 5, text: "Un parfum absolument divin, je reçois des compliments à chaque fois !", verified: true, date: "2025-02-10" }, { name: "Yacine M.", location: "Oran", rating: 5, text: "Tenue exceptionnelle, le meilleur rapport qualité-prix.", verified: true, date: "2025-01-20" }, { name: "Sara K.", location: "Constantine", rating: 5, text: "Le coffret est magnifique, parfait pour offrir.", verified: true, date: "2025-02-05" }], features: [{ title: "Notes de tête", description: "Bergamote, poivre rose" }, { title: "Notes de cœur", description: "Oud, rose de Taif" }, { title: "Notes de fond", description: "Ambre, musc blanc" }], faq: [{ question: "Est-ce un parfum original ?", answer: "Oui, 100% authentique avec certificat." }, { question: "Combien de temps dure la tenue ?", answer: "Plus de 12 heures en moyenne." }], urgency: { text: "Offre limitée !", subtext: "Plus que 23 flacons", stockText: "Stock limité" }, finalCta: { headline: "Offrez-vous l'excellence", subheadline: "Commandez Royal Oud aujourd'hui", buttonText: "Je commande", guaranteeText: "Satisfait ou remboursé 30 jours" } } as any,
      });
    case "bold":
      return createDemoProject({
        template: "bold",
        productImageUrl: "/demos/air-max-pulse.jpg",
        product: { name: "Air Max Pulse DZ", brand: "SportZone", category: "Chaussures", subcategory: "Sport", shortDescription: "Sneakers de performance ultime", longDescription: "Les Air Max Pulse DZ combinent confort et style pour les athlètes urbains. Semelle amortissante, tige respirante et design audacieux.", targetAudience: "Sportifs et passionnés de mode", specifications: [{ label: "Pointures", value: "39–46" }, { label: "Semelle", value: "Air cushion" }], tags: ["sneakers", "sport"] },
        pricing: { price: 14500, originalPrice: 19900, currency: "DA", discountPercent: 27, shippingInfo: "Livraison express 48h", guarantee: "Échange gratuit" },
        landingPage: { hero: { headline: "EXPLOSEZ VOS LIMITES", subheadline: "La sneaker qui vous propulse au sommet", ctaText: "ACHETER MAINTENANT", ctaSubtext: "Paiement à la livraison", badge: "NOUVEAU" }, trustBadges: ["Livraison 48h", "Échange gratuit", "Paiement à la livraison"], benefits: [{ icon: "Zap", title: "Ultra léger", description: "Seulement 280g" }, { icon: "Shield", title: "Anti-dérapant", description: "Grip maximal" }, { icon: "Star", title: "Confort total", description: "Coussin d'air intégré" }], socialProof: { rating: 4.7, reviewCount: 890, satisfactionRate: 96 }, testimonials: [{ name: "Mehdi L.", location: "Alger", rating: 5, text: "Les meilleures sneakers que j'ai portées !", verified: true, date: "2025-01-15" }, { name: "Rania S.", location: "Blida", rating: 5, text: "Super confortables pour le sport.", verified: true, date: "2025-02-01" }, { name: "Amine K.", location: "Sétif", rating: 4, text: "Design top, livraison rapide.", verified: true, date: "2025-01-28" }], features: [{ title: "Semelle Air Cushion", description: "Amortissement supérieur à chaque pas" }, { title: "Tige respirante", description: "Mesh 3D pour une ventilation optimale" }], faq: [{ question: "Comment choisir ma taille ?", answer: "Consultez notre guide des tailles pour trouver votre pointure idéale." }, { question: "Puis-je échanger si la taille ne convient pas ?", answer: "Oui, échange gratuit sous 14 jours." }], urgency: { text: "PROMO FLASH !", subtext: "Se termine bientôt", stockText: "Dernières paires" }, finalCta: { headline: "PASSEZ À L'ACTION", subheadline: "Ne laissez pas passer cette offre", buttonText: "J'ACHÈTE", guaranteeText: "Échange gratuit garanti" } } as any,
      });
    case "minimal":
      return createDemoProject({
        template: "minimal",
        productImageUrl: "/demos/montre-connectee.jpg",
        product: { name: "Montre Connectée X3", brand: "TechMinimal", category: "Montres", subcategory: "Connectée", shortDescription: "L'essentiel au poignet", longDescription: "Design épuré, fonctionnalités essentielles. Suivi santé, notifications et autonomie de 7 jours.", targetAudience: "Minimalistes et technophiles", specifications: [{ label: "Autonomie", value: "7 jours" }, { label: "Écran", value: "AMOLED 1.4\"" }], tags: ["montre", "tech", "santé"] },
        pricing: { price: 12900, originalPrice: 16900, currency: "DA", discountPercent: 24, shippingInfo: "Livraison gratuite", guarantee: "Garantie 1 an" },
        landingPage: { hero: { headline: "Moins, c'est plus", subheadline: "La montre qui simplifie votre quotidien", ctaText: "Découvrir", ctaSubtext: "Livraison offerte", badge: "Nouveau" }, trustBadges: ["Garantie 1 an", "Livraison offerte", "SAV réactif"], benefits: [{ icon: "Zap", title: "7 jours d'autonomie", description: "Une charge par semaine suffit" }, { icon: "Heart", title: "Suivi santé", description: "Fréquence cardiaque, sommeil, SpO2" }, { icon: "Shield", title: "Étanche IP68", description: "Résiste à l'eau et la poussière" }], socialProof: { rating: 4.6, reviewCount: 560, satisfactionRate: 95 }, testimonials: [{ name: "Lina M.", location: "Alger", rating: 5, text: "Design sublime et très pratique.", verified: true, date: "2025-01-20" }, { name: "Omar T.", location: "Tizi Ouzou", rating: 4, text: "Bon rapport qualité-prix.", verified: true, date: "2025-02-03" }, { name: "Nadia R.", location: "Annaba", rating: 5, text: "L'autonomie est incroyable.", verified: true, date: "2025-01-10" }], features: [{ title: "Écran AMOLED", description: "Couleurs vives, lisible en plein soleil" }, { title: "Notifications smart", description: "Appels, messages et apps sur votre poignet" }], faq: [{ question: "Est-elle compatible avec iPhone ?", answer: "Oui, compatible iOS et Android." }, { question: "Peut-on nager avec ?", answer: "Oui, étanche IP68 jusqu'à 1.5m." }], urgency: { text: "Offre de lancement", subtext: "Prix spécial", stockText: "Stock limité" }, finalCta: { headline: "Simplifiez votre vie", subheadline: "Commandez votre X3 aujourd'hui", buttonText: "Commander", guaranteeText: "Garantie 1 an constructeur" } } as any,
      });
    case "suspended":
      return createDemoProject({
        template: "suspended",
        productImageUrl: "/demos/lampe-levitation.jpg",
        product: { name: "Lampe Lévitation", brand: "FloatDesign", category: "Décoration", subcategory: "Lampe", shortDescription: "L'éclairage en apesanteur", longDescription: "Cette lampe magnétique flotte dans les airs grâce à la lévitation électromagnétique. Un objet de décoration futuriste et fonctionnel.", targetAudience: "Amateurs de design et déco", specifications: [{ label: "Puissance", value: "12W LED" }, { label: "Technologie", value: "Lévitation magnétique" }], tags: ["lampe", "design", "déco"] },
        pricing: { price: 9500, originalPrice: 13900, currency: "DA", discountPercent: 32, shippingInfo: "Livraison sécurisée", guarantee: "Garantie 2 ans" },
        landingPage: { hero: { headline: "La lumière en lévitation", subheadline: "Un objet qui défie la gravité et sublime votre intérieur", ctaText: "Commander", ctaSubtext: "Emballage ultra-sécurisé", badge: "Exclusif" }, trustBadges: ["Emballage sécurisé", "Garantie 2 ans", "SAV dédié"], benefits: [{ icon: "Star", title: "Effet WOW garanti", description: "Impressionnez vos invités" }, { icon: "Zap", title: "Économique", description: "LED basse consommation" }, { icon: "Shield", title: "Garantie 2 ans", description: "Remplacement immédiat" }], socialProof: { rating: 4.8, reviewCount: 430, satisfactionRate: 97 }, testimonials: [{ name: "Hicham B.", location: "Alger", rating: 5, text: "Un vrai objet d'art, mes invités adorent !", verified: true, date: "2025-01-25" }, { name: "Meriem A.", location: "Oran", rating: 5, text: "La qualité est au rendez-vous.", verified: true, date: "2025-02-08" }, { name: "Samir D.", location: "Béjaïa", rating: 4, text: "Installation facile, rendu magnifique.", verified: true, date: "2025-01-30" }], features: [{ title: "Lévitation magnétique", description: "Flotte à 15mm de la base" }, { title: "Rotation 360°", description: "Tourne lentement pour un effet hypnotique" }], faq: [{ question: "Comment fonctionne la lévitation ?", answer: "Grâce à des aimants puissants dans la base et le luminaire." }, { question: "Est-ce fragile ?", answer: "Non, la structure est en aluminium renforcé." }], urgency: { text: "Édition limitée", subtext: "Production artisanale", stockText: "Seulement 50 unités" }, finalCta: { headline: "Élevez votre intérieur", subheadline: "Commandez cette pièce unique", buttonText: "Je commande", guaranteeText: "Garantie 2 ans + retour gratuit" } } as any,
      });
    case "luxury":
      return createDemoProject({
        template: "luxury",
        productImageUrl: "/demos/collier-perle-or.jpg",
        product: { name: "Collier Perle d'Or", brand: "Maison Dorée", category: "Bijoux", subcategory: "Collier", shortDescription: "L'éclat de l'or authentique", longDescription: "Collier en or 18 carats serti d'une perle de culture. Chaque pièce est unique, fabriquée à la main par nos artisans joailliers.", targetAudience: "Femmes élégantes", specifications: [{ label: "Or", value: "18 carats" }, { label: "Perle", value: "Culture, 8mm" }, { label: "Chaîne", value: "45cm ajustable" }], tags: ["bijou", "or", "luxe"] },
        pricing: { price: 24900, originalPrice: 34900, currency: "DA", discountPercent: 29, shippingInfo: "Livraison assurée", guarantee: "Certificat d'authenticité" },
        landingPage: { hero: { headline: "L'or qui raconte votre histoire", subheadline: "Un bijou d'exception pour les moments précieux", ctaText: "Offrir ce bijou", ctaSubtext: "Écrin cadeau inclus", badge: "Collection 2025" }, trustBadges: ["Or 18K certifié", "Écrin offert", "Livraison assurée"], benefits: [{ icon: "Star", title: "Fait main", description: "Par des artisans joailliers" }, { icon: "Shield", title: "Certifié", description: "Certificat d'authenticité inclus" }, { icon: "Heart", title: "Écrin cadeau", description: "Prêt à offrir" }], socialProof: { rating: 4.9, reviewCount: 320, satisfactionRate: 99 }, testimonials: [{ name: "Yasmine H.", location: "Alger", rating: 5, text: "Un bijou magnifique, ma femme était ravie !", verified: true, date: "2025-02-14" }, { name: "Dalila M.", location: "Oran", rating: 5, text: "Qualité exceptionnelle, l'or brille parfaitement.", verified: true, date: "2025-01-18" }, { name: "Nour S.", location: "Annaba", rating: 5, text: "Le certificat d'authenticité rassure.", verified: true, date: "2025-02-01" }], features: [{ title: "Or 18 carats", description: "Pureté et éclat incomparables" }, { title: "Perle de culture", description: "Sélectionnée pour son lustre naturel" }], faq: [{ question: "L'or est-il vérifié ?", answer: "Oui, chaque pièce est accompagnée d'un certificat d'authenticité." }, { question: "Peut-on graver le collier ?", answer: "Oui, gravure personnalisée disponible sur demande." }], urgency: { text: "Pièce unique", subtext: "Série limitée", stockText: "Plus que 12 pièces" }, finalCta: { headline: "L'exception à portée de main", subheadline: "Offrez un bijou qui traversera le temps", buttonText: "Commander", guaranteeText: "Certificat d'authenticité + écrin cadeau" } } as any,
      });
    case "fashion":
      return createDemoProject({
        template: "fashion",
        product: { name: "Robe Velours Nuit", brand: "Atelier Nora", category: "Mode", subcategory: "Robe", shortDescription: "Élégance en velours", longDescription: "Robe longue en velours de soie, coupe fluide et raffinée. Idéale pour les soirées et occasions spéciales.", targetAudience: "Femmes élégantes 25-45 ans", specifications: [{ label: "Matière", value: "Velours de soie" }, { label: "Tailles", value: "S–XL" }], tags: ["robe", "velours", "soirée"] },
        pricing: { price: 8900, originalPrice: 12900, currency: "DA", discountPercent: 31, shippingInfo: "Livraison soignée", guarantee: "Échange taille gratuit" },
        landingPage: { hero: { headline: "LA NUIT VOUS APPARTIENT", subheadline: "Une robe qui capture tous les regards", ctaText: "DÉCOUVRIR", ctaSubtext: "Échange taille gratuit", badge: "NOUVELLE COLLECTION" }, trustBadges: ["Confection artisanale", "Échange gratuit", "Emballage soigné"], benefits: [{ icon: "Star", title: "Velours premium", description: "Toucher soyeux incomparable" }, { icon: "Heart", title: "Coupe flatteuse", description: "Met en valeur toutes les silhouettes" }, { icon: "Shield", title: "Finitions soignées", description: "Coutures invisibles et doublure" }], socialProof: { rating: 4.8, reviewCount: 670, satisfactionRate: 97 }, testimonials: [{ name: "Houda L.", location: "Alger", rating: 5, text: "Une merveille, la matière est divine !", verified: true, date: "2025-02-10" }, { name: "Leila K.", location: "Oran", rating: 5, text: "Coupe parfaite, je me sens sublime.", verified: true, date: "2025-01-22" }, { name: "Imane B.", location: "Tlemcen", rating: 4, text: "Très belle robe, livraison rapide.", verified: true, date: "2025-02-05" }], features: [{ title: "Coupe empire", description: "Silhouette allongée et élégante" }, { title: "Doublure intégrale", description: "Confort optimal toute la soirée" }], faq: [{ question: "Comment choisir ma taille ?", answer: "Consultez notre guide des tailles ou contactez-nous." }, { question: "La robe est-elle lavable ?", answer: "Nettoyage à sec recommandé pour préserver le velours." }], urgency: { text: "Collection limitée", subtext: "Pièces uniques", stockText: "Plus que 18 pièces" }, finalCta: { headline: "SUBLIMEZ VOS SOIRÉES", subheadline: "Commandez votre robe de rêve", buttonText: "COMMANDER", guaranteeText: "Échange taille gratuit sous 14 jours" } } as any,
      });
    case "tech":
      return createDemoProject({
        template: "tech",
        product: { name: "EarPods Pro Max", brand: "SoundTech", category: "Audio", subcategory: "Écouteurs", shortDescription: "Son immersif sans fil", longDescription: "Écouteurs Bluetooth 5.3 avec réduction de bruit active, 36h d'autonomie et son Hi-Res. Le compagnon audio ultime.", targetAudience: "Audiophiles et gamers", specifications: [{ label: "Bluetooth", value: "5.3" }, { label: "Autonomie", value: "36h" }, { label: "ANC", value: "Réduction active" }], tags: ["écouteurs", "bluetooth", "ANC"] },
        pricing: { price: 6900, originalPrice: 9900, currency: "DA", discountPercent: 30, shippingInfo: "Livraison 48h", guarantee: "Garantie 1 an" },
        landingPage: { hero: { headline: "Le son du futur", subheadline: "Immergez-vous dans un univers sonore sans compromis", ctaText: "Commander", ctaSubtext: "Livraison express 48h", badge: "Tech 2025" }, trustBadges: ["Bluetooth 5.3", "36h autonomie", "ANC pro"], benefits: [{ icon: "Zap", title: "36h d'autonomie", description: "Une semaine sans recharge" }, { icon: "Shield", title: "ANC avancée", description: "Silence total en un clic" }, { icon: "Star", title: "Son Hi-Res", description: "Qualité studio partout" }], socialProof: { rating: 4.7, reviewCount: 1850, satisfactionRate: 96 }, testimonials: [{ name: "Sofiane M.", location: "Alger", rating: 5, text: "L'ANC est bluffante, je n'entends plus rien autour de moi.", verified: true, date: "2025-01-12" }, { name: "Rym A.", location: "Oran", rating: 5, text: "Son cristallin, confort parfait.", verified: true, date: "2025-02-08" }, { name: "Walid K.", location: "Blida", rating: 4, text: "Excellent pour le gaming.", verified: true, date: "2025-01-30" }], features: [{ title: "Bluetooth 5.3", description: "Connexion stable et ultra-rapide" }, { title: "Codec LDAC", description: "Audio haute résolution sans fil" }], faq: [{ question: "Sont-ils compatibles avec tous les appareils ?", answer: "Oui, compatible iOS, Android, PC et consoles." }, { question: "Le boîtier se charge en combien de temps ?", answer: "Charge complète en 1h30, charge rapide 10 min = 3h." }], urgency: { text: "Promo lancement", subtext: "-30% cette semaine", stockText: "Stock limité" }, finalCta: { headline: "Entrez dans le futur du son", subheadline: "Commandez vos EarPods Pro Max", buttonText: "Commander", guaranteeText: "Garantie 1 an + retour gratuit" } } as any,
      });
    case "flashsale":
      return createDemoProject({
        template: "flashsale",
        product: { name: "Robot Cuisine Chef", brand: "HomePro", category: "Électroménager", subcategory: "Robot", shortDescription: "Votre assistant culinaire", longDescription: "Robot multifonction 1200W : mixe, pétrit, hache, cuit vapeur. 12 programmes automatiques pour simplifier votre cuisine au quotidien.", targetAudience: "Familles et passionnés de cuisine", specifications: [{ label: "Puissance", value: "1200W" }, { label: "Capacité", value: "4.5L" }, { label: "Programmes", value: "12" }], tags: ["robot", "cuisine", "électroménager"] },
        pricing: { price: 18900, originalPrice: 29900, currency: "DA", discountPercent: 37, shippingInfo: "Livraison gratuite", guarantee: "Garantie 2 ans" },
        landingPage: { hero: { headline: "🔥 VENTE FLASH -37% 🔥", subheadline: "Le robot cuisine qui fait tout à votre place", ctaText: "PROFITER DE L'OFFRE", ctaSubtext: "Offre expire dans 24h", badge: "-37%" }, trustBadges: ["Livraison gratuite", "Garantie 2 ans", "-37% aujourd'hui"], benefits: [{ icon: "Zap", title: "1200W de puissance", description: "Mixe même les ingrédients les plus durs" }, { icon: "Star", title: "12 programmes", description: "De la soupe au pain, tout est automatique" }, { icon: "Shield", title: "Garantie 2 ans", description: "SAV disponible 7j/7" }], socialProof: { rating: 4.8, reviewCount: 3200, satisfactionRate: 98 }, testimonials: [{ name: "Karima D.", location: "Alger", rating: 5, text: "Il a changé ma vie en cuisine ! Tout est plus rapide.", verified: true, date: "2025-02-12" }, { name: "Mourad B.", location: "Sétif", rating: 5, text: "Rapport qualité-prix imbattable avec la promo.", verified: true, date: "2025-02-14" }, { name: "Amel F.", location: "Constantine", rating: 5, text: "Le pétrissage est parfait pour le pain maison.", verified: true, date: "2025-01-28" }], features: [{ title: "Bol inox 4.5L", description: "Grande capacité pour toute la famille" }, { title: "Lames auto-aiguisantes", description: "Performance constante dans le temps" }], faq: [{ question: "Est-ce bruyant ?", answer: "Non, moteur silencieux grâce à la technologie SilentDrive." }, { question: "Les accessoires passent au lave-vaisselle ?", answer: "Oui, toutes les pièces amovibles sont compatibles." }], urgency: { text: "🔥 VENTE FLASH 🔥", subtext: "Se termine dans 24h", stockText: "Plus que 34 unités" }, finalCta: { headline: "NE RATEZ PAS CETTE OFFRE !", subheadline: "Prix le plus bas de l'année", buttonText: "J'EN PROFITE MAINTENANT", guaranteeText: "Garantie 2 ans + livraison gratuite" } } as any,
      });
    case "neon":
      return createDemoProject({
        template: "neon",
        product: { name: "Manette RGB Gamer", brand: "NeonPlay", category: "Gaming", subcategory: "Accessoire", shortDescription: "La manette qui brille", longDescription: "Manette sans fil avec éclairage RGB personnalisable, retour haptique avancé et 20h d'autonomie. Conçue pour les joueurs exigeants.", targetAudience: "Gamers 15-35 ans", specifications: [{ label: "Connexion", value: "Bluetooth + 2.4GHz" }, { label: "Autonomie", value: "20h" }, { label: "RGB", value: "16M couleurs" }], tags: ["gaming", "manette", "RGB"] },
        pricing: { price: 5900, originalPrice: 8500, currency: "DA", discountPercent: 31, shippingInfo: "Livraison express", guarantee: "Garantie 1 an" },
        landingPage: { hero: { headline: "GAME ON, LIGHTS ON", subheadline: "La manette qui transforme chaque session en spectacle", ctaText: "Commander", ctaSubtext: "Compatible PS/Xbox/PC", badge: "RGB Pro" }, trustBadges: ["Multi-plateforme", "20h autonomie", "16M couleurs RGB"], benefits: [{ icon: "Zap", title: "Retour haptique", description: "Ressentez chaque impact" }, { icon: "Star", title: "16M couleurs", description: "RGB entièrement personnalisable" }, { icon: "Shield", title: "Multi-plateforme", description: "PS, Xbox, PC, Switch" }], socialProof: { rating: 4.7, reviewCount: 1560, satisfactionRate: 96 }, testimonials: [{ name: "Amine G.", location: "Alger", rating: 5, text: "L'éclairage RGB est fou, elle est magnifique !", verified: true, date: "2025-01-20" }, { name: "Rayane T.", location: "Oran", rating: 5, text: "Très réactive, parfaite pour le FPS.", verified: true, date: "2025-02-05" }, { name: "Nassim L.", location: "Blida", rating: 4, text: "Bonne prise en main, autonomie top.", verified: true, date: "2025-01-15" }], features: [{ title: "Double connexion", description: "Bluetooth + dongle 2.4GHz ultra-rapide" }, { title: "Trigger adaptatifs", description: "Résistance variable selon le jeu" }], faq: [{ question: "Compatible avec quelles consoles ?", answer: "PS4, PS5, Xbox One/Series, Switch et PC." }, { question: "Peut-on personnaliser les couleurs ?", answer: "Oui, via l'application NeonPlay (iOS/Android)." }], urgency: { text: "Offre gamer", subtext: "Stock limité", stockText: "Plus que 67 unités" }, finalCta: { headline: "Level up ton setup", subheadline: "Commandez la manette RGB ultime", buttonText: "Commander", guaranteeText: "Garantie 1 an + retour gratuit 14 jours" } } as any,
      });
    case "editorial":
      return createDemoProject({
        template: "editorial",
        product: { name: "Carnet Artisan Cuir", brand: "Scripta", category: "Papeterie", subcategory: "Carnet", shortDescription: "L'art d'écrire, réinventé", longDescription: "Carnet relié en cuir véritable, 200 pages en papier ivoire 120g. Couverture gravée à la main par des artisans algériens.", targetAudience: "Écrivains, créatifs, collectionneurs", specifications: [{ label: "Couverture", value: "Cuir véritable" }, { label: "Pages", value: "200, ivoire 120g" }, { label: "Format", value: "A5" }], tags: ["carnet", "cuir", "artisanal"] },
        pricing: { price: 3500, originalPrice: 4900, currency: "DA", discountPercent: 29, shippingInfo: "Livraison soignée", guarantee: "Pièce unique certifiée" },
        landingPage: { hero: { headline: "Chaque page, une histoire", subheadline: "Un carnet artisanal pour ceux qui écrivent avec le cœur", ctaText: "Découvrir", ctaSubtext: "Fait main en Algérie", badge: "Artisanal" }, trustBadges: ["Fait main", "Cuir véritable", "Papier premium"], benefits: [{ icon: "Star", title: "Cuir véritable", description: "Patine naturelle avec le temps" }, { icon: "Heart", title: "Fait main", description: "Par des artisans algériens" }, { icon: "Shield", title: "Papier 120g", description: "Compatible plume et feutre" }], socialProof: { rating: 4.9, reviewCount: 280, satisfactionRate: 99 }, testimonials: [{ name: "Farid H.", location: "Ghardaïa", rating: 5, text: "Un objet magnifique, le cuir est superbe.", verified: true, date: "2025-02-10" }, { name: "Selma C.", location: "Alger", rating: 5, text: "Parfait pour le journaling, le papier est doux.", verified: true, date: "2025-01-25" }, { name: "Kamel A.", location: "Tizi Ouzou", rating: 5, text: "Un cadeau qui a fait sensation.", verified: true, date: "2025-02-08" }], features: [{ title: "Reliure cousue", description: "S'ouvre à plat pour un confort d'écriture parfait" }, { title: "Gravure personnalisable", description: "Initiales ou motif au choix" }], faq: [{ question: "Peut-on personnaliser la couverture ?", answer: "Oui, gravure de vos initiales ou d'un motif au choix." }, { question: "Le papier convient-il à la plume ?", answer: "Oui, papier 120g sans transparence." }], urgency: { text: "Série limitée", subtext: "Production artisanale", stockText: "Plus que 25 carnets" }, finalCta: { headline: "Écrivez votre histoire", subheadline: "Commandez votre carnet artisanal", buttonText: "Commander", guaranteeText: "Pièce unique certifiée artisanale" } } as any,
      });
    default:
      return createDemoProject({ template });
  }
}
