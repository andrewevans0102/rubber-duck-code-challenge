describe('create user e2e test', function () {
  beforeEach(() => {
    cy.server();
    cy.route('POST', 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser**').as('create')
  });

  describe('register user e2e test', function() {
    it('access the homepage and register user', function() {
      cy.visit('/home');
      cy.get('#register-user > .mat-button-wrapper').click();
      cy.get('#inputEmail').type(Cypress.env('cypress-email'));
      cy.get('#password').type(Cypress.env('cypress-password'), { log: false });
      cy.get('#firstName').type(Cypress.env('cypress-user-first-name'));
      cy.get('#lastName').type(Cypress.env('cypress-user-last-name'));
      cy.get('#create-button > .mat-button-wrapper').click();
      cy.get('#closeButton').click();
      cy.wait('@create').then((createResponse) => {
        assert.equal(createResponse.response.body.error.message, 'EMAIL_EXISTS');
      });
    })
  })
});
