db.users.insert({ "local": { "type": "teacher", "first_name": "teacher", "last_name": "teacher", "email": "teacher@teacher.fr", "password": "$2a$10$yYC5Trng9sjNr7mAo2cWuOwC7gE.Y0LGwXGgf4sxxItp7DsMgJQAC" }, "urlImage": "../images/iconLocal.png" });
db.users.insert({ "local": { "type": "student", "first_name": "ab", "last_name": "a", "email": "a@a.fr", "password": "$2a$10$KRe0Q.Dy7FJBm.r5gdt7OeEe7vppczmsPGHrHGPdztEKYmdC4uPPS" }, "urlImage": "../images/iconLocal.png" });

db.exercises.insert({
    title: "Exercice js boucle variable",
    slug: "one",
    language: 'js',
    tags: ['boucle', 'variable'],
    author: "anthony.zink@outlook.fr",
    description: "une descre"
});

db.exercises.insert({
    title: "Exercice js function",
    slug: "two",
    language: 'js',
    tags: ['function'],
    author: "anthony.zink@outlook.fr",
    description: "une hofzj"
})

db.exercises.insert({
    title: "Exercice js function variable",
    slug: "two",
    language: 'js',
    tags: ['function', 'variable'],
    author: "anthony.zink@outlook.fr",
    description: "une hofzj"
})

db.exercises.insert({
    title: "Exercice php function",
    slug: "two",
    language: 'php',
    tags: ['function'],
    author: "anthony.zink@outlook.fr",
    description: "une hofzj"
})

db.exercises.insert({
    title: "Exercice php function boucle",
    slug: "two",
    language: 'php',
    tags: ['function', 'boucle'],
    author: "anthony.zink@outlook.fr",
    description: "une hofzj"
})