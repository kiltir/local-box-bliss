

## Plan : Amélioration du SEO pour l'indexation Google

### Objectif
Créer un fichier sitemap.xml et améliorer les meta tags SEO pour permettre à Google d'indexer correctement votre site kiltirbox.com.

---

### Ce qui sera fait

#### 1. Création du sitemap.xml
Un fichier `public/sitemap.xml` sera créé avec toutes les pages publiques du site :

**Pages incluses :**
- `/` - Page d'accueil
- `/notre-histoire` - Notre histoire
- `/nous-contacter` - Nous contacter
- `/faq` - Foire aux questions
- `/conditions-generales` - Conditions générales
- `/politique-confidentialite` - Politique de confidentialité
- `/mentions-legales` - Mentions légales
- `/nos-engagements` - Nos engagements
- `/devenir-fournisseur` - Devenir fournisseur

**Pages exclues (privées/techniques) :**
- `/auth`, `/checkout`, `/admin`, `/mes-informations`, `/mes-commandes`, etc.

#### 2. Amélioration des meta tags (index.html)

**Modifications :**
- Langue changée de `en` à `fr` (site français)
- Titre optimisé avec mots-clés
- Description enrichie et plus descriptive
- Ajout de mots-clés pertinents
- Image Open Graph personnalisée (logo KiltirBox au lieu de l'image Lovable par défaut)
- URL canonique ajoutée
- Meta tags Twitter personnalisés

---

### Détails techniques

**Fichiers créés :**
- `public/sitemap.xml`

**Fichiers modifiés :**
- `index.html` - Meta tags SEO optimisés

**Structure du sitemap.xml :**
```text
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kiltirbox.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ...
</urlset>
```

---

### Étapes après implémentation

1. **Soumettre le sitemap à Google** : Allez sur [Google Search Console](https://search.google.com/search-console), ajoutez votre site et soumettez l'URL du sitemap : `https://kiltirbox.com/sitemap.xml`

2. **Demander l'indexation** : Dans Search Console, utilisez l'outil "Inspection d'URL" pour demander l'indexation de vos pages principales

