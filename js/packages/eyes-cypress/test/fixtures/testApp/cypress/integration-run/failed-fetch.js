/* global cy */
describe('eyes-cypress', () => {
  // This also tests the setting of `testName` inside `it`

  it.skip('failed fetch', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/testFailedFetch.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      browser: {width: 1024, height: 768},
      // showLogs: true,
    });
    cy.eyesCheckWindow('full page');
    cy.eyesClose();
  });
});
