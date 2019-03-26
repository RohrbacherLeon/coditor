
        let assert = require("assert");
        function fct(a,b){return a-b}
        
describe('test soustraction', function() {
    it('3-1 = 2', function() {
        assert.equal(fc(3,1), 2);
    });

    it('6-6 = 0', function() {
        assert.equal(fc(6, 6), 0);
    });
});