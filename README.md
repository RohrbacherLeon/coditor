# Coditor

Cette application permettra à des étudiants de réaliser des exercices proposés par des enseignants, de façon à s’améliorer en programmation mais également à s’auto-évaluer grâce à un retour automatique et rapide de leur travail.

## Installation

Pour une installation locale de développement, créer un fichier ".env" et y insérer "DB_HOST=localhost".

```sh
npm install
```

```sh
npm run sass
```

```sh
npm start
```

## Installation avec docker
```sh
make install 
```

```sh
make run 
```

## Comptes utilisateurs

Un compte étudiant est disponible avec les informations suivantes :
    email : a@a.fr 
    password: a

Un compte professeur est disponible avec les informations suivantes :
    email : teacher@teacher.fr
    password: teacher

## URLs

/profile/create-exercise => create exercise (should be login with teacher accoune)

## Auteurs
* **CORDIER Florian**
* **ROHRBACHER Léon**
* **RALLI Alexandre**
* **ZINK Anthony**
