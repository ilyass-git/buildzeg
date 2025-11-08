# 🛡️ Système de Protection et Build

Ce système permet de protéger et optimiser votre site web avant le déploiement.

## 📋 Fonctionnalités

✅ **Minification JavaScript** - Réduction de la taille des fichiers JS  
✅ **Obfuscation JavaScript** - Code rendu illisible mais fonctionnel  
✅ **Minification CSS** - Optimisation des styles  
✅ **Minification HTML** - Réduction de la taille des pages  
✅ **Protection anti-inspecteur** - Blocage des outils de développement  
✅ **Désactivation console** - Empêche l'utilisation de console.log  
✅ **Protection clic droit** - Empêche le menu contextuel  
✅ **Protection raccourcis clavier** - Bloque F12, Ctrl+Shift+I, etc.  
✅ **Protection des images** - Renommage avec noms obfusqués  
✅ **Protection hotlinking** - Empêche le vol d'images  
✅ **Fichier .htaccess** - Protection serveur Apache

## 🚀 Installation

1. Installez Node.js (version 14 ou supérieure) depuis [nodejs.org](https://nodejs.org/)

2. Installez les dépendances :
```bash
npm install
```

## 🔨 Utilisation

Pour générer les fichiers de production protégés :

```bash
npm run build
```

Ou directement :
```bash
node build.js
```

## 📁 Structure après build

Le script crée un dossier `dist/` contenant :
- `dist/index.html` - HTML minifié avec protections
- `dist/services.html` - HTML minifié avec protections
- `dist/projets.html` - HTML minifié avec protections
- `dist/contact.html` - HTML minifié avec protections
- `dist/js/script.js` - JavaScript obfusqué et minifié
- `dist/css/style.css` - CSS minifié
- `dist/images/` - Images copiées
- Autres fichiers (favicon.ico, robots.txt, sitemap.xml)

## 📤 Déploiement

**IMPORTANT** : Déployez uniquement le contenu du dossier `dist/` sur votre serveur web.

Les fichiers originaux dans le dossier racine restent intacts pour vos modifications futures.

## 🔒 Protection des Images

Le système de build protège vos images de plusieurs façons :

1. **Renommage obfusqué** : Toutes les images sont renommées avec des noms aléatoires (ex: `logo.png` → `a3f8b2c1d4e5f6g7.png`)
2. **Remplacement automatique** : Toutes les références dans le HTML et CSS sont automatiquement mises à jour
3. **Protection hotlinking** : Le fichier `.htaccess` empêche le vol d'images depuis d'autres sites
4. **Headers de sécurité** : Protection contre certains types d'attaques

**Note importante** : Les images doivent être téléchargées par le navigateur pour être affichées, donc elles restent techniquement accessibles. Cependant, avec les noms obfusqués et les protections, il est beaucoup plus difficile de les trouver et de les télécharger.

## ⚠️ Limitations

- Les protections peuvent être contournées par des utilisateurs expérimentés
- Le code HTML/CSS/JS côté client reste techniquement accessible
- Les images peuvent toujours être téléchargées une fois affichées dans le navigateur
- Pour une vraie sécurité, utilisez un backend avec authentification et watermarking

## 🔄 Workflow recommandé

1. Modifiez vos fichiers originaux (HTML, CSS, JS)
2. Testez localement
3. Exécutez `npm run build`
4. Testez les fichiers dans `dist/`
5. Déployez le contenu de `dist/` sur votre serveur

## 📝 Notes

- Les fichiers originaux ne sont jamais modifiés
- Vous pouvez exécuter le build autant de fois que nécessaire
- Le dossier `dist/` est recréé à chaque build

