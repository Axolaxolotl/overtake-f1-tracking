# OverTake F1 Tracking 🏎️

## Structure
```
/              → Page de téléchargement (landing page)
/app/          → Application React complète
```

## Installation
```bash
npm install
npm run dev
```

## ⚙️ Configurer le lien APK

Dans `index.html`, remplace les 2 occurrences de `LIEN_APK_ICI` par ton lien Google Drive ou GitHub Releases.

### Option A — Google Drive
1. Upload le `.apk` sur Google Drive
2. Clic droit → Obtenir le lien → "Tout le monde avec le lien"
3. Change le lien : `https://drive.google.com/file/d/ID/view` → `https://drive.google.com/uc?export=download&id=ID`
4. Colle ce lien à la place de `LIEN_APK_ICI`

### Option B — GitHub Releases
1. GitHub → ton repo → Releases → Create new release
2. Attache le fichier `.apk`
3. Publie → copie le lien direct du `.apk`
4. Colle ce lien à la place de `LIEN_APK_ICI`

## Déployer sur Vercel
```bash
git add .
git commit -m "Ajout landing page"
git push
```
Vercel redéploie automatiquement ✅
