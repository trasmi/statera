# Statera — repères pour Claude Code

- `src/data/tree.js` : l'arbre de décision (nœuds `question` et `leaf`). Chaque question a `options[{id,label,short,desc,icon,next,excludes}]`,
  `why` et `concept` (mode Enseignement), `help` (bouton « Je ne connais pas la réponse »). Les utilitaires `reachableTests`, `minDepth`, `maxDepth` sont en bas.
- `src/data/tests.js` : les 17 fiches (`TESTS`), codes R / Python / SPSS / Jamovi (version française des menus), noms courts `SHORT`, regroupements `GROUPS`.
- `src/components/` : `QuestionCard` (question), `HistoryColumn` + `PathFlow` (historique et schéma React Flow), `ResultColumn` (résultat provisoire),
  `Fiche` (fiche finale), `Viz` (illustrations SVG), `Header`, `ui/` (composants shadcn écrits à la main).
- `src/index.css` : thème (variables clair/sombre : bleu nuit, violet, turquoise).
- Modes Enseignement et Expert : états dans `App.jsx`, passés aux composants.
- Pour tester tous les parcours : chaque feuille doit être atteignable (18 chemins pour 17 tests ; l'Anova multifactorielle a deux feuilles).
- Les contenus statistiques (fiches, seuils, scripts) sont rédigés sans relecture experte : à vérifier avant diffusion.
