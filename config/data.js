db.users.insert({"type" : "teacher", "first_name" : "teacher", "last_name" : "teacher", "email" : "teacher@teacher.fr", "password" : "$2a$10$yYC5Trng9sjNr7mAo2cWuOwC7gE.Y0LGwXGgf4sxxItp7DsMgJQAC"});
db.users.insert({"type" : "student", "first_name" : "a", "last_name" : "a", "email" : "a@a.fr", "password" : "$2a$10$KRe0Q.Dy7FJBm.r5gdt7OeEe7vppczmsPGHrHGPdztEKYmdC4uPPS"});

db.exercises.insert({title:"one", slug:"one", language:'js', tags:['boucle', 'variable'], author:"anthony.zink@outlook.fr", description: "une descre"})
db.exercises.insert({title:"two", slug:"two", language:'js', tags:['function'], author:"anthony.zink@outlook.fr", description: "une hofzj"})