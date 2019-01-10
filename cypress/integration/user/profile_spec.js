describe('Testing user profile page', function() {
    beforeEach(() => {
        cy.login();
        cy.visit('/profile');
    });

    it('Page exists', function() {
        cy.get('.profile__content');
    });

    it('Contains infos', function() {

    });
});