
## Plan : Afficher votre logo dans les résultats Google

### Ce que Google affiche
Google affiche une petite icône (favicon) à côté du nom de votre site dans les résultats de recherche. Pour que cela fonctionne correctement, il faut :
- Un favicon en plusieurs tailles
- Un fichier "manifest" qui décrit votre site
- Des balises HTML appropriées

---

### Ce qui sera fait

#### 1. Copier le logo dans le dossier public
Votre logo `kiltirbox-logo.png` sera copié dans `public/` pour être accessible.

#### 2. Créer un fichier manifest (site.webmanifest)
Ce fichier indique à Google et aux navigateurs les informations sur votre site :
- Nom du site
- Icônes disponibles
- Couleurs de thème

#### 3. Mettre à jour index.html
Ajout des balises nécessaires :
- **Apple Touch Icon** : Pour les appareils Apple (iPhone, iPad)
- **Manifest** : Lien vers le fichier webmanifest
- **Theme color** : Couleur de la barre de navigation mobile
- **Favicon PNG** : Version moderne du favicon

---

### Fichiers créés
- `public/site.webmanifest` - Manifest de l'application web
- `public/logo-192.png` - Logo copié pour le manifest

### Fichiers modifiés
- `index.html` - Ajout des balises favicon et manifest

---

### Balises HTML ajoutées

```html
<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="/kiltirbox-logo.png" />

<!-- Web App Manifest -->
<link rel="manifest" href="/site.webmanifest" />

<!-- Theme Color -->
<meta name="theme-color" content="#8B4513" />

<!-- Favicon PNG (moderne) -->
<link rel="icon" type="image/png" href="/kiltirbox-logo.png" />
```

---

### Contenu du manifest

```json
{
  "name": "KiltirBox",
  "short_name": "KiltirBox",
  "description": "Box de produits réunionnais authentiques",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#8B4513",
  "icons": [
    {
      "src": "/kiltirbox-logo.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

### Important à savoir

**Délai d'indexation** : Google ne met pas à jour les favicons immédiatement. Cela peut prendre **plusieurs semaines** avant que votre logo apparaisse dans les résultats de recherche.

**Après publication** : Une fois le site publié, vous pouvez accélérer le processus en :
1. Allant sur [Google Search Console](https://search.google.com/search-console)
2. Utilisant l'outil "Inspection d'URL" sur votre page d'accueil
3. Demandant une réindexation

---

### Résumé des changements
| Élément | Avant | Après |
|---------|-------|-------|
| Favicon | .ico basique | Logo KiltirBox en PNG |
| Apple Touch Icon | Absent | Logo KiltirBox |
| Manifest | Absent | site.webmanifest configuré |
| Theme color | Absent | Marron (#8B4513) |
