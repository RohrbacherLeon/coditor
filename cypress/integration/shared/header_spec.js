describe("Testing header's menu", function(){

    describe("Not logged in", function(){

        beforeEach(() => {
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
        
    });
    
    describe("Student logged in", function(){

        beforeEach(()=>{
            cy.login();
            cy.visit('/');
        });

        it("Menu's dropdown profile link", function() {
            cy.login();
            cy.contains('Mon profile').should('have.attr', 'href', '/profile');
            cy.contains('Mon profil').click();
            cy.url().should('equal', Cypress.env('baseUrl') + "/profile");
        });
    
        it("Logout button", function() {
            cy.login();
            cy.contains('Déconnexion').should('have.attr', 'href', '/logout');
            cy.contains('Déconnexion').click();
            cy.url().should('equal', Cypress.env('baseUrl') + "/");
        });

        it("Navbar's home", function(){
            cy.contains("Accueil").should('have.attr', 'href', '/');
        });

        it("Navbar's exercises", function(){
            cy.contains("Exercices").should('have.attr', 'href', '/exercises');
        });

    });

    describe("Teacher logged in", function(){
        it("")
    });
    
});