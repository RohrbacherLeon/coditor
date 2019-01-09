let urlStart = "localhost:3000";

describe('Testing home page', function() {
    //Testing page visit
    it('Page visit', function() {
        cy.visit(urlStart + '/');
    })
});