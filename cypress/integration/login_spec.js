let urlStart = "localhost:3000";

//Test if page is visitable
it('Visits the Login page', function() {
  cy.visit(urlStart+'/login');
});

//Test wrong email
it('Test wrong email', function() {
  cy.get('input[name=email]').type("TestEmail@wrongEmail.com");
  cy.get('input[name=password]').type("testpass");

  //TESTING ERROR MESSAGE
  cy.contains(".error", "L'adresse email ou le mot de passe est invalide.");

  cy.url().should('include', '/login');
  cy.wait(500);
});

//Test wrong password
it('Test wrong password', function() {
  cy.get('input[name=email]').type("TestEmail@coditor.fr");
  cy.get('input[name=password]').type("testpassWRONG");

  //TESTING ERROR MESSAGE
  cy.contains(".error", "L'adresse email ou le mot de passe est invalide.");

  cy.url().should('include', '/login');
  cy.wait(500);
});

//Success login
it('Test success login', function() {
  cy.get('input[name=email]').type("TestEmail@coditor.fr");
  cy.get('input[name=password]').type("testpass");

  cy.get(".button.button--green").click();
  cy.url().should(urlStart);
});