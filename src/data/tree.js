// Arbre de décision pour le choix d'un test statistique
// Structure fidèle à l'arbre de F. Guillemot (Nantes Université, 2023, HAL hal-04292194),
// enrichie d'une question « conditions paramétriques » pour départager test paramétrique / non paramétrique.

const paramQuestion = (id, { subject, yes, no, excludesYes, excludesNo, why }) => ({
  id,
  type: 'question',
  criterion: 'Conditions paramétriques',
  icon: 'Gauge',
  title: 'Les conditions d’un test paramétrique sont-elles raisonnablement remplies ?',
  lead: `Elles portent sur ${subject}.`,
  options: [
    {
      id: 'param',
      label: 'Oui, je peux supposer une distribution normale',
      short: 'Paramétrique',
      desc: 'Mesure continue, distribution à peu près symétrique, pas de valeurs extrêmes, effectifs corrects (≈ 30 ou plus, ou normalité vérifiée).',
      icon: 'CheckCircle2',
      next: yes,
      excludes: excludesYes,
    },
    {
      id: 'nonparam',
      label: 'Non, ou j’ai un doute',
      short: 'Non paramétrique',
      desc: 'Données ordinales, forte asymétrie, valeurs extrêmes, très petits échantillons ou normalité clairement rejetée.',
      icon: 'AlertTriangle',
      next: no,
      excludes: excludesNo,
    },
  ],
  why,
  concept: {
    title: 'Paramétrique ou non paramétrique ?',
    body: 'Un test paramétrique suppose que les données suivent une loi connue (le plus souvent la loi normale) et compare des paramètres (moyennes). Un test non paramétrique ne fait pas cette hypothèse : il travaille sur les rangs. Il est plus robuste, mais un peu moins puissant quand les conditions paramétriques sont réellement remplies.',
  },
  help: {
    title: 'Comment savoir si mes données sont « normales » ?',
    body: 'Regardez d’abord un histogramme ou un diagramme quantile-quantile (Q-Q plot) : la forme générale est-elle en cloche, sans queue très étirée ? Complétez avec un test de Shapiro-Wilk (p > .05 : pas de signe de non-normalité). Avec plus de 30 observations par groupe, le théorème central limite rend les tests de moyennes assez tolérants. En cas de doute (échelle ordinale type Likert à 5 niveaux, effectifs inférieurs à 15, valeurs aberrantes) choisissez « Non ».',
    example: 'Des temps de réaction sont souvent asymétriques (quelques valeurs très longues) : mieux vaut un test non paramétrique, ou transformer les données. Des tailles d’adultes sont presque toujours normales : test paramétrique.',
    tip: 'Dans le doute, la voie non paramétrique reste valide ; elle ne coûte qu’un peu de puissance.',
  },
})

const nodes = {};
const add = (n) => { nodes[n.id] = n; return n }

// ───────── 1. Nature de la variable dépendante
add({
  id: 'vd',
  type: 'question',
  criterion: 'Nature de la variable dépendante',
  icon: 'Target',
  title: 'Quelle est la nature de votre variable dépendante (VD) ?',
  lead: 'La VD est la variable que vous mesurez pour observer un effet : le résultat, la réponse, ce que vous cherchez à expliquer.',
  options: [
    {
      id: 'quali', label: 'Qualitative', short: 'Qualitative',
      desc: 'Des catégories, des modalités : oui/non, réussite/échec, filière, type de réponse.',
      icon: 'Tags', next: 'quali_type',
      excludes: 'Tous les tests de moyennes, de rangs et de corrélation sont écartés : ils exigent une VD numérique. Il reste les tests sur des fréquences (khi²) et la régression logistique.',
    },
    {
      id: 'quanti', label: 'Quantitative', short: 'Quantitative',
      desc: 'Des nombres sur une échelle : score, temps, note, taille, taux, nombre d’erreurs.',
      icon: 'Ruler', next: 'quanti_type',
      excludes: 'Les tests du khi² et McNemar sont écartés : ils comparent des effectifs de catégories, pas des moyennes ou des rangs.',
    },
  ],
  why: 'C’est la question qui structure tout l’arbre : le niveau de mesure de la VD détermine la famille de tests possibles. On ne calcule pas une moyenne sur des catégories, et on ne compte pas des fréquences sur des scores.',
  concept: {
    title: 'Variable dépendante et niveaux de mesure',
    body: 'La variable dépendante (VD) est celle qu’on observe et qu’on cherche à expliquer ; la variable indépendante (VI) est celle qui est manipulée ou qui sert à expliquer. Une variable qualitative (nominale) classe en catégories ; une variable quantitative est mesurée sur une échelle numérique (intervalle ou rapport). Le niveau de mesure autorise ou interdit certains calculs.',
  },
  help: {
    title: 'Distinguer qualitative et quantitative',
    body: 'Posez-vous la question : « Est-ce que cela a un sens de calculer la moyenne de cette variable ? » Si oui (âge, score à un test, temps), elle est quantitative. Si non (couleur des yeux, réussite/échec, filière), elle est qualitative. Attention : un code numérique (1 = femme, 2 = homme) ne rend pas une variable quantitative.',
    example: 'Mesurer la note obtenue à l’examen (de 0 à 20) : quantitative. Noter si l’étudiant a validé ou non l’examen : qualitative (deux modalités).',
    tip: 'Une échelle de Likert à plusieurs items sommés est en pratique traitée comme quantitative ; un seul item à 5 niveaux est plutôt ordinal.',
  },
})

// ───────── 2a. Qualitative
add({
  id: 'quali_type',
  type: 'question',
  criterion: 'Nombre de variables',
  icon: 'Layers',
  title: 'Que voulez-vous analyser avec cette variable qualitative ?',
  lead: 'Le nombre de variables impliquées oriente vers le test adapté.',
  options: [
    {
      id: 'une', label: 'Une seule variable', short: 'Une variable',
      desc: 'Comparer la répartition observée dans les catégories à une répartition théorique attendue.',
      icon: 'CircleDot', next: 't_khi2_ajustement',
      excludes: 'Les tests à deux variables (indépendance, McNemar) sont écartés : il n’y a pas de seconde variable à croiser.',
    },
    {
      id: 'deux', label: 'Deux variables qualitatives', short: 'Deux variables',
      desc: 'Étudier le lien entre deux variables catégorielles, ou l’évolution d’une même variable.',
      icon: 'Columns2', next: 'quali_deux',
      excludes: 'Le khi² d’ajustement est écarté (il ne porte que sur une variable) et la régression logistique ne s’impose pas : on ne cherche pas à prédire à partir de prédicteurs.',
    },
    {
      id: 'relation', label: 'Prédire la VD à partir d’un ou plusieurs prédicteurs', short: 'Relation / prédicteurs',
      desc: 'Estimer l’effet de variables (quantitatives ou qualitatives) sur la probabilité d’une catégorie.',
      icon: 'Network', next: 't_regression_logistique',
      excludes: 'Les tests du khi² sont écartés : ils ne permettent pas de contrôler plusieurs prédicteurs ni de modéliser une probabilité.',
    },
  ],
  why: 'Avec une VD qualitative, le choix dépend de ce que vous faites de la variable : la décrire seule, la croiser avec une autre, ou la modéliser à partir de prédicteurs. Chaque cas correspond à un outil différent.',
  concept: {
    title: 'Tableau d’effectifs et tableau de contingence',
    body: 'Une seule variable qualitative se résume par un tableau d’effectifs (combien dans chaque modalité). Deux variables se croisent dans un tableau de contingence : chaque case contient l’effectif d’une combinaison de modalités. Les tests du khi² comparent ces effectifs observés aux effectifs attendus sous une hypothèse.',
  },
  help: {
    title: 'Une variable, deux variables, des prédicteurs ?',
    body: 'Comptez les variables dont vous voulez étudier le lien. Une seule : vous comparez ses fréquences à une référence. Deux : vous croisez deux variables catégorielles. Si votre question est de la forme « quelle part de la réussite s’explique par l’âge, le genre, le temps de travail ? », il s’agit d’une relation avec prédicteurs.',
    example: 'Une : « les étudiants se répartissent-ils également entre trois filières ? ». Deux : « la filière est-elle liée au genre ? ». Prédicteurs : « la réussite dépend-elle du temps de travail et du genre ? ».',
    tip: 'Plusieurs prédicteurs, ou un prédicteur quantitatif : orientez-vous vers la relation.',
  },
})

add({
  id: 'quali_deux',
  type: 'question',
  criterion: 'Relation entre les variables',
  icon: 'GitCompare',
  title: 'S’agit-il de deux variables différentes, ou de la même variable mesurée deux fois ?',
  lead: 'La seconde situation correspond à des mesures répétées sur les mêmes individus.',
  options: [
    {
      id: 'differentes', label: 'Deux variables différentes', short: 'Variables différentes',
      desc: 'Par exemple filière et genre, chacune mesurée une fois sur chaque individu.',
      icon: 'Columns2', next: 't_khi2_independance',
      excludes: 'McNemar est écarté : il suppose la même variable dichotomique mesurée deux fois sur les mêmes personnes.',
    },
    {
      id: 'meme', label: 'La même variable mesurée deux fois', short: 'Même variable, 2 mesures',
      desc: 'Avant/après, ou deux conditions, sur les mêmes personnes, avec une réponse à deux modalités.',
      icon: 'Repeat', next: 't_mcnemar',
      excludes: 'Le khi² d’indépendance est écarté : il exige des observations indépendantes, ce qui n’est pas le cas de mesures répétées sur les mêmes individus.',
    },
  ],
  why: 'Le khi² d’indépendance suppose que chaque individu apparaît une seule fois dans le tableau. Quand les mêmes individus sont mesurés deux fois, les observations sont dépendantes : il faut un test conçu pour des données appariées, McNemar.',
  concept: {
    title: 'Indépendance des observations',
    body: 'Un test classique suppose que chaque observation est indépendante des autres. Des mesures répétées sur la même personne sont corrélées entre elles (une personne qui réussit avant a plus de chances de réussir après). Ignorer cette dépendance fausse les p-values.',
  },
  help: {
    title: 'Mesures répétées ou deux variables ?',
    body: 'Regardez votre tableau de données. Si chaque ligne est une personne et que vous avez deux colonnes qui contiennent la même question posée à deux moments ou dans deux conditions, c’est la même variable mesurée deux fois. Si les deux colonnes sont deux questions différentes (par exemple genre et filière), ce sont deux variables différentes.',
    example: 'Même variable : « Réussit-il à la tâche ? » (oui/non) avant puis après une formation, sur les mêmes 40 personnes. Variables différentes : « filière » et « mode de transport » sur 200 étudiants.',
    tip: 'McNemar s’applique à des variables à deux modalités uniquement.',
  },
})

// ───────── 2b. Quantitative
add({
  id: 'quanti_type',
  type: 'question',
  criterion: 'Type de question',
  icon: 'HelpCircle',
  title: 'Quel type de question de recherche posez-vous ?',
  lead: 'Voulez-vous comparer des groupes ou des conditions, ou étudier le lien entre des variables ?',
  options: [
    {
      id: 'difference', label: 'Une différence', short: 'Différence',
      desc: 'Les scores sont-ils différents entre groupes, ou entre deux moments ? « A obtient-il plus que B ? »',
      icon: 'Scale', next: 'nb_groupes',
      excludes: 'Les corrélations et régressions sont écartées : elles décrivent un lien entre variables, pas une comparaison de groupes.',
    },
    {
      id: 'relation', label: 'Une relation', short: 'Relation',
      desc: 'Existe-t-il un lien entre des variables ? Peut-on prédire l’une à partir de l’autre ?',
      icon: 'TrendingUp', next: 'nb_predicteurs',
      excludes: 'Les tests de comparaison de groupes (Student, Anova, rangs) sont écartés : il n’y a pas de groupes à comparer mais des variables à relier.',
    },
  ],
  why: 'Comparer des groupes et relier des variables sont deux démarches différentes. Dans le premier cas la variable indépendante est catégorielle (les groupes), dans le second elle est généralement numérique.',
  concept: {
    title: 'Différence versus relation',
    body: 'Une question de différence compare la moyenne (ou les rangs) de la VD entre des groupes ou des conditions définis par une variable catégorielle. Une question de relation étudie comment deux variables quantitatives varient ensemble : la corrélation mesure l’intensité du lien, la régression le modélise pour prédire.',
  },
  help: {
    title: 'Différence ou relation ?',
    body: 'Si votre hypothèse peut s’écrire « le groupe A a un score plus élevé que le groupe B » (ou « après > avant »), c’est une différence. Si elle s’écrit « plus X augmente, plus Y augmente (ou diminue) », c’est une relation.',
    example: 'Différence : comparer la note moyenne des étudiants ayant suivi un cours en ligne et en présentiel. Relation : étudier si le temps de révision est lié à la note.',
    tip: 'Une hypothèse avec « plus… plus… » est presque toujours une relation.',
  },
})

add({
  id: 'nb_groupes',
  type: 'question',
  criterion: 'Nombre de groupes',
  icon: 'Users',
  title: 'Combien de groupes (ou de conditions) comparez-vous ?',
  lead: 'Comptez les modalités de votre variable indépendante : groupes distincts, ou moments de mesure.',
  options: [
    {
      id: 'deux', label: 'Deux', short: '2 groupes',
      desc: 'Deux groupes, ou deux mesures (avant/après, condition A/B).',
      icon: 'Split', next: 'rel_ech_2',
      excludes: 'Les tests à plus de deux groupes (Anova, Kruskal-Wallis, Friedman) sont écartés.',
    },
    {
      id: 'plusieurs', label: 'Plusieurs (trois ou plus)', short: '3 groupes ou plus',
      desc: 'Trois groupes ou plus, ou trois mesures et plus.',
      icon: 'Boxes', next: 'rel_ech_n',
      excludes: 'Les tests de Student, Mann-Whitney et Wilcoxon sont écartés : ils ne comparent que deux conditions.',
    },
  ],
  why: 'Les tests à deux groupes ne se généralisent pas en multipliant les comparaisons deux à deux : répéter plusieurs tests fait exploser le risque d’erreur de type I. Pour trois groupes ou plus, on utilise un test global (Anova ou équivalent par les rangs).',
  concept: {
    title: 'Inflation du risque alpha',
    body: 'À chaque test au seuil .05, on accepte 5 % de risque de faux positif. Avec 3 groupes, il y a 3 comparaisons deux à deux : le risque cumulé monte à environ 14 %. L’Anova teste d’abord l’ensemble avec un seul test, puis des comparaisons post-hoc corrigées précisent où se trouvent les différences.',
  },
  help: {
    title: 'Compter les groupes ou les conditions',
    body: 'Un « groupe » correspond à une modalité de la variable qui définit vos conditions. Les mesures répétées comptent aussi : une même personne mesurée trois fois donne trois conditions, même s’il n’y a qu’un seul groupe de personnes.',
    example: 'Deux : groupe témoin et groupe expérimental. Plusieurs : méthode A, méthode B, méthode C ; ou le même groupe mesuré en septembre, janvier et juin.',
    tip: 'Ne comptez pas les participants, comptez les modalités de la variable de comparaison.',
  },
})

add({
  id: 'rel_ech_2',
  type: 'question',
  criterion: 'Relation entre échantillons',
  icon: 'Link2',
  title: 'Les deux échantillons sont-ils indépendants ou appariés ?',
  lead: 'Il s’agit de savoir si les mêmes individus (ou des individus liés) se retrouvent dans les deux conditions.',
  options: [
    {
      id: 'ind', label: 'Indépendants', short: 'Indépendants',
      desc: 'Des personnes différentes dans chaque groupe, sans lien entre elles.',
      icon: 'Unlink', next: 'param_2ind',
      excludes: 'Les tests pour échantillons appariés (Student apparié, Wilcoxon) sont écartés.',
    },
    {
      id: 'app', label: 'Appariés', short: 'Appariés',
      desc: 'Les mêmes personnes mesurées deux fois, ou des paires (jumeaux, couples, binômes appariés).',
      icon: 'Link2', next: 'param_2app',
      excludes: 'Les tests pour échantillons indépendants (Student indépendant, Mann-Whitney) sont écartés : ils ignoreraient la corrélation entre les deux mesures.',
    },
  ],
  why: 'Des mesures appariées sont corrélées : une personne forte avant le sera sans doute encore après. Un test pour échantillons appariés exploite cette information en travaillant sur les différences intra-individuelles, ce qui retire la variabilité entre individus et augmente la puissance.',
  concept: {
    title: 'Échantillons indépendants et appariés',
    body: 'Indépendants (inter-sujets) : chaque participant appartient à un seul groupe. Appariés (intra-sujets, mesures répétées) : chaque participant passe toutes les conditions, ou chaque observation d’un groupe est associée à une observation de l’autre. Le choix change la structure de l’erreur et donc le test.',
  },
  help: {
    title: 'Indépendants ou appariés ?',
    body: 'Demandez-vous : « Si je connais le score d’une personne dans la première condition, cela m’apprend-il quelque chose sur son score dans la seconde ? » Si oui parce qu’il s’agit de la même personne ou d’une paire liée, les échantillons sont appariés. Si les participants sont tous différents et tirés séparément, ils sont indépendants.',
    example: 'Indépendants : 30 élèves de la classe A et 30 élèves de la classe B. Appariés : 30 élèves testés en septembre puis de nouveau en juin.',
    tip: 'Un plan en pré-test / post-test sur les mêmes personnes est toujours apparié.',
  },
})

add(paramQuestion('param_2ind', {
  subject: 'la variable mesurée dans chacun des deux groupes (normalité dans chaque groupe, variances proches)',
  yes: 't_student_ind', no: 't_mann_whitney',
  excludesYes: 'Mann-Whitney est écarté : sous normalité, Student est plus puissant.',
  excludesNo: 'Student est écarté : sans normalité (ou avec des rangs), la comparaison des moyennes n’est pas fiable ; on compare les rangs avec Mann-Whitney.',
  why: 'Les deux tests répondent à la même question (les deux groupes diffèrent-ils ?) mais Student compare des moyennes sous hypothèse de normalité, alors que Mann-Whitney compare des rangs sans cette hypothèse.',
}))

add(paramQuestion('param_2app', {
  subject: 'les différences entre les deux mesures de chaque individu (leur distribution doit être à peu près normale)',
  yes: 't_student_app', no: 't_wilcoxon',
  excludesYes: 'Wilcoxon est écarté : si les différences sont normales, Student apparié est plus puissant.',
  excludesNo: 'Student apparié est écarté : sans différences normales, la moyenne des écarts n’est pas un bon résumé ; Wilcoxon travaille sur les rangs des écarts.',
  why: 'Pour des données appariées, la normalité se vérifie sur les différences individuelles (après − avant), pas sur chaque mesure séparément. C’est l’hypothèse sur laquelle repose le t apparié.',
}))

add({
  id: 'rel_ech_n',
  type: 'question',
  criterion: 'Relation entre échantillons',
  icon: 'Link2',
  title: 'Les échantillons sont-ils indépendants ou appariés ?',
  lead: 'Chaque personne est-elle dans un seul groupe, ou mesurée dans toutes les conditions ?',
  options: [
    {
      id: 'ind', label: 'Indépendants', short: 'Indépendants',
      desc: 'Des personnes différentes dans chaque groupe.',
      icon: 'Unlink', next: 'nb_vi_ind',
      excludes: 'Les Anova et tests pour mesures répétées (Anova appariée, Friedman) sont écartés.',
    },
    {
      id: 'app', label: 'Appariés (mesures répétées)', short: 'Appariés',
      desc: 'Les mêmes personnes passent toutes les conditions, ou sont mesurées à plusieurs moments.',
      icon: 'Repeat', next: 'nb_vi_app',
      excludes: 'Les tests pour groupes indépendants (Anova inter-sujets, Kruskal-Wallis) sont écartés : ils ignoreraient la corrélation entre les mesures d’une même personne.',
    },
  ],
  why: 'Comme pour deux groupes, la nature de la relation entre échantillons détermine la structure de l’erreur : variance entre groupes de personnes différentes, ou variance intra-individuelle pour des mesures répétées.',
  concept: {
    title: 'Plan inter-sujets et plan intra-sujets',
    body: 'Dans un plan inter-sujets, la variable indépendante sépare des groupes de personnes. Dans un plan intra-sujets, chaque personne passe toutes les modalités. Les plans intra-sujets sont plus puissants (chaque personne est son propre témoin) mais exigent des conditions supplémentaires, comme la sphéricité pour l’Anova appariée.',
  },
  help: {
    title: 'Plan indépendant ou apparié pour 3 conditions et plus',
    body: 'Regardez comment les données sont organisées. Une colonne par condition avec une ligne par personne : plan apparié. Une seule colonne de scores accompagnée d’une colonne indiquant le groupe de la personne : plan indépendant.',
    example: 'Indépendants : trois groupes d’étudiants suivent chacun une méthode différente. Appariés : les mêmes étudiants sont évalués en début, milieu et fin de semestre.',
    tip: 'Si un même participant apparaît plusieurs fois dans le fichier, le plan est apparié.',
  },
})

add({
  id: 'nb_vi_ind',
  type: 'question',
  criterion: 'Nombre de variables indépendantes',
  icon: 'Layers',
  title: 'Combien de variables indépendantes (facteurs) manipulez-vous ?',
  lead: 'Un facteur = une variable qui définit les groupes. Deux facteurs croisés (par exemple méthode × genre) donnent un plan factoriel.',
  options: [
    {
      id: 'une', label: 'Une seule', short: '1 facteur',
      desc: 'Un seul critère définit les groupes (par exemple la méthode d’enseignement).',
      icon: 'Layers', next: 'param_nind',
      excludes: 'L’Anova multifactorielle est écartée : il n’y a pas de second facteur ni d’interaction à estimer.',
    },
    {
      id: 'plusieurs', label: 'Plusieurs', short: '2 facteurs ou plus',
      desc: 'Deux critères ou plus sont croisés (méthode × genre, dose × âge…).',
      icon: 'LayoutGrid', next: 't_anova_multi_ind',
      excludes: 'L’Anova à un facteur et Kruskal-Wallis sont écartés : ils ne peuvent pas étudier l’effet de chaque facteur et leur interaction.',
    },
  ],
  why: 'Avec plusieurs facteurs, l’intérêt est d’estimer l’effet de chacun mais aussi leur interaction : l’effet d’un facteur change-t-il selon le niveau de l’autre ? Une Anova à un facteur ne le permet pas.',
  concept: {
    title: 'Facteur, modalités et interaction',
    body: 'Un facteur est une variable indépendante catégorielle ; ses modalités sont ses niveaux. Un plan 2 × 3 croise un facteur à 2 modalités et un facteur à 3 modalités. L’interaction signifie que l’effet d’un facteur dépend du niveau de l’autre facteur.',
  },
  help: {
    title: 'Combien de facteurs ?',
    body: 'Listez les variables qui définissent vos groupes. Si vos participants sont répartis selon un seul critère, il y a un facteur. S’ils sont répartis selon deux critères combinés (par exemple deux méthodes pour chaque genre), il y a deux facteurs.',
    example: 'Un facteur : trois méthodes de lecture. Deux facteurs : trois méthodes de lecture × deux niveaux scolaires (6 groupes).',
    tip: 'Une covariable continue ne compte pas comme un facteur : c’est une extension de l’Anova (Ancova).',
  },
})

add({
  id: 'nb_vi_app',
  type: 'question',
  criterion: 'Nombre de variables indépendantes',
  icon: 'Layers',
  title: 'Combien de variables indépendantes (facteurs) manipulez-vous ?',
  lead: 'Un facteur intra-sujets (le temps, la condition…) ou plusieurs facteurs croisés.',
  options: [
    {
      id: 'une', label: 'Une seule', short: '1 facteur',
      desc: 'Un seul facteur répété, par exemple le temps de mesure.',
      icon: 'Layers', next: 'param_napp',
      excludes: 'L’Anova multifactorielle est écartée : il n’y a pas d’interaction entre facteurs à estimer.',
    },
    {
      id: 'plusieurs', label: 'Plusieurs', short: '2 facteurs ou plus',
      desc: 'Plusieurs facteurs répétés, ou un facteur répété et un facteur de groupe (plan mixte).',
      icon: 'LayoutGrid', next: 't_anova_multi_app',
      excludes: 'L’Anova à un facteur appariée et Friedman sont écartés : ils ne traitent qu’un seul facteur à la fois.',
    },
  ],
  why: 'Dès qu’un second facteur entre en jeu (un facteur de groupe, ou une seconde condition répétée), on veut savoir si les effets se combinent : on passe à l’Anova multifactorielle (avec mesures répétées ou plan mixte).',
  concept: {
    title: 'Plan mixte',
    body: 'Un plan mixte combine au moins un facteur intra-sujets (mesures répétées) et au moins un facteur inter-sujets (groupes). C’est très courant : par exemple un groupe expérimental et un groupe témoin mesurés avant et après une intervention.',
  },
  help: {
    title: 'Un ou plusieurs facteurs répétés ?',
    body: 'Un seul facteur : tous vos scores correspondent à des niveaux d’une même variable (le temps, ou la condition). Plusieurs : vous croisez plusieurs variables (par exemple le temps et la difficulté de la tâche), ou vous ajoutez une variable de groupe.',
    example: 'Un facteur : score à T1, T2, T3. Deux : score à T1, T2, T3 dans chacun de deux groupes (groupe × temps).',
    tip: 'Pré/post avec groupe témoin = deux facteurs (groupe × temps) : Anova mixte.',
  },
})

add(paramQuestion('param_nind', {
  subject: 'la VD dans chaque groupe (normalité des résidus, homogénéité des variances entre groupes)',
  yes: 't_anova1_ind', no: 't_kruskal',
  excludesYes: 'Kruskal-Wallis est écarté : sous les conditions de l’Anova, celle-ci est plus puissante.',
  excludesNo: 'L’Anova est écartée : sans normalité ni variances homogènes, ses p-values ne sont plus fiables ; Kruskal-Wallis compare les rangs.',
  why: 'L’Anova à un facteur suppose la normalité des résidus et l’homogénéité des variances (homoscédasticité). Kruskal-Wallis ne demande que des distributions de forme comparable.',
}))

add(paramQuestion('param_napp', {
  subject: 'la VD à chaque mesure (normalité et sphéricité : variances des différences entre mesures égales)',
  yes: 't_anova1_app', no: 't_friedman',
  excludesYes: 'Friedman est écarté : sous normalité et sphéricité, l’Anova à mesures répétées est plus puissante.',
  excludesNo: 'L’Anova appariée est écartée : sans normalité, ou avec une sphéricité très violée, Friedman (sur les rangs intra-individuels) est préférable.',
  why: 'L’Anova à mesures répétées exige la normalité et la sphéricité (égalité des variances des différences entre toutes les paires de mesures). Friedman utilise les rangs à l’intérieur de chaque individu.',
}))

add({
  id: 'nb_predicteurs',
  type: 'question',
  criterion: 'Nombre de prédicteurs',
  icon: 'Network',
  title: 'Combien de variables prédictrices utilisez-vous ?',
  lead: 'Le prédicteur est la variable qui sert à expliquer ou prédire la VD.',
  options: [
    {
      id: 'un', label: 'Un seul', short: '1 prédicteur',
      desc: 'Un lien entre deux variables : la VD et un prédicteur.',
      icon: 'ArrowRightLeft', next: 'mesure',
      excludes: 'La régression multiple est écartée : elle sert à combiner plusieurs prédicteurs.',
    },
    {
      id: 'plusieurs', label: 'Plusieurs', short: 'Plusieurs prédicteurs',
      desc: 'Plusieurs variables explicatives simultanément (temps de travail, motivation, niveau initial…).',
      icon: 'Network', next: 't_regression_multiple',
      excludes: 'Les corrélations et la régression simple sont écartées : elles ne contrôlent pas l’effet des autres variables.',
    },
  ],
  why: 'Avec un prédicteur, on étudie un lien simple (corrélation ou régression simple). Avec plusieurs, on veut l’effet propre de chacun, toutes choses égales par ailleurs : c’est la régression multiple.',
  concept: {
    title: 'Effet « toutes choses égales par ailleurs »',
    body: 'En régression multiple, le coefficient d’un prédicteur mesure son effet sur la VD lorsque les autres prédicteurs sont maintenus constants. Cela permet de séparer des influences qui se chevauchent, et d’évaluer la part de variance expliquée globalement (R²).',
  },
  help: {
    title: 'Combien de prédicteurs ?',
    body: 'Comptez les variables que vous utilisez pour expliquer la VD. Seulement une ? Alors un test simple suffit. Plusieurs en même temps ? Il vous faut un modèle qui les prend en compte conjointement.',
    example: 'Un prédicteur : expliquer la note par le nombre d’heures de révision. Plusieurs : expliquer la note par les heures de révision, le sommeil et le niveau initial.',
    tip: 'N’ajoutez pas de prédicteurs au hasard : prévoyez au moins une dizaine d’observations par prédicteur.',
  },
})

add({
  id: 'mesure',
  type: 'question',
  criterion: 'Type de mesure',
  icon: 'Ruler',
  title: 'Quel est le type de mesure de vos deux variables ?',
  lead: 'Les valeurs sont-elles de vraies mesures continues, ou plutôt des rangs (ordre) ?',
  options: [
    {
      id: 'continue', label: 'Continue (intervalle ou rapport)', short: 'Continue',
      desc: 'Des valeurs numériques où les écarts ont un sens : score, taille, temps, montant.',
      icon: 'Activity', next: 'interet',
      excludes: 'La corrélation de Spearman est écartée au profit de Pearson, plus puissante pour des variables continues liées linéairement.',
    },
    {
      id: 'rang', label: 'Rang (ordinale)', short: 'Rang',
      desc: 'Un classement, une échelle ordinale, ou une relation monotone mais non linéaire.',
      icon: 'ListOrdered', next: 't_spearman',
      excludes: 'Pearson et la régression sont écartés : ils supposent des valeurs numériques à intervalles égaux et un lien linéaire.',
    },
  ],
  why: 'Pearson utilise les valeurs numériques elles-mêmes et suppose un lien linéaire. Si les données sont des rangs ou si le lien est seulement monotone, Spearman (qui travaille sur les rangs) est plus approprié.',
  concept: {
    title: 'Mesure continue, ordinale et relation monotone',
    body: 'Une relation linéaire a la forme d’une droite. Une relation monotone va toujours dans le même sens (elle croît ou décroît) sans forcément former une droite. Spearman détecte les relations monotones car il remplace les valeurs par leurs rangs ; il est aussi peu sensible aux valeurs extrêmes.',
  },
  help: {
    title: 'Continue ou rang ?',
    body: 'Les écarts entre valeurs ont-ils un sens ? Entre 12 et 14 minutes, comme entre 14 et 16 : oui, c’est continu. Entre « plutôt d’accord » et « tout à fait d’accord » : on ne sait pas, c’est ordinal. Un classement (1er, 2e, 3e) est un rang.',
    example: 'Continue : temps de révision en heures et note sur 20. Rang : classement des candidats par deux jurys.',
    tip: 'Des variables continues avec des valeurs aberrantes ou un lien courbe mais croissant : Spearman est un bon choix.',
  },
})

add({
  id: 'interet',
  type: 'question',
  criterion: 'Intérêt primaire',
  icon: 'Crosshair',
  title: 'Quel est votre intérêt principal ?',
  lead: 'Mesurer l’intensité du lien, ou modéliser la forme de la relation pour prédire ?',
  options: [
    {
      id: 'degre', label: 'Le degré de relation', short: 'Degré de relation',
      desc: 'À quel point les deux variables varient-elles ensemble ? Un coefficient entre −1 et +1.',
      icon: 'Gauge', next: 't_pearson',
      excludes: 'La régression est écartée : on ne cherche pas d’équation de prédiction.',
    },
    {
      id: 'forme', label: 'La forme de la relation', short: 'Forme de relation',
      desc: 'Quelle équation relie les variables ? De combien la VD change-t-elle quand le prédicteur augmente d’une unité ?',
      icon: 'LineChart', next: 't_regression',
      excludes: 'La corrélation seule est écartée : elle ne fournit ni pente, ni équation de prédiction, ni valeurs prédites.',
    },
  ],
  why: 'La corrélation de Pearson et la régression simple reposent sur les mêmes calculs, mais répondent à deux questions : « quelle est la force du lien ? » (r) et « quelle droite décrit le lien, et que prédit-elle ? » (pente et ordonnée).',
  concept: {
    title: 'Corrélation et régression',
    body: 'La corrélation r est symétrique (X et Y jouent le même rôle) et sans unité. La régression est asymétrique : on distingue un prédicteur X et une variable à expliquer Y, et on estime Y = a + bX + erreur. Le carré de r est la part de variance de Y expliquée par X.',
  },
  help: {
    title: 'Degré ou forme de relation ?',
    body: 'Si vous voulez dire « les deux variables sont fortement liées », c’est le degré. Si vous voulez dire « pour chaque heure de plus, la note augmente de 0,8 point » ou prédire une valeur, c’est la forme.',
    example: 'Degré : r = .62 entre l’anxiété et la performance. Forme : performance = 14 − 0,4 × anxiété.',
    tip: 'Dans le doute, la régression donne aussi r² : elle contient davantage d’information.',
  },
})

// ───────── Feuilles
const leaf = (id, test, variant) => add({ id, type: 'leaf', test, variant })
leaf('t_khi2_ajustement', 'khi2_ajustement')
leaf('t_khi2_independance', 'khi2_independance')
leaf('t_mcnemar', 'mcnemar')
leaf('t_regression_logistique', 'regression_logistique')
leaf('t_student_ind', 'student_ind')
leaf('t_mann_whitney', 'mann_whitney')
leaf('t_student_app', 'student_app')
leaf('t_wilcoxon', 'wilcoxon')
leaf('t_anova1_ind', 'anova1_ind')
leaf('t_kruskal', 'kruskal')
leaf('t_anova1_app', 'anova1_app')
leaf('t_friedman', 'friedman')
leaf('t_anova_multi_ind', 'anova_multi', 'Groupes indépendants : Anova factorielle inter-sujets.')
leaf('t_anova_multi_app', 'anova_multi', 'Mesures répétées : Anova à mesures répétées multifactorielle (ou plan mixte).')
leaf('t_pearson', 'pearson')
leaf('t_spearman', 'spearman')
leaf('t_regression', 'regression')
leaf('t_regression_multiple', 'regression_multiple')

export const TREE = { root: 'vd', nodes }

// ───────── Utilitaires
const memoTests = {}
export function reachableTests(nodeId) {
  if (memoTests[nodeId]) return memoTests[nodeId]
  const n = nodes[nodeId]
  let res
  if (n.type === 'leaf') res = [n.test]
  else {
    const s = new Set()
    n.options.forEach((o) => reachableTests(o.next).forEach((t) => s.add(t)))
    res = [...s]
  }
  memoTests[nodeId] = res
  return res
}
const memoDepth = {}
export function minDepth(nodeId) {
  if (memoDepth[nodeId] !== undefined) return memoDepth[nodeId]
  const n = nodes[nodeId]
  const d = n.type === 'leaf' ? 0 : 1 + Math.min(...n.options.map((o) => minDepth(o.next)))
  memoDepth[nodeId] = d
  return d
}
const memoMax = {}
export function maxDepth(nodeId) {
  if (memoMax[nodeId] !== undefined) return memoMax[nodeId]
  const n = nodes[nodeId]
  const d = n.type === 'leaf' ? 0 : 1 + Math.max(...n.options.map((o) => maxDepth(o.next)))
  memoMax[nodeId] = d
  return d
}
export const ALL_TESTS = reachableTests(TREE.root)
