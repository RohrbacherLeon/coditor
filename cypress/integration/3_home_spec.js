describe('Testing home page', function() {

    it('Page visit', function() {
        cy.visit('/');
    });

    it("Menu logo link", function() {
        cy.get('.nav__logo').click();
        cy.url().should('equal', Cypress.env('baseUrl') + "/");
    });

    it("Menu login link", function() {
        cy.get('.nav__right').children('a').click();
        cy.url().should('equal', Cypress.env('baseUrl') + "/login");
    });

    it("Menu's dropdown profile link", function() {
        cy.login();
        cy.get('a[href=/profile]').click();
        cy.url().should('equal', Cypress.env('baseUrl') + "/profile");
    });

    it("Menu's dropdown exercises series link", function() {
        cy.login();
        cy.get('a[href=/series]').click();
        cy.url().should('equal', Cypress.env('baseUrl') + "/series");
    });

    it("Logout button", function() {
        cy.login();
        cy.get('a[href=/logout]').click();
        cy.url().should('equal', Cypress.env('baseUrl') + "/");
    });

});