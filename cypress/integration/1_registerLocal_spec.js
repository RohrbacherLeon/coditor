let urlStart = "localhost:3000";
describe('Test Register Local', function() {

  //Test if page is visitable
  it('Visits the Register page', function() {
    cy.visit(urlStart+'/register');
  });

  //Test if all elements are here
  it('Contains all elements', function(){
    cy.contains('.register', 'Inscription');
    cy.contains('form', 'Nom');
    cy.contains('form', 'Prénom');
    cy.contains('form', 'Email');
    cy.contains('form', 'Mot de passe');
    cy.contains('form', 'Confirmez votre mot de passe');
  });

  //Test an inscription with wrong confirm password
  it('Error password to register', function(){
    cy.get('input[name=last_name]').type("TestName");
    cy.get('input[name=first_name]').type("TestFirstname");
    cy.get('input[name=email]').type("email@coditor.fr");
    cy.get('input[name=password]').type("testpass");

    //Wrong confirm password
    cy.get('input[name=confirm_password]').type("testpass2");
    cy.get(".button.button--green").click();

    //TESTING ERROR MESSAGE
    cy.contains(".error", 'Les mots de passe ne correspondent pas.');

    //Type correct password
    cy.get('input[name=confirm_password]').type("testpass");
  });

  //Test an inscription with wrong email
  it('Error password to register', function(){
    //Wrong email
    cy.get('input[name=email]').type("TestEmail");
    cy.get(".button.button--green").click();

    //TESTING ERROR MESSAGE
    cy.contains(".error", "L'adresse email est invalide.");
  });

  //Test an inscription with email already exist
  it('Error password to register', function(){
    //Wrong email
    cy.get('input[name=email]').type("a@a.fr");
    cy.get(".button.button--green").click();

    //TESTING ERROR MESSAGE
    cy.contains(".error", "L'adresse email existe déjà.");
  });

  // Test if register work
  it('Register work', function(){
    //Type correct email
    cy.get('input[name=email]').type("email@coditor.fr");

    cy.wait(500);
    cy.get(".button.button--green").click();

    cy.url().should('include', '/login');
  });
});