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
    cy.wait(500);
    cy.get('input[name=last_name]').type("TestName");
    cy.get('input[name=first_name]').type("TestFirstname");
    cy.get('input[name=email]').type("email@coditor.fr");
    cy.get('input[name=password]').type("testpass");

    //Wrong confirm password
    cy.get('input[name=confirm_password]').type("testpass2");
    cy.get(".button.button--green").click();

    //TESTING ERROR MESSAGE
    cy.contains(".alert.alert-danger", 'Les mots de passes ne correspondent pas.');
  });

  //Test an inscription with email already used
  it('Error email already used', function(){
    cy.wait(500);
    //Wrong email
    cy.get('input[name=email]').clear();
    cy.get('input[name=email]').type("a@a.fr");

    //Type password
    cy.get('input[name=password]').type("testpass");
    cy.get('input[name=confirm_password]').type("testpass");

    cy.get(".button.button--green").click();

    //TESTING ERROR MESSAGE
    cy.contains(".alert.alert-danger", "Cette adresse email est déjà utilisée.");
  });

  // Test if register work
  it('Register work', function(){
    cy.wait(500);
    //Type correct email
    cy.get('input[name=email]').clear();
    cy.get('input[name=email]').type("email@coditor.fr");

    //Type password
    cy.get('input[name=password]').type("testpass");
    cy.get('input[name=confirm_password]').type("testpass");

    cy.get(".button.button--green").click();

    cy.url().should('include', '/login');
    cy.contains(".alert.alert-success", 'Votre compte à bien été créé !');
  });
});