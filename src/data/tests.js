// Fiches détaillées des 17 tests recommandés

export const LEVELS = {
  debutant: { label: 'Débutant', dots: 1 },
  intermediaire: { label: 'Intermédiaire', dots: 2 },
  avance: { label: 'Avancé', dots: 3 },
}

export const TESTS = {
  // ─────────────────────────────────────────────── QUALITATIF
  khi2_ajustement: {
    id: 'khi2_ajustement',
    name: 'Khi² d’ajustement',
    alias: 'Test du χ² de conformité',
    family: 'param',
    level: 'debutant',
    group: 'Variable qualitative',
    objectif: 'Vérifier si la répartition observée d’une variable qualitative dans un échantillon correspond à une répartition théorique attendue.',
    quand: 'Vous avez une seule variable qualitative et vous voulez savoir si ses fréquences s’écartent d’une répartition de référence : équiprobabilité, proportions connues dans la population, loi théorique.',
    conditions: [
      'Une seule variable qualitative (au moins deux modalités).',
      'Observations indépendantes : chaque individu compte une seule fois.',
      'Effectifs théoriques suffisants : au moins 5 dans chaque modalité (à défaut, regrouper des modalités).',
      'Répartition de référence définie avant d’observer les données.',
    ],
    hypotheses: {
      h0: 'La répartition observée est conforme à la répartition théorique (les écarts sont dus au hasard).',
      h1: 'La répartition observée diffère de la répartition théorique.',
      notes: ['Statistique : χ² = Σ (observé − théorique)² / théorique, avec k − 1 degrés de liberté (k modalités).'],
    },
    avantages: ['Très simple à calculer et à interpréter.', 'Aucune hypothèse sur une loi de distribution continue.', 'S’applique à n’importe quel nombre de modalités.'],
    limites: ['Sensible aux petits effectifs théoriques.', 'Significatif dès que n est grand, même pour un écart minime : compléter par une taille d’effet.', 'Ne dit pas quelle modalité s’écarte (il faut examiner les résidus).'],
    interpretation: 'Si p < .05, on rejette H0 : la répartition observée diffère de celle attendue. Examinez les résidus standardisés (supérieurs à 2 en valeur absolue) pour savoir quelles modalités contribuent à l’écart. Rapportez χ²(ddl, N) = valeur, p = valeur, et la taille d’effet w de Cohen.',
    exemple: 'Un dé est lancé 120 fois. Obtient-on chaque face avec la même fréquence (20 fois par face), ou le dé est-il pipé ?',
    exemples: {
      psy: 'Dans une tâche de choix libre entre trois stimuli, les participants choisissent-ils chaque stimulus aussi souvent (un tiers chacun) ? Les effectifs observés sont 52, 31 et 37.',
      edu: 'Les 90 étudiants d’une promotion se répartissent-ils également entre trois créneaux d’examen proposés, ou existe-t-il un créneau préféré ?',
      sante: 'La répartition des groupes sanguins dans un échantillon de donneurs correspond-elle aux proportions connues dans la population générale (O 44 %, A 45 %, B 8 %, AB 3 %) ?',
    },
    code: {
      r: `# Effectifs observés par modalité
observes <- c(52, 31, 37)
# Proportions théoriques (somme = 1)
theoriques <- c(1/3, 1/3, 1/3)

res <- chisq.test(x = observes, p = theoriques)
res
res$expected      # effectifs théoriques (doivent être >= 5)
res$stdres        # résidus standardisés

# Taille d'effet w de Cohen
sqrt(res$statistic / sum(observes))`,
      py: `import numpy as np
from scipy.stats import chisquare

observes = np.array([52, 31, 37])
attendus = np.array([1/3, 1/3, 1/3]) * observes.sum()

chi2, p = chisquare(f_obs=observes, f_exp=attendus)
print(f"chi2 = {chi2:.2f}, p = {p:.4f}")

# Résidus standardisés et taille d'effet w de Cohen
residus = (observes - attendus) / np.sqrt(attendus)
w = np.sqrt(chi2 / observes.sum())
print(residus, w)`,
      spss: `* Pondérer les modalités par leurs effectifs (si données agrégées).
WEIGHT BY effectif.

* Khi² d'ajustement avec répartition attendue égale.
NPAR TESTS
  /CHISQUARE=choix
  /EXPECTED=EQUAL
  /MISSING ANALYSIS.

* Avec proportions attendues spécifiques (ex. 40 / 30 / 30).
NPAR TESTS
  /CHISQUARE=choix
  /EXPECTED=40 30 30.`,
    },
    viz: { kind: 'bars', caption: 'Diagramme en barres : effectifs observés comparés aux effectifs attendus (ligne en pointillés).' },
    expert: {
      params: ['Pas de paramètre de moyenne : test sur des fréquences, sous la loi du χ² pour des effectifs théoriques ≥ 5.'],
      equiv: null,
      alternatives: ['Test exact multinomial ou test binomial exact si les effectifs sont faibles.', 'Test G (rapport de vraisemblance) : équivalent asymptotique.'],
      effet: 'w de Cohen (petit .10, moyen .30, grand .50).',
      posthoc: 'Résidus standardisés ajustés, avec correction de Bonferroni.',
    },
  },

  khi2_independance: {
    id: 'khi2_independance',
    name: 'Khi² d’indépendance',
    alias: 'Test du χ² d’association',
    family: 'param',
    level: 'debutant',
    group: 'Deux variables qualitatives',
    objectif: 'Tester s’il existe un lien (une association) entre deux variables qualitatives mesurées sur les mêmes individus.',
    quand: 'Vous croisez deux variables catégorielles dans un tableau de contingence et voulez savoir si la répartition de l’une dépend de l’autre.',
    conditions: [
      'Deux variables qualitatives, chacune avec deux modalités ou plus.',
      'Observations indépendantes : chaque individu apparaît dans une seule case du tableau.',
      'Effectifs théoriques ≥ 5 dans au moins 80 % des cases, et aucun inférieur à 1 (sinon test exact de Fisher).',
    ],
    hypotheses: {
      h0: 'Les deux variables sont indépendantes : la répartition de l’une est la même quelle que soit la modalité de l’autre.',
      h1: 'Les deux variables sont liées (associées).',
      notes: ['ddl = (lignes − 1) × (colonnes − 1).', 'Effectif théorique d’une case = total de la ligne × total de la colonne / N.'],
    },
    avantages: ['Aucune exigence de normalité.', 'Fonctionne avec des variables à plusieurs modalités.', 'Facile à compléter par une mesure d’association (V de Cramér).'],
    limites: ['Indique l’existence d’un lien mais pas sa direction ni sa force (utiliser V de Cramér).', 'Inadapté aux mesures répétées (voir McNemar).', 'Trop sensible aux grands échantillons.'],
    interpretation: 'Si p < .05, on rejette l’indépendance : les variables sont associées. Précisez la force avec le V de Cramér (.10 faible, .30 moyen, .50 fort pour un tableau 2 × 2) et repérez les cases responsables grâce aux résidus ajustés (|z| > 2). Rapportez χ²(ddl, N) = valeur, p, V.',
    exemple: 'Les fumeurs et les non-fumeurs se répartissent-ils de la même façon entre trois catégories professionnelles ?',
    exemples: {
      psy: 'Le style d’attachement (sécure, anxieux, évitant) est-il lié au fait d’avoir déjà consulté un psychologue (oui/non) ?',
      edu: 'La filière choisie en licence (lettres, sciences, droit) dépend-elle du genre des étudiants ?',
      sante: 'La survenue d’une complication post-opératoire (oui/non) est-elle liée à la technique chirurgicale employée (coelioscopie ou laparotomie) ?',
    },
    code: {
      r: `# Tableau de contingence
tab <- table(df$genre, df$filiere)
tab

res <- chisq.test(tab)
res
res$expected         # vérifier les effectifs théoriques
res$stdres           # résidus standardisés

# Si effectifs trop faibles : test exact de Fisher
# fisher.test(tab)

# Force de l'association : V de Cramér
library(rcompanion)
cramerV(tab)`,
      py: `import pandas as pd
from scipy.stats import chi2_contingency
from scipy.stats.contingency import association

tab = pd.crosstab(df["genre"], df["filiere"])
chi2, p, ddl, attendus = chi2_contingency(tab)
print(f"chi2({ddl}) = {chi2:.2f}, p = {p:.4f}")
print(pd.DataFrame(attendus, index=tab.index, columns=tab.columns))

# V de Cramér
v = association(tab, method="cramer")
print(f"V de Cramér = {v:.2f}")`,
      spss: `CROSSTABS
  /TABLES=genre BY filiere
  /FORMAT=AVALUE TABLES
  /STATISTICS=CHISQ PHI
  /CELLS=COUNT EXPECTED ROW ASRESID
  /COUNT ROUND CELL.`,
    },
    viz: { kind: 'grouped', caption: 'Barres groupées (ou diagramme en mosaïque) : proportions de chaque modalité selon l’autre variable.' },
    expert: {
      params: ['Approximation asymptotique par la loi du χ² : exige des effectifs théoriques suffisants.'],
      equiv: null,
      alternatives: ['Test exact de Fisher (petits effectifs, tableau 2 × 2).', 'Test G, ou régression logistique pour contrôler d’autres variables.'],
      effet: 'V de Cramér ; phi pour un tableau 2 × 2 ; rapport de cotes (odds ratio).',
      posthoc: 'Résidus ajustés par case avec correction de Bonferroni.',
    },
  },

  mcnemar: {
    id: 'mcnemar',
    name: 'Test de McNemar',
    alias: 'Khi² de McNemar',
    family: 'param',
    level: 'intermediaire',
    group: 'Variable qualitative, mesures répétées',
    objectif: 'Tester si la proportion d’une réponse binaire a changé entre deux mesures effectuées sur les mêmes individus.',
    quand: 'Une même variable à deux modalités (oui/non, réussite/échec) est mesurée deux fois sur les mêmes personnes, par exemple avant et après une intervention.',
    conditions: [
      'Variable dichotomique mesurée deux fois sur les mêmes individus (données appariées).',
      'Individus indépendants entre eux.',
      'Au moins 25 paires discordantes pour la version asymptotique (sinon version exacte).',
    ],
    hypotheses: {
      h0: 'La probabilité de passer de oui à non est égale à la probabilité de passer de non à oui (les deux marges sont égales).',
      h1: 'Les deux types de changement n’ont pas la même probabilité : la proportion a évolué entre les deux mesures.',
      notes: ['Seules comptent les paires discordantes (celles qui changent). Statistique : (b − c)² / (b + c), avec 1 ddl.'],
    },
    avantages: ['Adapté aux avant/après sur variable binaire.', 'Utilise la structure appariée (plus puissant que le khi² d’indépendance).', 'Version exacte disponible pour petits effectifs.'],
    limites: ['Limité aux variables à deux modalités (sinon test de Stuart-Maxwell).', 'Ignore les personnes dont la réponse ne change pas.', 'Ne mesure que deux moments (sinon Q de Cochran).'],
    interpretation: 'Si p < .05, la proportion de réponses a significativement changé entre les deux mesures. Regardez dans quel sens (b > c ou b < c) pour conclure à une augmentation ou une diminution. Rapportez χ²(1) = valeur, p, et le rapport de cotes b/c.',
    exemple: 'Sur 100 personnes, combien changent d’avis sur une question oui/non après avoir regardé une vidéo d’information ? La balance des changements est-elle équilibrée ?',
    exemples: {
      psy: 'Avant et après une thérapie d’exposition, 80 patients indiquent s’ils évitent (oui) ou non une situation anxiogène. La proportion d’évitement a-t-elle changé ?',
      edu: 'Les mêmes 60 étudiants répondent « capable de réaliser un diaporama (oui/non) » avant puis après une formation. La proportion de oui a-t-elle augmenté ?',
      sante: 'Sur 50 patients, la présence d’un symptôme (oui/non) est notée avant et après un traitement. Le traitement modifie-t-il la présence du symptôme ?',
    },
    code: {
      r: `# Tableau 2 x 2 (mesure 1 en lignes, mesure 2 en colonnes)
tab <- table(avant = df$avant, apres = df$apres)
tab

mcnemar.test(tab)                 # avec correction de continuité
# mcnemar.test(tab, correct = FALSE)

# Version exacte (petits effectifs)
library(exact2x2)
mcnemar.exact(tab)`,
      py: `import pandas as pd
from statsmodels.stats.contingency_tables import mcnemar

tab = pd.crosstab(df["avant"], df["apres"])
res = mcnemar(tab, exact=False, correction=True)
print(f"chi2 = {res.statistic:.2f}, p = {res.pvalue:.4f}")

# Version exacte (binomiale)
res_exact = mcnemar(tab, exact=True)
print(res_exact.pvalue)`,
      spss: `CROSSTABS
  /TABLES=avant BY apres
  /FORMAT=AVALUE TABLES
  /STATISTICS=MCNEMAR
  /CELLS=COUNT ROW
  /COUNT ROUND CELL.`,
    },
    viz: { kind: 'table2', caption: 'Tableau 2 × 2 « avant / après » : les cases hors diagonale (changements) sont celles qui portent le test.' },
    expert: {
      params: ['Sous H0, b suit une loi binomiale B(b + c, ½) ; approximation par un χ² à 1 ddl quand b + c ≥ 25.'],
      equiv: null,
      alternatives: ['Q de Cochran (plus de deux mesures binaires).', 'Test de Stuart-Maxwell (variable à plus de deux modalités).', 'Régression logistique à effets mixtes pour des plans plus complexes.'],
      effet: 'Rapport de cotes apparié b / c ; différence de proportions avec intervalle de confiance.',
      posthoc: 'Sans objet pour deux mesures.',
    },
  },

  regression_logistique: {
    id: 'regression_logistique',
    name: 'Régression logistique',
    alias: 'Modèle logit',
    family: 'param',
    level: 'avance',
    group: 'Variable qualitative, prédicteurs',
    objectif: 'Modéliser la probabilité d’appartenir à une catégorie (le plus souvent un résultat binaire) en fonction d’un ou plusieurs prédicteurs.',
    quand: 'Votre VD est binaire (réussite/échec, malade/sain) et vous voulez estimer l’effet de prédicteurs, quantitatifs ou qualitatifs, ou prédire la probabilité de l’événement.',
    conditions: [
      'VD dichotomique (régression logistique binaire) ; pour plus de deux modalités : version multinomiale ou ordinale.',
      'Observations indépendantes.',
      'Relation linéaire entre les prédicteurs quantitatifs et le logit de la VD.',
      'Absence de colinéarité forte entre prédicteurs ; absence de valeurs très influentes.',
      'Effectif suffisant : environ 10 événements par prédicteur.',
    ],
    hypotheses: {
      h0: 'Pour chaque prédicteur, le coefficient est nul (rapport de cotes = 1) : le prédicteur n’influence pas la probabilité de l’événement.',
      h1: 'Le coefficient est différent de zéro (rapport de cotes ≠ 1).',
      notes: ['Modèle : logit(p) = ln(p / (1 − p)) = b0 + b1·X1 + b2·X2 + …', 'Test de chaque coefficient (Wald) et du modèle global (rapport de vraisemblance).'],
    },
    avantages: ['Aucune exigence de normalité des résidus.', 'Combine prédicteurs quantitatifs et qualitatifs.', 'Les rapports de cotes sont interprétables et très utilisés en santé.'],
    limites: ['Interprétation des rapports de cotes moins intuitive que les moyennes.', 'Sensible à la séparation parfaite et aux petits effectifs.', 'Exige une bonne spécification du modèle.'],
    interpretation: 'Pour chaque prédicteur, exponentiez le coefficient pour obtenir le rapport de cotes (OR). OR > 1 : le prédicteur augmente la probabilité de l’événement ; OR < 1 : il la diminue ; l’intervalle de confiance ne doit pas contenir 1. Évaluez l’ajustement (test de Hosmer-Lemeshow, pseudo-R² de Nagelkerke) et la qualité de classement (aire sous la courbe ROC).',
    exemple: 'Prédire la probabilité de réussir un examen selon le nombre d’heures de révision et le fait d’avoir assisté ou non aux cours.',
    exemples: {
      psy: 'Prédire la probabilité de rechute (oui/non) à six mois à partir du score d’anxiété initial, de l’âge et du suivi d’une thérapie.',
      edu: 'Prédire le décrochage universitaire (oui/non) à partir de la moyenne de bac, du statut boursier et du temps de transport.',
      sante: 'Estimer l’effet de l’âge, du tabagisme et de l’indice de masse corporelle sur la probabilité d’un événement cardiovasculaire.',
    },
    code: {
      r: `# VD codée 0/1 (ou facteur à 2 niveaux)
modele <- glm(reussite ~ heures + presence,
              data = df, family = binomial)
summary(modele)

# Rapports de cotes et intervalles de confiance à 95 %
exp(cbind(OR = coef(modele), confint(modele)))

# Qualité de l'ajustement et pouvoir prédictif
library(pROC)
auc(roc(df$reussite, fitted(modele)))`,
      py: `import numpy as np
import statsmodels.formula.api as smf

modele = smf.logit("reussite ~ heures + C(presence)", data=df).fit()
print(modele.summary())

# Rapports de cotes et IC 95 %
or_ = np.exp(modele.params)
ic = np.exp(modele.conf_int())
print(or_, ic)

# Pouvoir prédictif (aire sous la courbe ROC)
from sklearn.metrics import roc_auc_score
print(roc_auc_score(df["reussite"], modele.predict(df)))`,
      spss: `LOGISTIC REGRESSION VARIABLES reussite
  /METHOD=ENTER heures presence
  /CATEGORICAL=presence
  /PRINT=GOODFIT CI(95)
  /CRITERIA=PIN(.05) POUT(.10) ITERATE(20) CUT(.5).`,
    },
    viz: { kind: 'sigmoid', caption: 'Courbe en S : probabilité prédite de l’événement en fonction du prédicteur, entre 0 et 1.' },
    expert: {
      params: ['Estimation par maximum de vraisemblance ; linéarité du logit ; indépendance des observations ; pas de colinéarité.'],
      equiv: null,
      alternatives: ['Régression multinomiale ou ordinale (VD à plus de deux modalités).', 'Régression de Firth (petits effectifs ou séparation).', 'Modèles mixtes (données groupées ou répétées).'],
      effet: 'Rapport de cotes (OR) ; pseudo-R² de Nagelkerke ; AUC.',
      posthoc: 'Comparaison de modèles emboîtés par rapport de vraisemblance.',
    },
  },

  // ─────────────────────────────────────────────── DIFFÉRENCES, 2 GROUPES
  student_ind: {
    id: 'student_ind',
    name: 'Test t de Student pour échantillons indépendants',
    alias: 'Student indépendant / Welch',
    family: 'param',
    level: 'debutant',
    group: 'Comparaison de deux groupes indépendants',
    objectif: 'Comparer les moyennes d’une variable quantitative entre deux groupes indépendants.',
    quand: 'Votre VD est quantitative, vous avez deux groupes de personnes différentes, et les conditions paramétriques sont raisonnablement remplies.',
    conditions: [
      'VD quantitative (intervalle ou rapport).',
      'Deux groupes indépendants (chaque personne dans un seul groupe).',
      'Distribution à peu près normale dans chaque groupe (ou n ≥ 30 par groupe).',
      'Homogénéité des variances (sinon utiliser la correction de Welch, appliquée par défaut dans R).',
    ],
    hypotheses: {
      h0: 'Les moyennes des deux populations sont égales : μ1 = μ2.',
      h1: 'Les moyennes sont différentes (test bilatéral) : μ1 ≠ μ2. Une hypothèse unilatérale (μ1 > μ2) est possible si elle est posée à l’avance.',
      notes: ['Normalité : Shapiro-Wilk ou Q-Q plot.', 'Variances égales : test de Levene.'],
    },
    avantages: ['Test le plus connu et le plus puissant pour deux groupes sous normalité.', 'Taille d’effet (d de Cohen) simple à interpréter.', 'Robuste à de légers écarts à la normalité si les effectifs sont équilibrés.'],
    limites: ['Sensible aux valeurs extrêmes.', 'Limité à deux groupes (sinon Anova).', 'Peu fiable avec de très petits effectifs asymétriques.'],
    interpretation: 'Si p < .05, la différence de moyennes est statistiquement significative. Ne vous arrêtez pas à p : rapportez la différence de moyennes avec son intervalle de confiance à 95 % et le d de Cohen (.20 petit, .50 moyen, .80 grand). Format : t(ddl) = valeur, p = valeur, d = valeur.',
    exemple: 'Les étudiants ayant suivi le cours en ligne obtiennent-ils en moyenne la même note que ceux ayant suivi le cours en présentiel ?',
    exemples: {
      psy: 'Le score d’anxiété (échelle de 0 à 80) est-il différent entre un groupe de participants ayant pratiqué la méditation et un groupe contrôle ?',
      edu: 'Les élèves enseignés par apprentissage coopératif obtiennent-ils de meilleurs résultats que ceux enseignés de façon magistrale (deux classes différentes) ?',
      sante: 'La pression artérielle systolique moyenne diffère-t-elle entre des patients sous traitement et des patients sous placebo ?',
    },
    code: {
      r: `# Vérifications préalables
shapiro.test(df$score[df$groupe == "A"])
shapiro.test(df$score[df$groupe == "B"])
car::leveneTest(score ~ groupe, data = df)

# Test t (Welch par défaut ; var.equal = TRUE pour Student classique)
t.test(score ~ groupe, data = df)

# Taille d'effet d de Cohen
library(effectsize)
cohens_d(score ~ groupe, data = df)`,
      py: `import pingouin as pg
from scipy import stats

a = df.loc[df.groupe == "A", "score"]
b = df.loc[df.groupe == "B", "score"]

# Vérifications préalables
print(stats.shapiro(a), stats.shapiro(b))
print(stats.levene(a, b))

# Test t avec correction automatique (Welch si variances inégales)
res = pg.ttest(a, b, paired=False, correction="auto")
print(res)       # T, ddl, p-val, IC95 %, d de Cohen

# Variante SciPy
print(stats.ttest_ind(a, b, equal_var=False))`,
      spss: `* Test t pour échantillons indépendants (inclut le test de Levene).
T-TEST GROUPS=groupe(1 2)
  /MISSING=ANALYSIS
  /VARIABLES=score
  /ES DISPLAY(TRUE)
  /CRITERIA=CI(.95).

* Normalité par groupe.
EXAMINE VARIABLES=score BY groupe
  /PLOT NPPLOT
  /STATISTICS DESCRIPTIVES.`,
    },
    viz: { kind: 'box2', caption: 'Boîtes à moustaches (ou barres de moyennes avec intervalles de confiance) pour les deux groupes.' },
    expert: {
      params: ['Normalité de la VD dans chaque groupe (ou du théorème central limite si n élevé).', 'Homogénéité des variances (ou correction de Welch).', 'Indépendance des observations.', 'Échelle d’intervalle ou de rapport.'],
      equiv: 'mann_whitney',
      alternatives: ['Test de Welch (variances inégales), par défaut recommandé.', 'Test par permutation ou bootstrap.', 'Test t sur données transformées (log) si asymétrie.'],
      effet: 'd de Cohen ou g de Hedges.',
      posthoc: 'Sans objet pour deux groupes.',
    },
  },

  mann_whitney: {
    id: 'mann_whitney',
    name: 'Test de Mann-Whitney',
    alias: 'U de Mann-Whitney / Wilcoxon-Mann-Whitney',
    family: 'nonparam',
    level: 'intermediaire',
    group: 'Comparaison de deux groupes indépendants',
    objectif: 'Comparer deux groupes indépendants sur une variable ordinale ou quantitative sans supposer la normalité, en comparant les rangs.',
    quand: 'Deux groupes de personnes différentes, une VD ordinale ou quantitative non normale (asymétrique, valeurs extrêmes, petits effectifs).',
    conditions: [
      'VD au moins ordinale.',
      'Deux groupes indépendants.',
      'Observations indépendantes.',
      'Pour interpréter le test comme une comparaison de médianes : distributions de forme similaire dans les deux groupes.',
    ],
    hypotheses: {
      h0: 'Les deux groupes proviennent de la même distribution : la probabilité qu’une valeur du groupe 1 dépasse une valeur du groupe 2 est égale à ½.',
      h1: 'Les valeurs d’un groupe tendent à être plus élevées que celles de l’autre (décalage des distributions).',
      notes: ['Statistique U : nombre de fois où une valeur d’un groupe dépasse une valeur de l’autre.'],
    },
    avantages: ['Aucune hypothèse de normalité.', 'Robuste aux valeurs extrêmes.', 'Utilisable avec des données ordinales et de petits échantillons.'],
    limites: ['Un peu moins puissant que Student si la normalité est vérifiée.', 'Ne compare pas strictement les moyennes ni toujours les médianes.', 'Nombreux ex æquo : nécessite une correction.'],
    interpretation: 'Si p < .05, les valeurs de l’un des groupes sont systématiquement plus élevées que celles de l’autre. Rapportez U, p, les médianes de chaque groupe et une taille d’effet (r = Z / √N, ou probabilité de supériorité). Format : U = valeur, p = valeur, r = valeur.',
    exemple: 'Deux jurys notent la satisfaction de candidats sur une échelle de 1 à 5. Un groupe a-t-il des scores globalement plus élevés ?',
    exemples: {
      psy: 'Comparer le niveau de stress déclaré (échelle ordinale en 5 points) entre des participants de deux conditions expérimentales.',
      edu: 'Comparer le nombre d’erreurs d’orthographe (distribution très asymétrique) entre deux classes de CM2.',
      sante: 'Comparer l’intensité de la douleur (échelle visuelle de 0 à 10) entre deux traitements chez des patients différents.',
    },
    code: {
      r: `# Comparaison de deux groupes indépendants sur les rangs
wilcox.test(score ~ groupe, data = df, exact = FALSE, conf.int = TRUE)

# Médianes par groupe
aggregate(score ~ groupe, data = df, FUN = median)

# Taille d'effet r
library(rstatix)
wilcox_effsize(df, score ~ groupe)`,
      py: `import pingouin as pg
from scipy.stats import mannwhitneyu

a = df.loc[df.groupe == "A", "score"]
b = df.loc[df.groupe == "B", "score"]

u, p = mannwhitneyu(a, b, alternative="two-sided")
print(f"U = {u:.1f}, p = {p:.4f}")

# Version Pingouin avec taille d'effet (CLES, rang biserial)
print(pg.mwu(a, b, alternative="two-sided"))`,
      spss: `NPAR TESTS
  /M-W= score BY groupe(1 2)
  /MISSING ANALYSIS.

* Médianes par groupe.
MEANS TABLES=score BY groupe
  /CELLS=MEDIAN COUNT.`,
    },
    viz: { kind: 'strip2', caption: 'Nuages de points alignés (strip plot) avec les médianes : on voit le décalage des rangs entre les groupes.' },
    expert: {
      params: ['Pas d’hypothèse de normalité. Hypothèse de forme comparable des distributions pour interpréter en termes de médianes.'],
      equiv: 'student_ind',
      alternatives: ['Test de permutation.', 'Test de Brunner-Munzel (si dispersions inégales).', 'Test t après transformation si les données le permettent.'],
      effet: 'r = Z/√N, rang-bisérial, probabilité de supériorité (CLES).',
      posthoc: 'Sans objet pour deux groupes.',
    },
  },

  student_app: {
    id: 'student_app',
    name: 'Test t de Student pour échantillons appariés',
    alias: 'Student apparié / pour mesures répétées',
    family: 'param',
    level: 'debutant',
    group: 'Comparaison de deux mesures appariées',
    objectif: 'Comparer deux mesures quantitatives réalisées sur les mêmes individus (ou sur des paires), en testant si la moyenne des différences est nulle.',
    quand: 'Un plan avant/après, ou deux conditions passées par les mêmes personnes, avec une VD quantitative dont les différences sont à peu près normales.',
    conditions: [
      'VD quantitative mesurée deux fois sur les mêmes individus (ou paires liées).',
      'Les différences individuelles suivent à peu près une loi normale.',
      'Individus indépendants les uns des autres.',
      'Pas de valeurs très extrêmes parmi les différences.',
    ],
    hypotheses: {
      h0: 'La moyenne des différences entre les deux mesures est nulle : μ_d = 0.',
      h1: 'La moyenne des différences est non nulle : μ_d ≠ 0 (ou > 0 / < 0 si unilatéral).',
      notes: ['On travaille sur la variable d = mesure 2 − mesure 1 ; c’est elle qui doit être normale.'],
    },
    avantages: ['Chaque personne est son propre témoin : la variabilité entre individus disparaît.', 'Plus puissant que Student indépendant pour un même nombre de personnes.', 'Facile à rapporter (différence moyenne + IC).'],
    limites: ['Sensible aux effets d’ordre, d’apprentissage et de fatigue.', 'Limité à deux mesures (sinon Anova à mesures répétées).', 'Sensible aux différences extrêmes.'],
    interpretation: 'Si p < .05, la moyenne des deux mesures diffère significativement. Rapportez la différence moyenne et son IC à 95 %, le t, les ddl (n − 1), p, et le d de Cohen apparié (dz). Format : t(ddl) = valeur, p = valeur, d = valeur.',
    exemple: 'Le poids de 30 personnes est mesuré avant et après un régime. Le poids moyen a-t-il changé ?',
    exemples: {
      psy: 'Le score de dépression de 40 patients est mesuré avant et après huit séances de thérapie cognitivo-comportementale. Les scores ont-ils diminué ?',
      edu: 'Les étudiants passent un test de maîtrise du logiciel avant et après une formation. Le score moyen progresse-t-il ?',
      sante: 'La fréquence cardiaque de 25 sportifs est mesurée au repos puis après un effort de dix minutes.',
    },
    code: {
      r: `# Différences individuelles
diff <- df$apres - df$avant
shapiro.test(diff)

# Test t apparié
t.test(df$apres, df$avant, paired = TRUE)

# Taille d'effet
library(effectsize)
cohens_d(df$apres, df$avant, paired = TRUE)`,
      py: `import pingouin as pg
from scipy import stats

diff = df["apres"] - df["avant"]
print(stats.shapiro(diff))

# Test t apparié
print(stats.ttest_rel(df["apres"], df["avant"]))

# Avec taille d'effet et IC à 95 %
print(pg.ttest(df["apres"], df["avant"], paired=True))`,
      spss: `* Test t pour échantillons appariés.
T-TEST PAIRS=apres WITH avant (PAIRED)
  /ES DISPLAY(TRUE)
  /CRITERIA=CI(.95)
  /MISSING=ANALYSIS.

* Normalité des différences.
COMPUTE diff = apres - avant.
EXAMINE VARIABLES=diff /PLOT NPPLOT.`,
    },
    viz: { kind: 'paired', caption: 'Diagramme de pentes : une ligne par personne reliant la mesure 1 à la mesure 2, avec la moyenne en gras.' },
    expert: {
      params: ['Normalité des différences intra-individuelles.', 'Indépendance entre individus.', 'Échelle d’intervalle ou de rapport.'],
      equiv: 'wilcoxon',
      alternatives: ['Test par permutation des signes.', 'Modèle mixte avec effet aléatoire du sujet (si données manquantes).'],
      effet: 'd_z de Cohen (moyenne des différences / écart-type des différences) ; g de Hedges.',
      posthoc: 'Sans objet pour deux mesures.',
    },
  },

  wilcoxon: {
    id: 'wilcoxon',
    name: 'Test de Wilcoxon',
    alias: 'Rangs signés de Wilcoxon',
    family: 'nonparam',
    level: 'intermediaire',
    group: 'Comparaison de deux mesures appariées',
    objectif: 'Comparer deux mesures appariées sans hypothèse de normalité, en s’appuyant sur le signe et le rang des différences individuelles.',
    quand: 'Un plan avant/après ou deux conditions chez les mêmes personnes avec une VD ordinale, asymétrique ou de petit effectif.',
    conditions: [
      'VD au moins ordinale, mesurée deux fois sur les mêmes individus.',
      'Distribution des différences à peu près symétrique.',
      'Individus indépendants.',
    ],
    hypotheses: {
      h0: 'La distribution des différences est centrée sur zéro : pas de tendance à augmenter ni à diminuer.',
      h1: 'La distribution des différences n’est pas centrée sur zéro.',
      notes: ['Les différences nulles sont écartées. On classe les valeurs absolues des différences puis on additionne les rangs des différences positives (W+) et négatives (W−).'],
    },
    avantages: ['Pas d’hypothèse de normalité.', 'Robuste aux valeurs extrêmes.', 'Adapté aux petits échantillons et aux données ordinales.'],
    limites: ['Un peu moins puissant que Student apparié si la normalité tient.', 'Suppose une certaine symétrie des différences.', 'Perd les différences nulles.'],
    interpretation: 'Si p < .05, la tendance à changer dans un sens est significative. Indiquez les médianes des deux mesures et la taille d’effet (r = Z / √N). Format : W (ou V en R) = valeur, p = valeur, r = valeur.',
    exemple: 'Douze patients évaluent leur douleur de 0 à 10 avant et après une séance de kinésithérapie. La douleur a-t-elle diminué ?',
    exemples: {
      psy: 'Estimer si le niveau de stress perçu (échelle ordinale de 1 à 7) diminue après un protocole de relaxation chez les mêmes participants.',
      edu: 'Comparer la perception de difficulté d’un cours (Likert) avant puis après l’introduction d’une pédagogie active dans la même classe.',
      sante: 'Comparer le score de douleur d’échelle visuelle chez 15 patients avant et après une intervention.',
    },
    code: {
      r: `# Test de Wilcoxon pour échantillons appariés
wilcox.test(df$apres, df$avant, paired = TRUE,
            exact = FALSE, conf.int = TRUE)

# Médianes
median(df$avant); median(df$apres)

# Taille d'effet r
library(rstatix)
df_long |> wilcox_effsize(score ~ temps, paired = TRUE)`,
      py: `import pingouin as pg
from scipy.stats import wilcoxon

stat, p = wilcoxon(df["apres"], df["avant"], alternative="two-sided")
print(f"W = {stat:.1f}, p = {p:.4f}")

# Version Pingouin : taille d'effet (rang-bisérial, CLES)
print(pg.wilcoxon(df["apres"], df["avant"]))`,
      spss: `NPAR TESTS
  /WILCOXON=apres WITH avant (PAIRED)
  /STATISTICS DESCRIPTIVES QUARTILES
  /MISSING ANALYSIS.`,
    },
    viz: { kind: 'diffs', caption: 'Histogramme (ou points) des différences individuelles autour de zéro : la masse penche-t-elle d’un côté ?' },
    expert: {
      params: ['Pas de normalité exigée ; symétrie des différences autour de leur médiane.'],
      equiv: 'student_app',
      alternatives: ['Test des signes (hypothèses plus faibles, moins de puissance).', 'Test par permutation des signes.'],
      effet: 'r = Z/√N ; corrélation rang-bisériale appariée.',
      posthoc: 'Sans objet pour deux mesures.',
    },
  },

  // ─────────────────────────────────────────────── DIFFÉRENCES, PLUSIEURS GROUPES
  anova1_ind: {
    id: 'anova1_ind',
    name: 'Anova à un facteur pour échantillons indépendants',
    alias: 'Anova à un facteur inter-sujets (one-way)',
    family: 'param',
    level: 'intermediaire',
    group: 'Comparaison de trois groupes indépendants ou plus',
    objectif: 'Comparer les moyennes d’une variable quantitative entre trois groupes indépendants ou plus, définis par un seul facteur.',
    quand: 'VD quantitative, un facteur à trois modalités ou plus, groupes de personnes différentes, conditions paramétriques raisonnables.',
    conditions: [
      'VD quantitative.',
      'Trois groupes indépendants ou plus.',
      'Normalité des résidus dans chaque groupe.',
      'Homogénéité des variances (test de Levene) ; sinon Anova de Welch.',
      'Effectifs idéalement équilibrés.',
    ],
    hypotheses: {
      h0: 'Toutes les moyennes de population sont égales : μ1 = μ2 = … = μk.',
      h1: 'Au moins une moyenne diffère des autres.',
      notes: ['Statistique F = variance inter-groupes / variance intra-groupes.', 'H1 ne dit pas quels groupes diffèrent : il faut des comparaisons post-hoc.'],
    },
    avantages: ['Un seul test global évite l’inflation du risque alpha.', 'Puissante et très répandue.', 'Se prolonge naturellement en Anova multifactorielle.'],
    limites: ['Résultat global : n’identifie pas quels groupes diffèrent.', 'Sensible aux variances inégales avec des effectifs déséquilibrés.', 'Sensible aux valeurs extrêmes.'],
    interpretation: 'Si le F est significatif (p < .05), au moins un groupe diffère. Poursuivez par un test post-hoc (Tukey, Games-Howell si variances inégales) pour savoir lesquels. Rapportez F(ddl inter, ddl intra) = valeur, p, et η² (ou η²p) : .01 petit, .06 moyen, .14 grand.',
    exemple: 'Les élèves de trois méthodes de lecture (A, B, C) ont-ils des scores de compréhension moyens différents ?',
    exemples: {
      psy: 'Comparer le score de bien-être entre trois conditions : méditation, sport, groupe contrôle (participants différents dans chaque condition).',
      edu: 'Comparer les notes moyennes de quatre promotions suivant des modalités d’enseignement différentes (présentiel, hybride, distanciel).',
      sante: 'Comparer la baisse de glycémie entre trois dosages d’un médicament, chez des patients répartis aléatoirement.',
    },
    code: {
      r: `modele <- aov(score ~ groupe, data = df)
summary(modele)

# Conditions d'application
shapiro.test(residuals(modele))
car::leveneTest(score ~ groupe, data = df)

# Comparaisons post-hoc
TukeyHSD(modele)

# Taille d'effet
effectsize::eta_squared(modele)

# Si variances inégales : Anova de Welch
oneway.test(score ~ groupe, data = df, var.equal = FALSE)`,
      py: `import pingouin as pg

# Anova à un facteur (tableau détaillé, eta² partiel)
aov = pg.anova(data=df, dv="score", between="groupe", detailed=True)
print(aov)

# Conditions : normalité et homogénéité des variances
print(pg.normality(data=df, dv="score", group="groupe"))
print(pg.homoscedasticity(data=df, dv="score", group="groupe"))

# Post-hoc de Tukey
print(pg.pairwise_tukey(data=df, dv="score", between="groupe"))

# Variances inégales : Welch + Games-Howell
print(pg.welch_anova(data=df, dv="score", between="groupe"))
print(pg.pairwise_gameshowell(data=df, dv="score", between="groupe"))`,
      spss: `ONEWAY score BY groupe
  /STATISTICS DESCRIPTIVES HOMOGENEITY WELCH
  /MISSING ANALYSIS
  /POSTHOC=TUKEY GH ALPHA(0.05).

* Taille d'effet (eta²) via UNIANOVA.
UNIANOVA score BY groupe
  /PRINT=ETASQ HOMOGENEITY
  /DESIGN=groupe.`,
    },
    viz: { kind: 'box3', caption: 'Boîtes à moustaches (ou moyennes avec IC) pour chaque groupe ; les lettres a/b indiquent les différences post-hoc.' },
    expert: {
      params: ['Normalité des résidus.', 'Homoscédasticité (Levene, Brown-Forsythe).', 'Indépendance des observations.', 'VD quantitative.'],
      equiv: 'kruskal',
      alternatives: ['Anova de Welch (variances inégales).', 'Contrastes planifiés plutôt que post-hoc si hypothèses a priori.', 'Ancova (ajout d’une covariable).'],
      effet: 'η² / η²p / ω² (moins biaisé) ; f de Cohen.',
      posthoc: 'Tukey HSD (variances égales), Games-Howell (inégales), Bonferroni ou Holm.',
    },
  },

  kruskal: {
    id: 'kruskal',
    name: 'Test de Kruskal-Wallis',
    alias: 'Anova sur les rangs de Kruskal-Wallis',
    family: 'nonparam',
    level: 'intermediaire',
    group: 'Comparaison de trois groupes indépendants ou plus',
    objectif: 'Comparer trois groupes indépendants ou plus sur une variable ordinale ou quantitative non normale, à partir des rangs.',
    quand: 'Alternative non paramétrique à l’Anova à un facteur : un seul facteur, groupes indépendants, VD ordinale, asymétrique ou petits effectifs.',
    conditions: [
      'VD au moins ordinale.',
      'Trois groupes indépendants ou plus.',
      'Observations indépendantes.',
      'Distributions de forme comparable pour interpréter en termes de médianes.',
      'Au moins 5 observations par groupe pour l’approximation par le χ².',
    ],
    hypotheses: {
      h0: 'Les groupes proviennent de la même distribution (les rangs moyens sont égaux).',
      h1: 'Au moins un groupe tend à avoir des valeurs plus grandes ou plus petites que les autres.',
      notes: ['Statistique H, approximée par un χ² à k − 1 ddl.'],
    },
    avantages: ['Aucune hypothèse de normalité.', 'Robuste aux valeurs extrêmes.', 'Applicable aux données ordinales.'],
    limites: ['Moins puissant que l’Anova si ses conditions sont remplies.', 'Test global : nécessite des comparaisons post-hoc (Dunn).', 'Ne gère pas plusieurs facteurs.'],
    interpretation: 'Si p < .05, au moins un groupe diffère. Identifiez lesquels avec le test post-hoc de Dunn (correction de Bonferroni ou Holm). Rapportez H(ddl) = valeur, p, les médianes par groupe et ε² (.01 petit, .08 moyen, .26 grand).',
    exemple: 'Comparer la satisfaction (échelle en 5 points) de trois groupes d’étudiants selon la modalité de cours.',
    exemples: {
      psy: 'Comparer le niveau d’anxiété (score fortement asymétrique) entre trois groupes cliniques indépendants.',
      edu: 'Comparer le temps de réalisation d’un exercice (distribution très étalée) entre trois classes.',
      sante: 'Comparer l’intensité de la douleur (échelle ordinale) entre trois protocoles d’analgésie sur des patients différents.',
    },
    code: {
      r: `kruskal.test(score ~ groupe, data = df)

# Médianes par groupe
aggregate(score ~ groupe, data = df, FUN = median)

# Post-hoc de Dunn avec correction de Holm
library(FSA)
dunnTest(score ~ groupe, data = df, method = "holm")

# Taille d'effet epsilon²
rstatix::kruskal_effsize(df, score ~ groupe)`,
      py: `import pingouin as pg
from scipy.stats import kruskal

groupes = [g["score"].values for _, g in df.groupby("groupe")]
h, p = kruskal(*groupes)
print(f"H = {h:.2f}, p = {p:.4f}")

# Tableau Pingouin
print(pg.kruskal(data=df, dv="score", between="groupe"))

# Post-hoc de Dunn (bibliothèque scikit-posthocs)
# import scikit_posthocs as sp
# sp.posthoc_dunn(df, val_col="score", group_col="groupe", p_adjust="holm")`,
      spss: `NPAR TESTS
  /K-W=score BY groupe(1 3)
  /MISSING ANALYSIS.

* Comparaisons par paires (Dunn) : activer « Comparaisons par paires »
* dans l'onglet Paramètres de NPTESTS.
NPTESTS
  /INDEPENDENT TEST (score) GROUP (groupe) KRUSKAL_WALLIS(COMPARE=PAIRWISE).`,
    },
    viz: { kind: 'box3', caption: 'Boîtes à moustaches : les médianes (trait central) et la dispersion par groupe, sans hypothèse de normalité.' },
    expert: {
      params: ['Pas de normalité exigée ; formes de distribution semblables pour une lecture en médianes.'],
      equiv: 'anova1_ind',
      alternatives: ['Test de Jonckheere-Terpstra (si les groupes sont ordonnés).', 'Anova sur les rangs (équivalent asymptotique).'],
      effet: 'ε² (epsilon carré), η² de H.',
      posthoc: 'Test de Dunn avec correction de Holm ou Bonferroni ; Mann-Whitney par paires corrigés.',
    },
  },

  anova1_app: {
    id: 'anova1_app',
    name: 'Anova à un facteur pour échantillons appariés',
    alias: 'Anova à mesures répétées à un facteur',
    family: 'param',
    level: 'intermediaire',
    group: 'Comparaison de trois mesures appariées ou plus',
    objectif: 'Comparer les moyennes de trois conditions ou plus mesurées sur les mêmes individus.',
    quand: 'La même VD quantitative est mesurée à trois moments (ou dans trois conditions) ou plus sur les mêmes personnes, avec un seul facteur intra-sujet.',
    conditions: [
      'VD quantitative mesurée au moins trois fois sur les mêmes individus.',
      'Normalité des scores (ou des résidus) à chaque mesure.',
      'Sphéricité : variances des différences entre mesures égales (test de Mauchly, corrections de Greenhouse-Geisser ou Huynh-Feldt).',
      'Données complètes : une personne qui manque une mesure est exclue.',
    ],
    hypotheses: {
      h0: 'Les moyennes de toutes les mesures sont égales : μ1 = μ2 = … = μk.',
      h1: 'Au moins une moyenne diffère.',
      notes: ['La variabilité due aux individus est retirée de l’erreur, ce qui augmente la puissance.'],
    },
    avantages: ['Plus puissante qu’une Anova indépendante (chaque personne est son propre témoin).', 'Moins de participants nécessaires.', 'Permet de suivre une évolution dans le temps.'],
    limites: ['Exigence de sphéricité souvent violée.', 'Données manquantes problématiques.', 'Effets d’ordre, d’apprentissage et de fatigue à contrôler.'],
    interpretation: 'Si le F est significatif (avec correction de sphéricité si nécessaire), au moins une mesure diffère. Poursuivez avec des comparaisons post-hoc appariées corrigées (Bonferroni, Holm). Rapportez F(ddl, ddl erreur) = valeur, p, η²p, et la correction appliquée (ε de Greenhouse-Geisser).',
    exemple: 'Le même groupe d’étudiants est évalué en septembre, janvier et juin : leurs scores moyens évoluent-ils ?',
    exemples: {
      psy: 'La mémoire de travail de 30 participants est mesurée à trois niveaux de charge cognitive (faible, moyenne, élevée) : le score change-t-il avec la charge ?',
      edu: 'Le sentiment d’efficacité personnelle de 45 étudiants est mesuré en début, milieu et fin de semestre.',
      sante: 'La pression artérielle de 20 patients est mesurée avant, pendant et après un traitement.',
    },
    code: {
      r: `library(afex)
# df_long : une ligne par sujet x mesure (colonnes sujet, temps, score)
modele <- aov_ez(id = "sujet", dv = "score",
                 within = "temps", data = df_long)
summary(modele)       # sphéricité (Mauchly) et corrections GG / HF
anova(modele, es = "pes")

# Comparaisons post-hoc
library(emmeans)
emmeans(modele, pairwise ~ temps, adjust = "holm")`,
      py: `import pingouin as pg

# df_long : colonnes sujet, temps, score
print(pg.sphericity(df_long, dv="score", within="temps", subject="sujet"))

aov = pg.rm_anova(data=df_long, dv="score", within="temps",
                  subject="sujet", detailed=True, correction=True)
print(aov)      # F, p, p-GG-corr, eta² généralisé, epsilon

# Post-hoc appariés corrigés
print(pg.pairwise_tests(data=df_long, dv="score", within="temps",
                        subject="sujet", padjust="holm"))`,
      spss: `GLM t1 t2 t3
  /WSFACTOR=temps 3 Polynomial
  /METHOD=SSTYPE(3)
  /EMMEANS=TABLES(temps) COMPARE ADJ(BONFERRONI)
  /PRINT=DESCRIPTIVE ETASQUARED
  /CRITERIA=ALPHA(.05)
  /WSDESIGN=temps.`,
    },
    viz: { kind: 'lines', caption: 'Courbe des moyennes dans le temps avec intervalles de confiance, et trajectoires individuelles en transparence.' },
    expert: {
      params: ['Normalité des résidus à chaque niveau.', 'Sphéricité (Mauchly) ; corrections ε de Greenhouse-Geisser ou Huynh-Feldt.', 'Indépendance entre individus.'],
      equiv: 'friedman',
      alternatives: ['Modèle linéaire mixte (données manquantes, covariables).', 'Approche multivariée MANOVA (ne requiert pas la sphéricité).'],
      effet: 'η²p, η² généralisé, ω².',
      posthoc: 'Comparaisons appariées avec correction de Holm ou Bonferroni ; contrastes polynomiaux pour une tendance.',
    },
  },

  friedman: {
    id: 'friedman',
    name: 'Test de Friedman',
    alias: 'Anova sur les rangs de Friedman',
    family: 'nonparam',
    level: 'intermediaire',
    group: 'Comparaison de trois mesures appariées ou plus',
    objectif: 'Comparer trois conditions ou plus mesurées sur les mêmes individus, sans supposer la normalité, à partir des rangs intra-individuels.',
    quand: 'Alternative non paramétrique à l’Anova à mesures répétées : VD ordinale ou non normale, un facteur intra-sujet à au moins trois modalités.',
    conditions: [
      'VD au moins ordinale.',
      'Mesures répétées sur les mêmes individus (au moins trois conditions).',
      'Individus indépendants.',
      'Données complètes pour chaque individu.',
    ],
    hypotheses: {
      h0: 'Les conditions ont la même distribution : les rangs moyens sont égaux.',
      h1: 'Au moins une condition tend à avoir des valeurs différentes des autres.',
      notes: ['Pour chaque personne, on classe ses k mesures ; on compare ensuite la somme des rangs de chaque condition.'],
    },
    avantages: ['Aucune hypothèse de normalité ni de sphéricité.', 'Robuste aux valeurs extrêmes.', 'Adapté aux données ordinales.'],
    limites: ['Moins puissant que l’Anova appariée si ses conditions sont remplies.', 'Un seul facteur intra-sujet.', 'Exige des données complètes.'],
    interpretation: 'Si p < .05, au moins une condition diffère. Comparez ensuite les paires avec un test de Wilcoxon corrigé (Bonferroni ou Holm) ou le test de Nemenyi. Rapportez χ²(ddl) = valeur, p, les médianes par condition, et le W de Kendall comme taille d’effet.',
    exemple: 'Dix juges classent trois produits selon leur préférence : les produits sont-ils jugés différemment ?',
    exemples: {
      psy: 'Les mêmes participants évaluent la valence émotionnelle de trois types d’images (neutres, positives, négatives) sur une échelle ordinale.',
      edu: 'Des étudiants notent leur satisfaction (1 à 5) pour trois outils numériques utilisés successivement.',
      sante: 'L’intensité de la douleur est relevée chez les mêmes patients avant, pendant et après un soin.',
    },
    code: {
      r: `# df_long : colonnes sujet, temps, score
friedman.test(score ~ temps | sujet, data = df_long)

# Taille d'effet W de Kendall
library(rstatix)
friedman_effsize(df_long, score ~ temps | sujet)

# Post-hoc : Wilcoxon par paires corrigés
pairwise.wilcox.test(df_long$score, df_long$temps,
                     paired = TRUE, p.adjust.method = "holm")`,
      py: `import pingouin as pg
from scipy.stats import friedmanchisquare

# Données en largeur : une colonne par condition
stat, p = friedmanchisquare(df["t1"], df["t2"], df["t3"])
print(f"chi2 = {stat:.2f}, p = {p:.4f}")

# Pingouin : donne aussi le W de Kendall
print(pg.friedman(data=df_long, dv="score", within="temps", subject="sujet"))

# Post-hoc : Wilcoxon appariés corrigés
print(pg.pairwise_tests(data=df_long, dv="score", within="temps",
                        subject="sujet", parametric=False, padjust="holm"))`,
      spss: `NPAR TESTS
  /FRIEDMAN=t1 t2 t3
  /STATISTICS DESCRIPTIVES QUARTILES
  /MISSING LISTWISE.

* Comparaisons par paires.
NPTESTS
  /RELATED TEST(t1 t2 t3) FRIEDMAN(COMPARE=PAIRWISE).`,
    },
    viz: { kind: 'lines', variant: 'ranks', caption: 'Rangs moyens par condition : le test compare ces rangs (plus la ligne monte, plus la condition est classée haut).' },
    expert: {
      params: ['Pas de normalité ni de sphéricité exigées ; blocs (individus) indépendants.'],
      equiv: 'anova1_app',
      alternatives: ['Test de Page (si un ordre des conditions est attendu).', 'Q de Cochran (VD binaire).', 'Modèle mixte ordinal.'],
      effet: 'W de Kendall (coefficient de concordance).',
      posthoc: 'Wilcoxon par paires avec Holm ; test de Nemenyi ou de Conover.',
    },
  },

  anova_multi: {
    id: 'anova_multi',
    name: 'Anova multifactorielle',
    alias: 'Anova à plusieurs facteurs (factorielle, mixte)',
    family: 'param',
    level: 'avance',
    group: 'Comparaison avec plusieurs variables indépendantes',
    objectif: 'Étudier l’effet de plusieurs facteurs sur une variable quantitative, ainsi que leur interaction.',
    quand: 'VD quantitative et au moins deux variables indépendantes catégorielles, avec ou sans mesures répétées (plan inter-sujets, intra-sujets ou mixte).',
    conditions: [
      'VD quantitative.',
      'Deux facteurs catégoriels ou plus, croisés.',
      'Normalité des résidus.',
      'Homogénéité des variances entre cellules (plan inter) ; sphéricité pour les facteurs répétés.',
      'Effectifs suffisants par cellule, idéalement équilibrés.',
    ],
    hypotheses: {
      h0: 'Pour chaque effet principal et pour chaque interaction, les moyennes sont égales (effet nul).',
      h1: 'Au moins un effet principal ou une interaction est non nul.',
      notes: ['On teste autant de F que d’effets : A, B, A × B (et plus pour trois facteurs).', 'Une interaction significative prime : on interprète alors les effets simples.'],
    },
    avantages: ['Teste plusieurs facteurs et leurs interactions en une seule analyse.', 'Plus économique et plus puissante que des Anova séparées.', 'Permet de contrôler des variables parasites.'],
    limites: ['Interprétation délicate des interactions.', 'Exige des cellules suffisamment remplies.', 'Hypothèses nombreuses (normalité, homogénéité, sphéricité).'],
    interpretation: 'Examinez d’abord l’interaction. Si elle est significative, analysez les effets simples (l’effet d’un facteur à chaque niveau de l’autre) et lisez le graphique des moyennes. Sinon, interprétez les effets principaux. Rapportez F(ddl, ddl erreur) = valeur, p, η²p pour chaque effet, avec post-hoc corrigés.',
    exemple: 'Les scores de compréhension dépendent-ils de la méthode (A, B), du niveau (collège, lycée), et de la combinaison des deux ?',
    exemples: {
      psy: 'Effet du type de tâche (facile, difficile) et de la présence d’un public (oui, non) sur la performance : la présence d’un public pénalise-t-elle plus les tâches difficiles (interaction) ?',
      edu: 'Plan mixte : groupe (expérimental, témoin) × temps (pré-test, post-test, différé) sur le score d’apprentissage.',
      sante: 'Effet du traitement (A, B), du sexe, et de leur interaction sur la baisse de pression artérielle.',
    },
    code: {
      r: `# Plan inter-sujets 2 x 2
library(car)
modele <- lm(score ~ methode * niveau, data = df,
             contrasts = list(methode = contr.sum, niveau = contr.sum))
Anova(modele, type = 3)

# Effets simples et comparaisons post-hoc
library(emmeans)
emmeans(modele, pairwise ~ methode | niveau, adjust = "holm")

# Plan à mesures répétées ou mixte
library(afex)
aov_ez(id = "sujet", dv = "score",
       between = "groupe", within = "temps", data = df_long)

# Graphique d'interaction
emmip(modele, niveau ~ methode, CIs = TRUE)`,
      py: `import pingouin as pg
import statsmodels.api as sm
import statsmodels.formula.api as smf

# Plan inter-sujets 2 x 2 (somme des carrés de type III)
modele = smf.ols("score ~ C(methode, Sum) * C(niveau, Sum)", data=df).fit()
print(sm.stats.anova_lm(modele, typ=3))

# Pingouin (2 facteurs inter-sujets)
print(pg.anova(data=df, dv="score", between=["methode", "niveau"], detailed=True))

# Plan mixte : un facteur inter et un facteur intra
print(pg.mixed_anova(data=df_long, dv="score", within="temps",
                     between="groupe", subject="sujet"))`,
      spss: `* Plan factoriel inter-sujets.
UNIANOVA score BY methode niveau
  /METHOD=SSTYPE(3)
  /INTERCEPT=INCLUDE
  /PLOT=PROFILE(methode*niveau)
  /EMMEANS=TABLES(methode*niveau) COMPARE(methode) ADJ(BONFERRONI)
  /PRINT=ETASQ HOMOGENEITY DESCRIPTIVE
  /DESIGN=methode niveau methode*niveau.

* Plan mixte : facteur répété (t1 t2 t3) × facteur de groupe.
GLM t1 t2 t3 BY groupe
  /WSFACTOR=temps 3 Polynomial
  /PRINT=ETASQ HOMOGENEITY
  /WSDESIGN=temps
  /DESIGN=groupe.`,
    },
    viz: { kind: 'interaction', caption: 'Graphique d’interaction : des lignes non parallèles signalent une interaction entre les deux facteurs.' },
    expert: {
      params: ['Normalité des résidus ; homoscédasticité (Levene) ; sphéricité pour facteurs répétés.', 'Choix du type de somme des carrés (type III en plan déséquilibré).', 'Codage des contrastes (somme nulle) pour des effets principaux interprétables.'],
      equiv: null,
      alternatives: ['Anova sur rangs alignés (ART Anova) : équivalent non paramétrique pour plans factoriels.', 'Modèles linéaires mixtes (données manquantes, covariables).', 'Ancova si une covariable continue est pertinente.'],
      effet: 'η²p, η² généralisé, ω² partiel.',
      posthoc: 'Analyse des effets simples ; Tukey / Holm sur les moyennes marginales estimées.',
    },
  },

  // ─────────────────────────────────────────────── RELATIONS
  pearson: {
    id: 'pearson',
    name: 'Corrélation de Bravais-Pearson',
    alias: 'Coefficient r de Pearson',
    family: 'param',
    level: 'debutant',
    group: 'Relation entre deux variables continues',
    objectif: 'Mesurer l’intensité et le sens du lien linéaire entre deux variables quantitatives continues.',
    quand: 'Deux variables quantitatives mesurées sur les mêmes individus, relation approximativement linéaire, et vous voulez le degré de relation.',
    conditions: [
      'Deux variables quantitatives continues.',
      'Relation linéaire (vérifier le nuage de points).',
      'Normalité bivariée approximative (surtout pour de petits échantillons).',
      'Pas de valeurs aberrantes influentes.',
      'Observations indépendantes.',
    ],
    hypotheses: {
      h0: 'Il n’existe pas de relation linéaire dans la population : ρ = 0.',
      h1: 'Il existe une relation linéaire : ρ ≠ 0 (ou ρ > 0 / ρ < 0 si unilatéral).',
      notes: ['r est compris entre −1 et +1. Test : t = r√(n−2)/√(1−r²), avec n − 2 ddl.'],
    },
    avantages: ['Indicateur synthétique et universel.', 'Sans unité, comparable entre études.', 'r² donne directement la part de variance partagée.'],
    limites: ['Ne détecte que les relations linéaires.', 'Très sensible aux valeurs extrêmes.', 'Corrélation n’est pas causalité.'],
    interpretation: 'Regardez le signe (sens) et la valeur absolue de r (intensité : .10 faible, .30 moyenne, .50 forte). r² est la proportion de variance partagée. Rapportez r(ddl) = valeur, p, et l’intervalle de confiance. Un r significatif mais faible (par exemple .08 avec N = 1 000) n’a que peu de portée pratique.',
    exemple: 'Existe-t-il un lien entre le nombre d’heures de sommeil et le score d’attention ?',
    exemples: {
      psy: 'Le niveau d’anxiété (score de 0 à 80) est-il lié au temps de réaction à une tâche d’attention ?',
      edu: 'Le temps de travail hebdomadaire est-il corrélé à la moyenne générale des étudiants ?',
      sante: 'L’indice de masse corporelle est-il corrélé à la pression artérielle systolique ?',
    },
    code: {
      r: `# Nuage de points pour vérifier la linéarité
plot(df$x, df$y)

# Corrélation de Pearson (r, IC 95 %, p)
cor.test(df$x, df$y, method = "pearson")

# Matrice de corrélations
cor(df[, c("x", "y", "z")], use = "complete.obs")`,
      py: `from scipy.stats import pearsonr
import pingouin as pg

r, p = pearsonr(df["x"], df["y"])
print(f"r = {r:.2f}, p = {p:.4f}")

# Avec IC à 95 % et puissance
print(pg.corr(df["x"], df["y"], method="pearson"))

# Matrice de corrélations
print(df[["x", "y", "z"]].corr(method="pearson"))`,
      spss: `CORRELATIONS
  /VARIABLES=x y
  /PRINT=TWOTAIL NOSIG
  /STATISTICS DESCRIPTIVES
  /MISSING=PAIRWISE.

* Nuage de points.
GRAPH /SCATTERPLOT(BIVAR)=x WITH y.`,
    },
    viz: { kind: 'scatter', caption: 'Nuage de points : plus les points s’alignent sur une droite, plus |r| est proche de 1.' },
    expert: {
      params: ['Normalité bivariée ; linéarité ; homoscédasticité ; absence de valeurs aberrantes ; indépendance.'],
      equiv: 'spearman',
      alternatives: ['Corrélation de Spearman (relation monotone ou rangs).', 'Tau de Kendall (petits échantillons, nombreux ex æquo).', 'Corrélation partielle pour contrôler une variable.'],
      effet: 'r lui-même ; r² ; IC par transformation z de Fisher.',
      posthoc: 'Comparaison de deux corrélations : test de Fisher ; correction de Holm pour une matrice.',
    },
  },

  spearman: {
    id: 'spearman',
    name: 'Corrélation de Spearman',
    alias: 'Coefficient rho de Spearman',
    family: 'nonparam',
    level: 'debutant',
    group: 'Relation entre deux variables ordinales',
    objectif: 'Mesurer l’intensité et le sens d’un lien monotone entre deux variables, à partir de leurs rangs.',
    quand: 'Variables ordinales ou classements, relation monotone mais non linéaire, valeurs extrêmes ou distributions non normales.',
    conditions: [
      'Deux variables au moins ordinales.',
      'Relation monotone (toujours croissante ou toujours décroissante).',
      'Observations indépendantes.',
    ],
    hypotheses: {
      h0: 'Il n’y a pas d’association monotone dans la population : ρs = 0.',
      h1: 'Il existe une association monotone : ρs ≠ 0.',
      notes: ['Équivaut à un coefficient de Pearson calculé sur les rangs.'],
    },
    avantages: ['Aucune hypothèse de normalité.', 'Peu sensible aux valeurs extrêmes.', 'Capte les relations monotones non linéaires.'],
    limites: ['Un peu moins puissant que Pearson si la relation est linéaire et normale.', 'Perd l’information des écarts entre valeurs.', 'Nombreux ex æquo : nécessite une correction.'],
    interpretation: 'Même lecture que r : signe et intensité (|ρ| < .30 faible, .30 à .50 moyenne, > .50 forte). Rapportez rs(n) = valeur, p. Vérifiez sur le graphique que la relation est bien monotone.',
    exemple: 'Deux jurys classent 12 candidats : leurs classements sont-ils concordants ?',
    exemples: {
      psy: 'Le rang de popularité des élèves dans la classe est-il lié à leur rang en confiance en soi ?',
      edu: 'Le classement des étudiants selon leur note à l’écrit est-il concordant avec leur classement à l’oral ?',
      sante: 'Le stade de sévérité d’une pathologie (ordinal) est-il lié au niveau de douleur déclaré ?',
    },
    code: {
      r: `cor.test(df$x, df$y, method = "spearman", exact = FALSE)

# Nuage de points avec courbe lissée
plot(df$x, df$y)
lines(lowess(df$x, df$y), col = "blue")`,
      py: `from scipy.stats import spearmanr
import pingouin as pg

rho, p = spearmanr(df["x"], df["y"])
print(f"rho = {rho:.2f}, p = {p:.4f}")

print(pg.corr(df["x"], df["y"], method="spearman"))`,
      spss: `NONPAR CORR
  /VARIABLES=x y
  /PRINT=SPEARMAN TWOTAIL NOSIG
  /MISSING=PAIRWISE.`,
    },
    viz: { kind: 'scatterRank', caption: 'Nuage de points monotone : la relation croît toujours, sans être une droite ; les rangs la rendent linéaire.' },
    expert: {
      params: ['Pas de normalité exigée ; hypothèse de monotonie ; indépendance.'],
      equiv: 'pearson',
      alternatives: ['Tau de Kendall (meilleur avec de petits effectifs et des ex æquo).', 'Corrélation de Pearson après transformation (log) si une transformation linéarise.'],
      effet: 'ρs ; IC par bootstrap.',
      posthoc: 'Correction de Holm pour une matrice de corrélations.',
    },
  },

  regression: {
    id: 'regression',
    name: 'Régression linéaire simple',
    alias: 'Régression',
    family: 'param',
    level: 'intermediaire',
    group: 'Relation entre deux variables continues',
    objectif: 'Modéliser la forme de la relation entre un prédicteur et une VD quantitative, pour décrire l’effet et prédire.',
    quand: 'Un seul prédicteur, une VD quantitative, relation linéaire, et vous voulez l’équation de la droite, la pente et la part de variance expliquée.',
    conditions: [
      'VD quantitative continue ; prédicteur quantitatif (ou binaire).',
      'Relation linéaire entre prédicteur et VD.',
      'Résidus normalement distribués, de variance constante (homoscédasticité).',
      'Indépendance des résidus.',
      'Pas de valeurs aberrantes ou influentes (distance de Cook).',
    ],
    hypotheses: {
      h0: 'La pente est nulle dans la population : β1 = 0 (le prédicteur n’explique rien de la VD).',
      h1: 'La pente est non nulle : β1 ≠ 0.',
      notes: ['Modèle : Y = β0 + β1·X + ε. Test de β1 par un t avec n − 2 ddl ; équivalent au F du modèle.'],
    },
    avantages: ['Fournit une équation de prédiction interprétable.', 'Donne la pente (effet en unités de la VD) et R².', 'Base de tous les modèles linéaires plus complexes.'],
    limites: ['Ne détecte que les relations linéaires.', 'Sensible aux valeurs aberrantes.', 'Une prédiction hors de la plage observée est hasardeuse.'],
    interpretation: 'La pente b indique de combien la VD change quand le prédicteur augmente d’une unité. R² est la proportion de variance expliquée. Rapportez b, son IC à 95 %, t(ddl) = valeur, p, et R². Contrôlez les résidus (graphique résidus / valeurs prédites, Q-Q plot) avant de conclure.',
    exemple: 'Quelle note prévoit-on pour un étudiant qui révise 12 heures par semaine ? De combien la note augmente-t-elle par heure supplémentaire ?',
    exemples: {
      psy: 'Prédire le score de performance d’une tâche à partir du niveau d’anxiété (loi de Yerkes-Dodson aplatie en première approximation).',
      edu: 'Prédire la note à l’examen final à partir de la note au test de positionnement.',
      sante: 'Prédire la pression artérielle systolique à partir de l’âge.',
    },
    code: {
      r: `modele <- lm(y ~ x, data = df)
summary(modele)        # pente, t, p, R²
confint(modele)        # IC à 95 %

# Vérification des conditions
par(mfrow = c(2, 2)); plot(modele)

# Prédiction
predict(modele, newdata = data.frame(x = 12), interval = "prediction")

# Graphique
library(ggplot2)
ggplot(df, aes(x, y)) + geom_point() + geom_smooth(method = "lm")`,
      py: `import statsmodels.formula.api as smf

modele = smf.ols("y ~ x", data=df).fit()
print(modele.summary())          # coefficients, R², F, résidus

# Prédiction avec intervalle
nouveau = {"x": [12]}
print(modele.get_prediction(nouveau).summary_frame(alpha=0.05))

# Alternative Pingouin
import pingouin as pg
print(pg.linear_regression(df["x"], df["y"]))`,
      spss: `REGRESSION
  /MISSING LISTWISE
  /STATISTICS COEFF OUTS CI(95) R ANOVA
  /CRITERIA=PIN(.05) POUT(.10)
  /NOORIGIN
  /DEPENDENT y
  /METHOD=ENTER x
  /SCATTERPLOT=(*ZRESID ,*ZPRED)
  /RESIDUALS HISTOGRAM(ZRESID) NORMPROB(ZRESID).`,
    },
    viz: { kind: 'scatterLine', caption: 'Nuage de points et droite de régression avec bande de confiance ; les écarts verticaux sont les résidus.' },
    expert: {
      params: ['Linéarité ; normalité des résidus ; homoscédasticité ; indépendance des erreurs ; absence de points influents.'],
      equiv: null,
      alternatives: ['Régression robuste ou de Theil-Sen (valeurs aberrantes).', 'Régression polynomiale ou GAM (relation courbe).', 'Corrélation de Spearman si seul le degré importe.'],
      effet: 'R², pente standardisée β, f² de Cohen.',
      posthoc: 'Diagnostic des résidus et de l’influence (distance de Cook, leviers).',
    },
  },

  regression_multiple: {
    id: 'regression_multiple',
    name: 'Régression linéaire multiple',
    alias: 'Régression multiple',
    family: 'param',
    level: 'avance',
    group: 'Relation avec plusieurs prédicteurs',
    objectif: 'Expliquer ou prédire une VD quantitative à partir de plusieurs prédicteurs simultanément, en estimant l’effet propre de chacun.',
    quand: 'Une VD quantitative et au moins deux prédicteurs (quantitatifs ou qualitatifs), avec l’intention de contrôler les autres variables.',
    conditions: [
      'VD quantitative continue.',
      'Linéarité entre chaque prédicteur et la VD.',
      'Résidus normaux et homoscédastiques ; erreurs indépendantes.',
      'Absence de multicolinéarité forte (VIF < 5 à 10).',
      'Effectif suffisant : au moins 10 à 20 observations par prédicteur.',
    ],
    hypotheses: {
      h0: 'Globalement : tous les coefficients de pente sont nuls (R² = 0). Pour chaque prédicteur : βj = 0.',
      h1: 'Globalement : au moins un coefficient est non nul. Pour chaque prédicteur : βj ≠ 0, toutes choses égales par ailleurs.',
      notes: ['Modèle : Y = β0 + β1X1 + β2X2 + … + ε.', 'Test global par un F ; test de chaque prédicteur par un t.'],
    },
    avantages: ['Contrôle l’effet des autres variables (« toutes choses égales par ailleurs »).', 'Combine variables quantitatives et qualitatives.', 'Donne la part de variance expliquée par l’ensemble des prédicteurs.'],
    limites: ['Sensible à la multicolinéarité.', 'Risque de surajustement si trop de prédicteurs.', 'Les coefficients dépendent du modèle choisi.'],
    interpretation: 'Examinez R² ajusté et le F global, puis chaque coefficient : le b d’un prédicteur est le changement de la VD pour une unité de ce prédicteur, les autres étant constants. Utilisez les coefficients standardisés (β) pour comparer l’importance relative. Vérifiez les VIF et les résidus.',
    exemple: 'Expliquer la note finale par les heures de révision, les heures de sommeil et la note initiale, en isolant l’effet propre de chaque variable.',
    exemples: {
      psy: 'Prédire le bien-être à partir du soutien social perçu, du niveau de stress et du nombre d’heures de sommeil.',
      edu: 'Expliquer la réussite en première année par la moyenne au bac, le temps de travail et le temps de trajet.',
      sante: 'Expliquer la glycémie à jeun à partir de l’âge, de l’indice de masse corporelle et de l’activité physique.',
    },
    code: {
      r: `modele <- lm(y ~ x1 + x2 + x3, data = df)
summary(modele)        # R² ajusté, F global, coefficients

# Multicolinéarité
car::vif(modele)

# Coefficients standardisés
modele_std <- lm(scale(y) ~ scale(x1) + scale(x2) + scale(x3), data = df)
coef(modele_std)

# Diagnostics
par(mfrow = c(2, 2)); plot(modele)
car::influencePlot(modele)`,
      py: `import statsmodels.formula.api as smf
from statsmodels.stats.outliers_influence import variance_inflation_factor
import pandas as pd

modele = smf.ols("y ~ x1 + x2 + x3", data=df).fit()
print(modele.summary())

# Multicolinéarité (VIF)
X = modele.model.exog
vif = pd.Series([variance_inflation_factor(X, i) for i in range(1, X.shape[1])],
                index=modele.model.exog_names[1:])
print(vif)

# Alternative Pingouin
import pingouin as pg
print(pg.linear_regression(df[["x1", "x2", "x3"]], df["y"], relimp=True))`,
      spss: `REGRESSION
  /MISSING LISTWISE
  /STATISTICS COEFF OUTS CI(95) R ANOVA COLLIN TOL
  /CRITERIA=PIN(.05) POUT(.10)
  /NOORIGIN
  /DEPENDENT y
  /METHOD=ENTER x1 x2 x3
  /SCATTERPLOT=(*ZRESID ,*ZPRED)
  /RESIDUALS DURBIN HISTOGRAM(ZRESID) NORMPROB(ZRESID)
  /CASEWISE PLOT(ZRESID) OUTLIERS(3).`,
    },
    viz: { kind: 'coef', caption: 'Graphique des coefficients : estimations et intervalles de confiance de chaque prédicteur ; un intervalle qui coupe zéro n’est pas significatif.' },
    expert: {
      params: ['Linéarité ; normalité des résidus ; homoscédasticité ; indépendance ; non-colinéarité (VIF).', 'Spécification correcte du modèle (pas de variable omise importante).'],
      equiv: null,
      alternatives: ['Régressions pénalisées (ridge, lasso) en cas de multicolinéarité.', 'Modèles mixtes pour données groupées.', 'Régression hiérarchique pour tester l’apport de blocs de prédicteurs.'],
      effet: 'R² ajusté, ΔR², β standardisés, f² de Cohen.',
      posthoc: 'Comparaison de modèles emboîtés (test F, AIC/BIC) ; diagnostics d’influence.',
    },
  },
}

// Ordre d'affichage (famille d'analyses)
export const TEST_ORDER = [
  'khi2_ajustement', 'khi2_independance', 'mcnemar', 'regression_logistique',
  'student_ind', 'mann_whitney', 'student_app', 'wilcoxon',
  'anova1_ind', 'kruskal', 'anova1_app', 'friedman', 'anova_multi',
  'pearson', 'spearman', 'regression', 'regression_multiple',
]

// Noms courts pour les pastilles
export const SHORT = {
  khi2_ajustement: 'Khi² d’ajustement', khi2_independance: 'Khi² d’indépendance', mcnemar: 'McNemar',
  regression_logistique: 'Régression logistique', student_ind: 'Student indépendant', mann_whitney: 'Mann-Whitney',
  student_app: 'Student apparié', wilcoxon: 'Wilcoxon', anova1_ind: 'Anova 1 facteur indép.', kruskal: 'Kruskal-Wallis',
  anova1_app: 'Anova 1 facteur appariée', friedman: 'Friedman', anova_multi: 'Anova multifactorielle',
  pearson: 'Corrélation de Pearson', spearman: 'Corrélation de Spearman', regression: 'Régression',
  regression_multiple: 'Régression multiple',
}
export const GROUPS = [
  { label: 'Variable qualitative', tests: ['khi2_ajustement', 'khi2_independance', 'mcnemar', 'regression_logistique'] },
  { label: 'Comparer des groupes', tests: ['student_ind', 'mann_whitney', 'student_app', 'wilcoxon', 'anova1_ind', 'kruskal', 'anova1_app', 'friedman', 'anova_multi'] },
  { label: 'Relier des variables', tests: ['pearson', 'spearman', 'regression', 'regression_multiple'] },
]

// Jamovi : logiciel à interface graphique, on décrit donc le chemin dans les menus
const J = (...lines) => lines.join('\n')
const NOTE = '# Libellés de la version française de Jamovi ; si un intitulé diffère, l’équivalent anglais est entre parenthèses.'
const JAMOVI = {
  khi2_ajustement: J(NOTE, '1. Analyses > Fréquences > Test de proportion à un échantillon > N résultats, χ² d’ajustement (Frequencies > One Sample Proportion Tests > N Outcomes)', '2. Glisser la variable qualitative dans « Variable ».', '3. Cocher « Effectifs attendus » pour contrôler les effectifs théoriques (≥ 5).', '4. Ouvrir « Proportions attendues » et saisir la répartition de référence (égale par défaut).', '5. Lire χ², ddl et p dans le tableau du test.'),
  khi2_independance: J(NOTE, '1. Analyses > Fréquences > Tableaux de contingence > Échantillons indépendants, test du χ² d’association (Frequencies > Contingency Tables > Independent Samples)', '2. Variable 1 dans « Lignes », variable 2 dans « Colonnes ».', '3. Onglet « Statistiques » : cocher « χ² », « Test exact de Fisher » (petits effectifs) et « Phi et V de Cramér ».', '4. Onglet « Cellules » : cocher « Effectifs attendus » et les pourcentages en ligne.', '5. Option « Graphiques » : diagramme en barres groupées.'),
  mcnemar: J(NOTE, '1. Analyses > Fréquences > Tableaux de contingence > Échantillons appariés, test de McNemar (Frequencies > Contingency Tables > Paired Samples)', '2. « Variables appariées » : mesure 1 (avant) en lignes, mesure 2 (après) en colonnes.', '3. Cocher « Test de McNemar ».', '4. Les cases hors diagonale (les changements) portent le test.'),
  regression_logistique: J(NOTE, '1. Analyses > Régression > Régression logistique à 2 résultats (Regression > 2 Outcomes, Binomial)', '2. « Variable dépendante » : la VD à deux modalités.', '3. Prédicteurs quantitatifs dans « Covariables », qualitatifs dans « Facteurs ».', '4. « Coefficients du modèle » : cocher « Odds ratio » (rapport de cotes) et « Intervalle de confiance ».', '5. « Vérification des hypothèses » : cocher la colinéarité.', '6. « Prédiction » : cocher « AUC » et « Courbe ROC ».'),
  student_ind: J(NOTE, '1. Analyses > Tests T > Tests T pour échantillons indépendants', '2. VD dans « Variables dépendantes », variable de groupe dans « Variable de regroupement ».', '3. « Tests » : cocher « Student » et « Welch ».', '4. « Statistiques supplémentaires » : « Différence de moyennes », « Taille d’effet » (d de Cohen), « Descriptifs ».', '5. « Vérification des hypothèses » : « Normalité » (Shapiro-Wilk) et « Égalité des variances » (Levene).'),
  mann_whitney: J(NOTE, '1. Analyses > Tests T > Tests T pour échantillons indépendants', '2. VD dans « Variables dépendantes », groupe dans « Variable de regroupement ».', '3. « Tests » : cocher « U de Mann-Whitney » (décocher Student).', '4. « Statistiques supplémentaires » : « Taille d’effet » (corrélation rang-bisériale) et « Descriptifs » (médianes).', '5. « Graphiques » : graphiques descriptifs pour visualiser les groupes.'),
  student_app: J(NOTE, '1. Analyses > Tests T > Test T pour échantillons appariés (T-Tests > Paired Samples T-Test)', '2. « Variables appariées » : mesure 1 (avant), puis mesure 2 (après).', '3. « Tests » : cocher « Student ».', '4. « Statistiques supplémentaires » : « Différence de moyennes », « Taille d’effet » (d de Cohen), « Descriptifs ».', '5. « Vérification des hypothèses » : « Normalité » (Shapiro-Wilk sur les différences).'),
  wilcoxon: J(NOTE, '1. Analyses > Tests T > Test T pour échantillons appariés (T-Tests > Paired Samples T-Test)', '2. « Variables appariées » : mesure 1 (avant), puis mesure 2 (après).', '3. « Tests » : cocher « Rang de Wilcoxon » (décocher Student).', '4. « Statistiques supplémentaires » : « Taille d’effet » et « Descriptifs » (médianes).'),
  anova1_ind: J(NOTE, '1. Analyses > ANOVA > ANOVA à un facteur (ANOVA > One-Way ANOVA)', '2. VD dans « Variables dépendantes », facteur dans « Variable de regroupement ».', '3. « Variances » : « Ne pas supposer l’égalité (Welch) » ou « Supposer l’égalité (Fisher) ».', '4. « Vérification des hypothèses » : test d’homogénéité, test de normalité et diagramme Q-Q.', '5. « Tests post-hoc » : « Tukey » (ou « Games-Howell » si les variances sont inégales).', '6. Taille d’effet : Analyses > ANOVA > ANOVA, « Taille d’effet », cocher η² et ω².'),
  kruskal: J(NOTE, '1. Analyses > ANOVA > ANOVA non paramétrique à un facteur, Kruskal-Wallis (ANOVA > One-Way ANOVA (Non-parametric))', '2. VD dans « Variables dépendantes », facteur dans « Variable de regroupement ».', '3. Cocher « Comparaisons par paires DSCF » (Dwass-Steel-Critchlow-Fligner).', '4. Médianes par groupe : Analyses > Exploration > Descriptifs, scinder par le facteur, cocher « Médiane ».'),
  anova1_app: J(NOTE, '1. Analyses > ANOVA > ANOVA à mesures répétées (ANOVA > Repeated Measures ANOVA)', '2. « Facteurs intra-sujets » : renommer « Facteur inter-sujets 1 » (par exemple « temps ») et nommer les niveaux (T1, T2, T3).', '3. « Cellules de mesures répétées » : affecter une colonne par niveau.', '4. « Vérification des hypothèses » : tests de sphéricité ; correction « Greenhouse-Geisser » si elle est violée.', '5. « Taille d’effet » : cocher « η² partiel ».', '6. « Tests post-hoc » : facteur « temps », correction « Tukey » ou « Bonferroni ».'),
  friedman: J(NOTE, '1. Analyses > ANOVA > ANOVA non paramétrique à mesures répétées, Friedman (ANOVA > Repeated Measures ANOVA (Non-parametric))', '2. « Mesures » : glisser les colonnes T1, T2, T3 (une par condition).', '3. Cocher « Comparaisons par paires (Durbin-Conover) ».', '4. Médianes par condition : Analyses > Exploration > Descriptifs, cocher « Médiane ».'),
  anova_multi: J(NOTE, '# Plan inter-sujets', '1. Analyses > ANOVA > ANOVA', '2. VD dans « Variable dépendante », facteurs dans « Facteurs fixes ».', '3. « Modèle » : vérifier que l’interaction facteur1 * facteur2 est présente.', '4. « Taille d’effet » : cocher « η² partiel ».', '5. « Vérification des hypothèses » : tests d’homogénéité et diagramme Q-Q des résidus.', '6. « Moyennes marginales estimées » : ajouter le terme facteur1*facteur2 et cocher le graphique des moyennes marginales.', '7. « Tests post-hoc » : choisir les facteurs, correction « Tukey » ou « Holm ».', '', '# Plan à mesures répétées ou mixte', '1. Analyses > ANOVA > ANOVA à mesures répétées', '2. Définir le facteur intra-sujets et ses niveaux, puis affecter les colonnes dans « Cellules de mesures répétées ».', '3. Facteur de groupe dans « Facteurs inter-sujets ».', '4. « Vérification des hypothèses » : tests de sphéricité.'),
  pearson: J(NOTE, '1. Analyses > Régression > Matrice de corrélation', '2. Glisser les variables quantitatives dans la zone de droite.', '3. « Coefficients de corrélation » : cocher « Pearson ».', '4. « Options supplémentaires » : « Signification », « Intervalle de confiance », « Marquer les corrélations significatives ».', '5. « Tracé » : « Matrice de corrélation » (nuages de points) pour vérifier la linéarité.'),
  spearman: J(NOTE, '1. Analyses > Régression > Matrice de corrélation', '2. Glisser les variables (ordinales ou quantitatives) dans la zone de droite.', '3. « Coefficients de corrélation » : cocher « Spearman » (« Tau b de Kendall » en alternative).', '4. « Options supplémentaires » : « Signification » et « Intervalle de confiance ».', '5. « Tracé » : « Matrice de corrélation » pour contrôler que la relation est monotone.'),
  regression: J(NOTE, '1. Analyses > Régression > Régression linéaire', '2. VD dans « Variable dépendante », prédicteur dans « Covariables ».', '3. « Ajustement du modèle » : cocher « R, R² » et le test F.', '4. « Coefficients du modèle » : « Estimation standardisée » et « Intervalle de confiance ».', '5. « Vérification des hypothèses » : diagramme Q-Q des résidus, graphiques des résidus, Durbin-Watson.', '6. « Moyennes marginales estimées » : ajouter le prédicteur pour tracer la droite.'),
  regression_multiple: J(NOTE, '1. Analyses > Régression > Régression linéaire', '2. VD dans « Variable dépendante », prédicteurs quantitatifs dans « Covariables », qualitatifs dans « Facteurs ».', '3. « Ajustement du modèle » : « R² ajusté » et test F.', '4. « Coefficients du modèle » : « Estimation standardisée » et « Intervalle de confiance ».', '5. « Vérification des hypothèses » : statistiques de colinéarité (VIF et tolérance), Durbin-Watson, distance de Cook.', '6. « Constructeur de modèle » : ajouter des blocs pour une régression hiérarchique (ΔR²).'),
}
Object.keys(JAMOVI).forEach((k) => { TESTS[k].code.jamovi = JAMOVI[k] })
