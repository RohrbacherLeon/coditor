/* eslint-disable no-undef */
db.users.insert({
    "type": "teacher",
    "account": "local",
    "profile": {
        "password": "$2a$10$LFXI9azx6IeVOpQ4mBJqCuGnvWoxMCNLcKyqDUhk5xByU9IPQ2wVm",
        "first_name": "anthony",
        "last_name": "zink",
        "email": "test@test.fr"
    },
    "urlImage": "/images/iconLocal.png"
});
db.exercises.insert({
    "stats": {
        "fails": 0,
        "success": 0
    },
    "awaited": {
        "titles": [ "la fonction doit être définie", "une fonction est attendue", "la fonction doit avoir deux arguments", "3-1", "6-6" ]
    },
    "tags": [ "function" ],
    "title": "soustraction",
    "slug": "soustraction",
    "language": "js",
    "author": "test@test.fr",
    "description": "## Soustraction\r\n\r\nEcrire une fonction nommée *sub* qui soustrait deux nombres."
});

db.exercises.insert({
     "stats": {
        "fails": 0,
        "success": 0
    },
    "awaited": {
        "titles": [ "la methode soustrait", "fausse methode" ]
    },
    "tags": [ "function" ],
    "title": "addition",
    "slug": "addition",
    "language": "php",
    "author": "test@test.fr",
    "description": "## Addition\r\n\r\nEcrire une fonction nommée *add* qui additionne deux nombres."
});