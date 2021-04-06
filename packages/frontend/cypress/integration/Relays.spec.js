import {
  fixCypressSpec,
  runToMatchImageSnapshotOnlyInCypressRun,
  waitDuringTheLaunchOfTheModalInMs,
} from '../support';

beforeEach(fixCypressSpec(__filename));

describe('Relays', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      `http://localhost:${Cypress.env('API_PORT')}/api/users/rolesAndGuid`,
      {
        fixture: 'rolesAndGuid',
      },
    ).as('roles');
    cy.intercept(
      'POST',
      `http://localhost:${Cypress.env('API_PORT')}/api/relays/openClose`,
      'true',
    );

    let numberOfStateCall = 1;
    cy.intercept(
      'GET',
      `http://localhost:${Cypress.env('API_PORT')}/api/relays/state`,
      req => {
        if (numberOfStateCall <= 2) {
          numberOfStateCall++;
          req.reply('true');
        } else {
          req.reply('false');
        }
      },
    ).as('state');
  });

  it('should add "enable" class buttons when its clicked and return to "disable" after', () => {
    cy.visit(`http://localhost:${Cypress.env('FRONT_PORT')}`);
    cy.wait(waitDuringTheLaunchOfTheModalInMs);
    runToMatchImageSnapshotOnlyInCypressRun(cy.document());
    cy.get('#relayState0').click();
    cy.get('#relayState0').should('have.class', 'enable');
    cy.get('#relayState1').click();
    cy.get('#relayState1').should('have.class', 'enable');
    cy.get('#relayState0').should('have.class', 'disable');
    cy.get('#relayState1').should('have.class', 'disable');
    cy.wait(waitDuringTheLaunchOfTheModalInMs);
    runToMatchImageSnapshotOnlyInCypressRun(cy.document());
  });
});
