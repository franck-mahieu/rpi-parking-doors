import {
  fixCypressSpec,
  runToMatchImageSnapshotOnlyInCypressRun,
  waitDuringTheLaunchOfTheModalInMs,
} from '../support';

beforeEach(fixCypressSpec(__filename));

describe('ManagedUsers', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      `http://localhost:${Cypress.env('API_PORT')}/api/users/rolesAndGuid`,
      {
        fixture: 'rolesAndGuid',
      },
    ).as('roles');
    cy.intercept(
      'GET',
      `http://localhost:${Cypress.env('API_PORT')}/api/users/all`,
      {
        fixture: 'usersAll',
      },
    ).as('usersAll');
    cy.intercept(
      'PUT',
      `http://localhost:${Cypress.env('API_PORT')}/api/users/add`,
      {
        fixture: 'addUser',
      },
    ).as('addUser');
    cy.intercept(
      'DELETE',
      `http://localhost:${Cypress.env('API_PORT')}/api/users/remove`,
      {
        fixture: 'removeUser',
      },
    ).as('removeUser');
    cy.intercept(
      'POST',
      `http://localhost:${Cypress.env('API_PORT')}/api/users/updatepassword`,
      {
        fixture: 'updatePassword',
      },
    ).as('updatePassword');
  });

  it('should show table and button on managed users page ', () => {
    cy.visit(`http://localhost:${Cypress.env('FRONT_PORT')}/admin/manageusers`);
    runToMatchImageSnapshotOnlyInCypressRun(cy.document());
  });

  it('should show add new user modal when click on button and send request when form is completed ', () => {
    cy.visit(`http://localhost:${Cypress.env('FRONT_PORT')}/admin/manageusers`);
    cy.get('[data-target=add-user-modal]').click();
    cy.wait(waitDuringTheLaunchOfTheModalInMs);
    runToMatchImageSnapshotOnlyInCypressRun(cy.document());
    cy.get('#login').type('login', { force: true });
    cy.get('#password').type('password', { force: true });
    cy.get('#email').type('email@email.fr', { force: true });
    cy.get('#add-user-validate-button').click();
    cy.wait('@addUser')
      .its('request.body')
      .should('deep.equal', {
        login: 'login',
        password: 'password',
        roles: 'user',
        email: 'email@email.fr',
        expiration: '',
      });
  });

  it('should show remove user modal when click on button and send request when form is completed ', () => {
    cy.visit(`http://localhost:${Cypress.env('FRONT_PORT')}/admin/manageusers`);
    cy.get('[data-target=remove-user-modal-admin]').click();
    cy.wait(waitDuringTheLaunchOfTheModalInMs);
    runToMatchImageSnapshotOnlyInCypressRun(cy.document());
    cy.get('#remove-user-validate-button').click();
    cy.wait('@removeUser')
      .its('request.body')
      .should('deep.equal', {
        login: 'admin',
      });
  });

  it('should show update password modal when click on button and send request when form is completed ', () => {
    cy.visit(`http://localhost:${Cypress.env('FRONT_PORT')}/admin/manageusers`);
    cy.get('[data-target=update-user-password-modal-admin]').click();
    cy.wait(waitDuringTheLaunchOfTheModalInMs);
    runToMatchImageSnapshotOnlyInCypressRun(cy.document());
    cy.get('#update-password-admin').type('newPassword', { force: true });
    cy.get('#update-password-validate-button').click();
    cy.wait('@updatePassword')
      .its('request.body')
      .should('deep.equal', {
        login: 'admin',
        password: 'newPassword',
      });
  });
});
