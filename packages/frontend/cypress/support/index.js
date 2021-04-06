import 'cypress-plugin-snapshots/commands';

// Necessary because of a bug between cypress:run and cypress:open, disable MatchImageSnapshot in head mode (cypress:open):
// https://github.com/jaredpalmer/cypress-image-snapshot/issues/95#issuecomment-755886775
const inCypressRun = !Cypress.config('isInteractive');
export const runToMatchImageSnapshotOnlyInCypressRun = cyDocument => {
  if (inCypressRun && Cypress.env('ENABLE_SCREENSHOT_VERIFICATION') === true) {
    cyDocument.toMatchImageSnapshot();
    cy.log('Screenshot verification was launched');
  } else {
    cy.log(
      'No screenshot verification when launch in cypress headed or when ENABLE_SCREENSHOT_VERIFICATION is not true',
    );
  }
};
export const waitDuringTheLaunchOfTheModalInMs = 300;

export const fixCypressSpec = filename => () => {
  const path = require('path');
  const relative = filename;
  const projectRoot = Cypress.config('projectRoot');
  const absolute = path.join(projectRoot, relative);
  Cypress.spec = {
    absolute,
    name: path.basename(filename),
    relative,
  };
};

Cypress.Commands.overwrite(
  'screenshot',
  (originalFn, subject, name, options) => {
    // only take screenshots in headless browser
    if (Cypress.browser.isHeadless) {
      // return the original screenshot function
      return originalFn(subject, name, options);
    }
    cy.log('No screenshot taken when headed');
  },
);

Cypress.on('log:added', options => {
  if (options.instrument === 'command' && options.name === 'log') {
    console.log(`[${(options.name || '').toUpperCase()}] ${options.message}`);
  }
});
