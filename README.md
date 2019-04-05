# Coditor

Cette application permettra à des étudiants de réaliser des exercices proposés par des enseignants, de façon à s’améliorer en programmation mais également à s’auto-évaluer grâce à un retour automatique et rapide de leur travail.

Vous pouvez trouver ci-dessous notre site de présentation du projet :  
https://webetu.iutnc.univ-lorraine.fr/~rohrbac12u/coditor_presentation/wordpress/

## Tester l’application

Docker & make sont requis sur votre machine. Nous vous recommandons donc fortement d’exécuter l’application dans un environnement Linux ou MacOS.

## Configuration
Pour configurer le serveur NodeJS, un fichier d’environnement est disponible. Il faut renommer le fichier example.env en .env et compléter les variables qui vous intéresse.

La base de données a, par défaut, le nom de coditor. Pour changer cela il suffit de faire :
```
# Server
APP_PORT=

# Database
DB_HOST=
DB_DATABASE=DbName
```

Il en va de même pour le port de l’application est l’hôte de la base de données.

## Installation
Pour lancer l’application, il faut utiliser les commandes :

`make install`

Cette commande sert à installer les dépendances du projet, à construire les images docker utilisées pour l’exécution des exercices et enfin à lancer le conteneur de la base de données MongoDB.

`make run`

Cette commande compile les fichiers sass en css puis lance le serveur NodeJS.

Lancez votre navigateur favori et rendez vous sur l’adresse : http://localhost:3000 (3000 étant le port par défaut).

Pour poursuivre, vous pouvez naviguer sans être connecté. Cependant pour accéder à plus de fonctionnalités, inscrivez vous via l’application pour disposer d’un compte étudiant ou utilisez les comptes suivant :

## Comptes

**étudiant** : Login : student@student.fr; Password : student

**enseignant** : Login : teacher@teacher.fr; Password : teacher

**administrateur** : Login : admin@admin.fr; Password : admin


## Auteurs
* **CORDIER Florian**
* **ROHRBACHER Léon**
* **RALLI Alexandre**
* **ZINK Anthony**
