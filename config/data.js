/* eslint-disable no-undef */
db.users.insert({
    "score": {
        "total": 0,
        "langs": {
            "js": 0,
            "php": 0
        }
    },
    "type": "teacher",
    "account": "local",
    "profile": {
        "password": "$2a$10$WqPHQBZwYrgLU28.HKCx9uXcA/qnunG.9ixQbTulJC6wqmKve75sm",
        "first_name": "Tournesol",
        "last_name": "professeur",
        "email": "teacher@teacher.fr"
    },
    "pending": false,
    "urlImage": "/images/iconLocal.png"
});

db.users.insert({
    "score": {
        "total": 0,
        "langs": {
            "js": 0,
            "php": 0
        }
    },
    "type": "teacher",
    "account": "local",
    "profile": {
        "password": "$2a$10$WqPHQBZwYrgLU28.HKCx9uXcA/qnunG.9ixQbTulJC6wqmKve75sm",
        "first_name": "teacher",
        "last_name": "teacher",
        "email": "prof@prof.fr"
    },
    "pending": true,
    "urlImage": "/images/iconLocal.png"
});

db.users.insert({
    "type": "admin",
    "account": "local",
    "profile": {
        "password": "$2a$10$ILZz2SZXeYkBamjqsSpgS.rY3gtewf6paFxWSzjCJolCFMQJOr3Fi",
        "first_name": "admin",
        "last_name": "admin",
        "email": "admin@admin.fr"
    },
    "urlImage": "/images/iconLocal.png",
    "score": {
        "total": 0,
        "langs": {}
    }
});

db.users.insert({
    "type": "student",
    "account": "local",
    "profile": {
        "password": "$2a$10$Y13Lqgk958jTlDlD.46DfunfUnswI2p1oCL5wxcF3Ck5mIsHCDceC",
        "first_name": "student",
        "last_name": "student",
        "email": "student@student.fr"
    },
    "urlImage": "/images/iconLocal.png",
    "score": {
        "total": 0,
        "langs": {}
    }
});

// Insére exercice JS
db.exercises.insert({
    "stats": {
        "fails": 0,
        "success": 0
    },
    "awaited": {
        "titles": ["la fonction doit être définie", "une fonction est attendue", "la fonction doit avoir deux arguments", "3-1", "6-6"]
    },
    "tags": ["function"],
    "title": "soustraction",
    "slug": "soustraction",
    "language": "js",
    "author": "teacher@teacher.fr",
    "description": "## Soustraction\r\n\r\nEcrire une fonction nommée *sub* qui soustrait deux nombres.",
    "hasSucceeded": []
});

// Insére exercice PHP
db.exercises.insert({
    "stats": {
        "fails": 2,
        "success": 0,
        "hasSucceeded": [ ]
    },
    "awaited": {
        "titles": [ "filtre tab" ]
    },
    "tags": [ "filtre", "tableau", "fonction" ],
    "inSets": [ ],
    "title": "Filtrer un tableau",
    "slug": "filtrer-un-tableau",
    "language": "php",
    "author": "teacher@teacher.fr",
    "description": "Ecrire une fonction qui filtre un tableau donné en paramètre. La fonction doit se nommer *filtretab*."
});

db.exercises.insert({
    "stats": {
        "fails": 0,
        "success": 1,
        "hasSucceeded": [ ]
    },
    "awaited": {
        "titles": [ "somme tab" ]
    },
    "tags": [ "fonction", "somme" ],
    "inSets": [ ],
    "title": "Calculer la somme d'un tableau",
    "slug": "calculer-la-somme-dun-tableau",
    "language": "php",
    "author": "teacher@teacher.fr",
    "description": "Calculer la somme d'un tableau passé en paramètre de la fonction nommée *sommetab*."
});

db.exercises.insert({
    "stats": {
        "fails": 0,
        "success": 0,
        "hasSucceeded": [ ]
    },
    "awaited": {
        "titles": [ "factoriel" ]
    },
    "tags": [ "fonction" ],
    "inSets": [ ],
    "title": "Factoriel",
    "slug": "factoriel",
    "language": "php",
    "author": "teacher@teacher.fr",
    "description": "Ecrire une fonction factorielle d'un nombre nommée *factoriel*."
});

db.exercises.insert({
    "stats": {
        "fails": 3,
        "success": 1,
        "hasSucceeded": [ "student@student.fr" ]
    },
    "awaited": {
        "titles": [ "factoriel" ]
    },
    "tags": [ "la methode additionne" ],
    "inSets": [ ],
    "title": "Addition",
    "slug": "addition",
    "language": "php",
    "author": "teacher@teacher.fr",
    "description": "Ecrire une fonction d'addition d'un nombre nommée *add*."
});