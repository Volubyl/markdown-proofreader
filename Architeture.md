# Architecture et post-mortem



Ce projet est une première tentative d'organisation d'un projet en suivant les préceptes de l'**architecture hexagonale**.

L'organisation du projet se base fortement sur l'article *Architecture Hexagonale : trois principes et un exemple d’implémentation*   disponible sur le blog [d'OCTO](https://blog.octo.com/architecture-hexagonale-trois-principes-et-un-exemple-dimplementation/).

## Objectifs

L'implémentation proposée dans cet article à été faite en Orienté Objet et en C#. Pour ma part, j'avais envie d'essayer de l'implémenter en TypeScript en ayant une approche orientée programmation fonctionnelle.

Tant qu'à faire et juste pour le fun, je voulais aussi utiliser la librairie [Ramda](https://ramdajs.com/) pour avoir un point de comparaison avec Lodash FP.

## Quel est le domaine de l'application ? A quoi sert-elle ?

Le but de l'application est de permettre à un utilisateur d'obtenir une correction grammaticale et orthographique de textes.

Dans cette implémentation, la correction sera présentée sous forme d'un `rapport` qui sera affichable dans la console. Le contenu à corrigé provient de fichiers markdown ou de contenu markdown provenant des diff des commits.

Ce rapport est obtenu via un service de correction tiers. Pour le moment, l'application utilise  [`GrammarBot`](https://www.grammarbot.io/).

Que ce soit l'obtention de contenu, le mode d'affichage ou bien le service tiers sont juste des détails d'implémentation. Je souhaitais que ceux-ci soient facilement modifiables et remplaçables au profit d'autres.

## Implémentation



![](./assets/md-proofreader-vue-ensemble.png)

### Domaine

La partie domaine de l'application expose une fonction qui permet de générer un rapport. Cette fonction est la fonction principale du domaine.

Cependant, cette fonction doit rester le plus possible ignorante de comment est obtenu le contenu. De  même, le domaine doit rester aussi ignorant d'où et de comment sont obtenu les corrections orthographiques et grammaticales.

Pour réaliser ceci, il était plus simple, pour moi, de travailler en *injection de dépendance*.

Cela veut dire fournir en argument de la fonction principale du domaine des fonctions qui permette l'obtention des éléments nécessaire  au fonctionnement de celle-ci.

De cette manière, pour faire fonctionner la fonction principale on devra lui fournir en argument deux autres fonctions :

- une pour l’obtention des données de correction
- une autre pour l'obtention du contenu a corriger.

Petit détail pratique : il est aussi possible de fournir un glob comme argument à la fonction principale.  Ceci afin de permettre à l'utilisateur de choisir avec plus de précision quels fichiers ils souhaite corrigé.

Un avantage de l'injection de dépendance est que la fonction principale du domaine est une fonction pure facile à tester unitairement.

#### Des interfaces et des types

Dans l'exemple d'Octo,  des interfaces définissent la frontière entre le `domain`, le `user-side` et `server-side` . Ces interfaces constituent un contrat entre différents éléments du code qui permettent de dire "si tu veux communiquer avec moi, il faut que toi soit conforme à ceci".

Dans l'arsenal de la programmation fonctionnelle, il n'y a pas d'interface. Cependant, il y a des types qui peuvent aussi agir de contrat.

Dans le cas de l'application et grâce à TypeScript, chaque fonction utilisée en argument de la fonction  principale doit respecter un type défini.

### Server-Side

La partie `server-side` contient les implémentations concrètes des fonctions qui seront passées en argument de la fonction principale du domaine.

On y retrouvera donc toutes les fonctions qui permettent d'obtenir du contenu à corriger, ainsi que celle pour obtenir les corrections.

Remarque : certaines fonctions sont aussi écrites en injection de dépendance. Ici l'objectif est de créer des fonctions facilement composable mais surtout de faciliter les tests unitaires. 

D'un avis personnel, je ne suis pas un grand fan de l'utilisation de mock pour éviter les sides-effects dans les tests. Je préfère, isoler dans des fonctions les éléments de code qui les produisent et ensuite les passer en argument. 

Ainsi,  lors des tests unitaires, il m'est possible de créer des fonctions "bêtes et méchantes " dont j'ai "contrôle" et les passer à la fonction que je souhaite tester.



### User-Side

Même principe que pour le server-side. La seule différence c'est que les fonctions principales recevront en argument le résultat de la génération du rapport produit par la fonction principale du domaine.



## Un peu d'(auto)critique et quelques questions

Comme je le disait en préambule, ce projet est une première pour moi avec l'architecture hexagonale. Je pense qu'actuellement j'entrevois juste un petit peu le potentiel de cette architecture.

J'aime beaucoup l'idée de faire en sorte que le code soit plus modulaire et que la partie "métier" soit isolée des détails techniques tels que les appels http etc..

### Difficile de cerner le "domaine"

Dans mon cas, il m'a été difficile de trouver ce qu'était mon "domaine". J'ai réfléchi par élimination en me disant que ce n'était pas la vérification orthographique et grammaticale vu que cette partie était gérée par un service tiers. Ce n'est pas non plus l'obtention du contenu à corriger car à mes yeux cela constitue plus un "détail technique".

Au final ce qui me reste est le lien entre tout cela. C'est cette couche qui permet de transformer des sources de données en un format qui pourra être affichée de différentes manières et de garantir que les éléments en charge de l'affichage  reçoivent le bon format.

### Possibilité d'extension

Avec cette organisation, j'ai l'impression qu'il va être d'étendre l'application. Imaginons que je souhaite afficher le rapport dans une page web, il suffira d'ajouter du code dans la partie `user-side` pour afficher le rapport dans du HTML. Imaginons que les données à corriger proviennent d'une DB, il suffira de rajouter une fonction qui implémentera le type attendu par le domaine, etc ...

### Un problème de nom

Pour le moment, le code utilise la notion de `server-side` , `user-side`, et de  `domain`. Ces termes sont repris du blog d'Octo. Dans cet article de blog, on parle aussi de ports et d'adapter. Je n'ai pas réussi à bien comprendre quels éléments dans le code pouvaient être nommé ainsi. Est-ce que ce sont les types, les fonctions en elles-même ?

## Conclusion

Je pense que ce projet est un bon projet qui fonctionne. Je pense qu'il va être affiné au fil du temps et au fur et à mesure que mes connaissances en FP et en architecture hexagonale s’approfondiront.

