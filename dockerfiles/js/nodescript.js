const Mocha = require('mocha');
const mocha = new Mocha({
    reporter: 'json'
});

let nameFile = process.argv[process.argv.length -1];

mocha.addFile(process.cwd() +'/'+nameFile);

let results = {
    fails   : [],
    success : []
}

mocha.run(function(failures){
}).on('pass', function(test) {
    results.success.push({
        title : test.title,
        speed : test.speed
    })
}).on('fail', function(test, err) {
    results.fails.push({
        title : test.title,
        error : {
            actual   : test.err.actual, 
            expected : test.err.expected,
            operator : test.err.operator
        }
    })
}).on('end', function() {
    
    
});