db.users.insert({"first_name" : "a", "last_name" : "a", "email" : "a@a.fr", "password" : "$2a$10$Mw8zrvQnG2AJGYTMPAQ4PO5puK0xn5gRvIR0Rhl4Dal/9BZ1yrOlS"});

db.exercises.insert({
    title:"first",
    slug:"first",
    language: "php",
    tags : ["boucle", "for"],
    author : "Anthony Zink"
})

db.exercises.insert({
    title:"second exercise",
    slug:"second-exercise",
    language: "js",
    tags : ["boucle","while"],
    author : "Anthony Zink"
})

db.exercises.insert({
    title:"third",
    slug:"thirs",
    language: "js",
    tags : ["variable"],
    author : "Anthony Zink"
})