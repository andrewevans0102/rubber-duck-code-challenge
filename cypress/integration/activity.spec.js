describe('activity create, view, and delete e2e test', function () {
  describe('create, view, and then delete activity', function() {
    it('access the homepage and login user', function() {
      cy.visit('/home');
      cy.get('#login > .mat-button-wrapper').click();
      cy.get('#email').type(Cypress.env('cypress-email'));
      cy.get('#password').type(Cypress.env('cypress-password'), { log: false });
      cy.get('#login-button > .mat-button-wrapper').click();
      cy.get('#welcome-title').should('contain', 'Welcome');
      cy.get('#rdcc-toolbar').click();
      cy.get('.mat-menu-content > :nth-child(1) > span').click();
      cy.get('.mat-select-arrow-wrapper').click();
      cy.get('#mat-option-0 > .mat-option-text').click();
      cy.get('#description').type(Cypress.env('activity-description'));
      cy.get('#link').type(Cypress.env('activity-link'));
      cy.get('.mat-primary > .mat-button-wrapper').click();
      cy.get('.info').should('contain', 'activity was created successfully');
      cy.get('#closeButton').click();
      cy.get('#welcome-title').should('contain', 'Welcome Rey!');
      cy.get('#rdcc-toolbar').click();
      cy.get('#view-activity').click();
      cy.get(':nth-child(1) > :nth-child(6) > .btn').click();
      cy.get('#info-message').should('contain', 'activity was deleted successfully');
    })
  })
});
