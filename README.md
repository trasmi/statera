# Statera — assistant de choix de test statistique

Application web (React, React Flow, Tailwind CSS v4, composants shadcn/ui, Framer Motion, Lucide) qui guide l'utilisateur
dans un arbre de décision et recommande l'un des 17 tests statistiques, avec une fiche détaillée
(conditions, hypothèses, exemples, code R, Python, SPSS et Jamovi, visuel typique).

Conçu par Tijani Rasmi, Université de Lille.
Arbre de décision d'après F. Guillemot, Nantes Université (2023), HAL hal-04292194 (licence CC BY-NC-ND 4.0).

## Démarrer
```bash
npm install
npm run dev        # serveur de développement
npm run build      # site statique dans dist/ (à déposer sur un serveur, GitHub Pages, etc.)
```

`npm run build:artifact` produit `dist/app.js` et `dist/app.css` (format IIFE) pour l'artefact Design de Claude.
