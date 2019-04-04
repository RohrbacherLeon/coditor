describe('test class', function() {

    it('Le personnage doit avoir le nom toto', function() {
        let p = new Person("toto", 18);
        assert.equal(p.name, "toto")
    });

    it('Le personnage doit avoir 18 ans', function() {
        let p = new Person("toto", 18);
        assert.equal(p.age, 18)
    });
    
});