const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { minify } = require('terser');
const cssnano = require('cssnano');
const postcss = require('postcss');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { minify: htmlMinify } = require('html-minifier');

// Configuration pour la minification HTML
const htmlMinifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeEmptyElements: false
};

// Code de protection anti-inspecteur (obfusqué)
const protectionScript = `(function(){'use strict';const _0x=['keyCode','preventDefault','F12','ctrlKey','shiftKey','key','I','U','S','contextmenu','selectstart','copy','cut','paste','devtools','__REACT_DEVTOOLS_GLOBAL_HOOK__','__VUE_DEVTOOLS_GLOBAL_HOOK__','toString','constructor','debugger','setInterval','clearInterval','log','warn','error','info','trace','dir','dirxml','group','groupEnd','time','timeEnd','profile','profileEnd','count','clear','assert','table'];const _1x=function(_2x,_3x){_2x=_2x-0x0;let _4x=_0x[_2x];return _4x;};function _5x(_6x,_7x){const _8x=_1x;return _5x=function(_2x,_3x){_2x=_2x-0x0;let _4x=_0x[_2x];return _4x;},_5x(_6x,_7x);}(function(_2x,_3x){const _4x=_5x;while(!![]){try{const _6x=-parseInt(_4x(0x0))+parseInt(_4x(0x1))+parseInt(_4x(0x2));if(_6x===_3x)break;else _2x['push'](_2x['shift']());}catch(_7x){_2x['push'](_2x['shift']());}}}(_0x,0x3e8));document['addEventListener']('keydown',function(_2x){const _3x=_5x;if(_2x[_3x(0x3)]===0x73&&_2x[_3x(0x4)]&&_2x[_3x(0x5)]||_2x[_3x(0x3)]===0x75&&_2x[_3x(0x4)]&&_2x[_3x(0x5)]||_2x[_3x(0x3)]===0x73&&_2x['ctrlKey']&&_2x['shiftKey']||_2x[_3x(0x3)]===0x75&&_2x['ctrlKey']&&_2x['shiftKey']||_2x['key']===_3x(0x6)&&_2x['ctrlKey']&&_2x['shiftKey']||_2x[_3x(0x3)]===0x75&&_2x['ctrlKey']||_2x[_3x(0x3)]===0x73&&_2x['ctrlKey']||_2x[_3x(0x3)]===0x46||_2x[_3x(0x3)]===0x12){_2x[_3x(0x7)]();return![];}});document['addEventListener'](_5x(0x8),function(_2x){const _3x=_5x;_2x[_3x(0x7)]();return![];});document['addEventListener'](_5x(0x9),function(_2x){const _3x=_5x;_2x[_3x(0x7)]();return![];});document['addEventListener'](_5x(0xa),function(_2x){const _3x=_5x;_2x[_3x(0x7)]();return![];});document['addEventListener'](_5x(0xb),function(_2x){const _3x=_5x;_2x[_3x(0x7)]();return![];});document['addEventListener'](_5x(0xc),function(_2x){const _3x=_5x;_2x[_3x(0x7)]();return![];});setInterval(function(){const _2x=_5x;if(window[_2x(0xd)]||window[_2x(0xe)]||window[_2x(0xf)]){window['location']['href']='about:blank';}},0x3e8);const _6x=function(){};const _7x=_5x;const _8x=['log','warn','error','info','trace','dir','dirxml','group','groupEnd','time','timeEnd','profile','profileEnd','count','clear','assert','table'];for(let _2x=0x0;_2x<_8x['length'];_2x++){const _3x=_8x[_2x];console[_3x]=_6x;}})();`;

// Fonction pour minifier le JavaScript
async function minifyJS(inputPath, outputPath) {
    try {
        const code = fs.readFileSync(inputPath, 'utf8');
        
        // Obfusquer le code
        const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: true,
            debugProtectionInterval: 2000,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayEncoding: ['base64'],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 2,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 4,
            stringArrayWrappersType: 'function',
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
        });

        // Minifier le code obfusqué
        const minified = await minify(obfuscationResult.getObfuscatedCode(), {
            compress: {
                drop_console: false,
                drop_debugger: true,
                passes: 3
            },
            mangle: {
                toplevel: true
            },
            format: {
                comments: false
            }
        });

        // Ajouter le script de protection au début
        const finalCode = protectionScript + '\n' + minified.code;
        
        fs.writeFileSync(outputPath, finalCode, 'utf8');
        console.log(`✓ JavaScript minifié et obfusqué: ${outputPath}`);
    } catch (error) {
        console.error(`Erreur lors de la minification JS: ${error.message}`);
    }
}

// Fonction pour minifier le CSS
async function minifyCSS(inputPath, outputPath, imageMap) {
    try {
        let css = fs.readFileSync(inputPath, 'utf8');
        
        // Remplacer les références d'images dans le CSS
        css = replaceImageReferencesInCSS(css, imageMap);
        
        const result = await postcss([cssnano({
            preset: ['default', {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                minifyFontValues: true,
                minifySelectors: true,
                reduceIdents: true,
                zindex: false
            }]
        })]).process(css, { from: inputPath, to: outputPath });
        
        fs.writeFileSync(outputPath, result.css, 'utf8');
        console.log(`✓ CSS minifié: ${outputPath}`);
    } catch (error) {
        console.error(`Erreur lors de la minification CSS: ${error.message}`);
    }
}

// Fonction pour générer un nom de fichier obfusqué
function generateObfuscatedName(originalName) {
    const ext = path.extname(originalName);
    const hash = crypto.createHash('md5').update(originalName + Date.now() + Math.random()).digest('hex').substring(0, 16);
    return hash + ext;
}

// Fonction pour remplacer les références d'images dans le HTML
function replaceImageReferences(html, imageMap) {
    // Remplacer les src="images/..."
    for (const [original, obfuscated] of Object.entries(imageMap)) {
        const regex = new RegExp(`images/${original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
        html = html.replace(regex, `images/${obfuscated}`);
    }
    return html;
}

// Fonction pour créer le script de chargement d'images
function createImageLoaderScript(imageMap) {
    // Créer un mapping inversé pour le chargement
    const reverseMap = {};
    for (const [original, obfuscated] of Object.entries(imageMap)) {
        reverseMap[obfuscated] = original;
    }
    
    // Script pour charger les images dynamiquement et restaurer les noms originaux dans les attributs alt
    const loaderCode = `
(function() {
    'use strict';
    const _imgMap = ${JSON.stringify(reverseMap)};
    const _loadImages = function() {
        const _imgs = document.querySelectorAll('img[src^="images/"]');
        _imgs.forEach(function(_img) {
            const _src = _img.getAttribute('src');
            const _filename = _src.split('/').pop();
            if (_imgMap[_filename]) {
                _img.setAttribute('data-original', _imgMap[_filename]);
            }
        });
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _loadImages);
    } else {
        _loadImages();
    }
})();
`;
    return loaderCode;
}

// Fonction pour remplacer les références d'images dans le CSS
function replaceImageReferencesInCSS(css, imageMap) {
    for (const [original, obfuscated] of Object.entries(imageMap)) {
        const regex = new RegExp(`images/${original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
        css = css.replace(regex, `images/${obfuscated}`);
    }
    return css;
}

// Fonction pour minifier le HTML
async function minifyHTML(inputPath, outputPath, imageMap) {
    try {
        let html = fs.readFileSync(inputPath, 'utf8');
        
        // Remplacer les références d'images
        html = replaceImageReferences(html, imageMap);
        
        // Ajouter le script de protection dans le <head>
        const protectionScriptTag = `<script>${protectionScript}</script>`;
        html = html.replace('</head>', protectionScriptTag + '\n</head>');
        
        // Minifier le HTML
        const minified = htmlMinify(html, htmlMinifyOptions);
        
        fs.writeFileSync(outputPath, minified, 'utf8');
        console.log(`✓ HTML minifié: ${outputPath}`);
    } catch (error) {
        console.error(`Erreur lors de la minification HTML: ${error.message}`);
    }
}

// Fonction principale
async function build() {
    console.log('🚀 Démarrage du build...\n');
    
    // Créer le dossier dist s'il n'existe pas
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Créer les sous-dossiers
    const distJs = path.join(distDir, 'js');
    const distCss = path.join(distDir, 'css');
    const distImages = path.join(distDir, 'images');
    
    if (!fs.existsSync(distJs)) fs.mkdirSync(distJs, { recursive: true });
    if (!fs.existsSync(distCss)) fs.mkdirSync(distCss, { recursive: true });
    if (!fs.existsSync(distImages)) fs.mkdirSync(distImages, { recursive: true });
    
    // Traiter les images : renommer avec des noms obfusqués
    const imageMap = {}; // original -> obfuscated
    if (fs.existsSync('images')) {
        const images = fs.readdirSync('images');
        images.forEach(img => {
            const obfuscatedName = generateObfuscatedName(img);
            imageMap[img] = obfuscatedName;
            
            const src = path.join('images', img);
            const dest = path.join(distImages, obfuscatedName);
            fs.copyFileSync(src, dest);
        });
        console.log(`✓ Images renommées et copiées: ${images.length} fichiers`);
        console.log(`  (Noms originaux → Noms obfusqués)`);
    }
    
    // Minifier JavaScript
    await minifyJS('js/script.js', path.join(distJs, 'script.js'));
    
    // Minifier CSS avec remplacement des références d'images
    await minifyCSS('css/style.css', path.join(distCss, 'style.css'), imageMap);
    
    // Minifier tous les fichiers HTML avec remplacement des références d'images
    const htmlFiles = ['index.html', 'services.html', 'projets.html', 'contact.html'];
    for (const file of htmlFiles) {
        if (fs.existsSync(file)) {
            // Lire le fichier HTML
            let html = fs.readFileSync(file, 'utf8');
            
            // Mettre à jour les chemins vers les fichiers minifiés
            html = html.replace(/css\/style\.css\?v=\d+/g, 'css/style.css?v=' + Date.now());
            html = html.replace(/css\/style\.css/g, 'css/style.css?v=' + Date.now());
            
            // Écrire temporairement pour la minification
            const tempFile = path.join(__dirname, 'temp_' + file);
            fs.writeFileSync(tempFile, html, 'utf8');
            
            await minifyHTML(tempFile, path.join(distDir, file), imageMap);
            
            // Nettoyer le fichier temporaire
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        }
    }
    
    // Copier les autres fichiers nécessaires
    const otherFiles = ['favicon.ico', 'robots.txt', 'sitemap.xml'];
    otherFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, path.join(distDir, file));
            console.log(`✓ Fichier copié: ${file}`);
        }
    });
    
    // Créer un fichier .htaccess pour protéger les images (si serveur Apache)
    const htaccessContent = `# Protection des images BUILDZEG
# Désactiver l'affichage de la liste des fichiers
Options -Indexes

# Protection contre le hotlinking des images
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTP_REFERER} !^$
    RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?buildzeg\\.com [NC]
    RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?localhost [NC]
    RewriteRule \\.(jpg|jpeg|png|gif|webp|svg|ico)$ - [F,L]
</IfModule>

# Headers de sécurité pour les images
<IfModule mod_headers.c>
    <FilesMatch "\\.(jpg|jpeg|png|gif|webp|svg|ico)$">
        Header set X-Content-Type-Options "nosniff"
        Header set X-Frame-Options "DENY"
        Header set Cache-Control "private, max-age=31536000"
    </FilesMatch>
</IfModule>

# Empêcher l'accès aux fichiers sensibles
<FilesMatch "^\\.|package\\.json|build\\.js|BUILD_README\\.md|node_modules">
    <IfModule mod_authz_core.c>
        Require all denied
    </IfModule>
    <IfModule !mod_authz_core.c>
        Order allow,deny
        Deny from all
    </IfModule>
</FilesMatch>

# Protection contre l'énumération de fichiers
<FilesMatch "^\\.ht">
    <IfModule mod_authz_core.c>
        Require all denied
    </IfModule>
    <IfModule !mod_authz_core.c>
        Order allow,deny
        Deny from all
    </IfModule>
</FilesMatch>
`;
    
    fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent, 'utf8');
    console.log(`✓ Fichier .htaccess créé pour la protection des images`);
    
    console.log('\n✅ Build terminé avec succès!');
    console.log('📁 Les fichiers de production sont dans le dossier "dist/"');
    console.log('⚠️  Déployez le contenu du dossier "dist/" sur votre serveur');
    console.log('🔒 Les images ont été renommées avec des noms obfusqués');
    console.log('🛡️  Un fichier .htaccess a été créé pour protéger les images');
}

// Exécuter le build
build().catch(console.error);

