describe('Test Login Local', function() {

    //Test if page is visitable
    it('Visits the Login page', function() {
        cy.visit(Cypress.env('baseUrl') + '/login');
    });

    //Test wrong email
    it('Test wrong email', function() {
        cy.get('input[name=email]').type("TestEmail@wrongEmail.com");
        cy.get('input[name=password]').type("testpass");

        cy.get(".button.button--green").click();

        //TESTING ERROR MESSAGE
        cy.contains(".alert.alert-danger", "Adresse email ou mot de passe incorrecte.");

        cy.url().should('include', '/login');
    });

    //Test wrong password
    it('Test wrong password', function() {
        cy.get('input[name=email]').clear();
        cy.get('input[name=email]').type("email@coditor.fr");
        cy.get('input[name=password]').type("testpassWRONG");

        cy.get(".button.button--green").click();

        //TESTING ERROR MESSAGE
        cy.contains(".alert.alert-danger", "Adresse email ou mot de passe incorrecte.");

        cy.url().should('include', '/login');
    });

    //Success login
    it('Test success login', function() {
        cy.get('input[name=email]').clear();
        cy.get('input[name=email]').type("email@coditor.fr");
        cy.get('input[name=password]').type("testpass");

        cy.get(".button.button--green").click();
        cy.url().should('contain', urlStart);
        cy.contains(".alert.alert-success", 'Vous êtes maintenant connecté.');
    });
});