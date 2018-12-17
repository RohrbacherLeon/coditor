
describe('test addition', function() {
    it('2+3', function() {
        assert.equal(fct(2, 3), 5);
    });

    it('2+6', function() {
        assert.equal(fct(2, 6), 8);
    });

    it('1+8', function() {
        assert.equal(fct(1, 8), 9);
    });
});