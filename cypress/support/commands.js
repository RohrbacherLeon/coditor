Cypress.Commands.add('login', () => {
    cy.request({
        method: 'POST',
        url: '/login',
        body: {
            //email: 'coditorproject@gmail.com',
            //password: 'coditor0',
            email: 'teacher@teacher.fr',
            password: 'teacher'
        }
    });
});