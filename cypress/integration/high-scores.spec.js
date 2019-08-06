describe('high scores e2e test', function () {
  describe('access homepage view high scores', function() {
    it('access the homepage and view the high scores', function() {
      cy.visit('/home');
      cy.get('#login > .mat-button-wrapper').click();
      cy.get('#email').type(Cypress.env('cypress-email'));
      cy.get('#password').type(Cypress.env('cypress-password'), { log: false });
      cy.get('#login-button > .mat-button-wrapper').click();
      cy.get('#welcome-title').should('contain', 'Welcome');
      cy.get('#rdcc-toolbar').click();
      cy.get('#high-scores').click();
      cy.get('h1').should('contain', 'High Scores');
    })
  })
});
