
describe('test addition', function() {
    it('ok', function() {
        assert.equal(fct(2, 3), 5);
    });

    it('ok 2', function() {
        assert.equal(fct(2, 6), 8);
    });

    it('ok 3', function() {
        assert.equal(fct(1, 6), 8);
    });
});