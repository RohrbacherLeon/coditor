
describe('test soustraction', function() {

    it('La fonction doit être définie', function() {
        assert.exists(sub);
    });

    it('Une fonction est attendue', function() {
        assert.isFunction(sub);
    });

    it('La fonction doit avoir deux arguments', function() {
        assert.equal(sub.length, 2);
    });

    it('3-1', function() {
        assert.equal(sub(3,1), 2);
    });

    it('6-6', function() {
        assert.equal(sub(6, 6), 0);
    });
    
});