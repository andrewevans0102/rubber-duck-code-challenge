describe('login user e2e test', function () {
  describe('access homepage login user', function() {
    it('access the homepage and login user', function() {
      cy.visit('/home');
      cy.get('#login > .mat-button-wrapper').click();
      cy.get('#email').type(Cypress.env('cypress-email'));
      cy.get('#password').type(Cypress.env('cypress-password'), { log: false });
      cy.get('#login-button > .mat-button-wrapper').click();
      cy.get('#welcome-title').should('contain', 'Welcome');
    })
  })
});
