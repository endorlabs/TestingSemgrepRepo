/* global cy,Cypress*/
const assert = require('assert')
const {getTestInfo} = require('@applitools/test-utils')

describe('Coverage tests', () => {
  it('should send accessibility regions by selector with vg', () => {
    cy.visit('https://applitools.github.io/demo/TestPages/FramesTestPage/')
    cy.eyesOpen({
      appName: 'Eyes Selenium SDK - Fluent API',
      testName: 'TestAccessibilityRegions_VG',
      viewportSize: {width: 700, height: 460},
      accessibilityValidation: {level: 'AAA', guidelinesVersion: 'WCAG_2_0'},
    })
    cy.eyesCheckWindow({
      accessibility: [
        {accessibilityType: 'LargeText', selector: '.ignore'},
        {
          region: {
            accessibilityType: 'LargeText',
            selector: '#overflowing-div',
          },
          regionId: 'accesibility-regionId',
          padding: {left: 5},
        },
      ],
    })
    cy.eyesClose()

    cy.eyesGetAllTestResults().then(async summary => {
      const info = await getTestInfo(
        summary.getAllResults()[0].getTestResults(),
        Cypress.config('appliConfFile').apiKey,
      )
      assert.deepStrictEqual(
        info['actualAppOutput']['0']['imageMatchSettings']['accessibilitySettings']['level'],
        'AAA',
        undefined,
      )
      assert.deepStrictEqual(
        info['actualAppOutput']['0']['imageMatchSettings']['accessibilitySettings']['version'],
        'WCAG_2_0',
        undefined,
      )
      assert.deepStrictEqual(
        info['actualAppOutput']['0']['imageMatchSettings']['accessibility']['0'],
        {
          isDisabled: false,
          type: 'LargeText',
          left: 3,
          top: 80,
          width: 309,
          height: 185,
          regionId: 'accesibility-regionId',
        },
        undefined,
      )
      assert.deepStrictEqual(
        info['actualAppOutput']['0']['imageMatchSettings']['accessibility']['1'],
        {
          type: 'LargeText',
          isDisabled: false,
          left: 10,
          top: 285,
          width: 800,
          height: 501,
          regionId: '.ignore (1)',
        },
        undefined,
      )
      assert.deepStrictEqual(
        info['actualAppOutput']['0']['imageMatchSettings']['accessibility']['2'],
        {
          isDisabled: false,
          type: 'LargeText',
          left: 122,
          top: 932,
          width: 456,
          height: 307,
          regionId: '.ignore (2)',
        },
        undefined,
      )
      assert.deepStrictEqual(
        info['actualAppOutput']['0']['imageMatchSettings']['accessibility']['3'],
        {
          isDisabled: false,
          type: 'LargeText',
          left: 8,
          top: 1276,
          width: 690,
          height: 207,
          regionId: '.ignore (3)',
        },
        undefined,
      )
    })
  })
})
