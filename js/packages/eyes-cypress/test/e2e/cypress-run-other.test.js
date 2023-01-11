'use strict'
const {describe, it, before, after} = require('mocha')
const {exec} = require('child_process')
const {promisify: p} = require('util')
const path = require('path')
const pexec = p(exec)
const fs = require('fs')
const {expect} = require('chai')
const {msgText} = require('../../src/plugin/concurrencyMsg')
const concurrencyMsg = msgText.substr(0, 100)

const sourceTestAppPath = path.resolve(__dirname, '../fixtures/testApp')
const targetTestAppPath = path.resolve(__dirname, '../fixtures/testAppCopies/testApp-other')

describe('eyes configurations', () => {
  before(async () => {
    if (fs.existsSync(targetTestAppPath)) {
      fs.rmdirSync(targetTestAppPath, {recursive: true})
    }
    await pexec(`cp -r ${sourceTestAppPath}/. ${targetTestAppPath}`)
    process.chdir(targetTestAppPath)
    await pexec(`npm install`, {
      maxBuffer: 1000000,
    })
  })

  after(async () => {
    fs.rmdirSync(targetTestAppPath, {recursive: true})
  })

  it('works with disabled eyes', async () => {
    try {
      const {stdout} = await pexec(
        'APPLITOOLS_IS_DISABLED=1 ./node_modules/.bin/cypress run --headless --headless --spec cypress/integration-play/iframe.js --config integrationFolder=cypress/integration-play,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
        {
          maxBuffer: 10000000,
        },
      )

      expect(stdout, 'cypress ran with eyes disabled but concurrency msg is shown').to.not.have.string(concurrencyMsg)
    } catch (ex) {
      console.error('Error during test!', ex.stdout)
      throw ex
    }
  })

  it('does not fail Cypress test if failCypressOnDiff flag is false', async () => {
    try {
      await pexec(
        'APPLITOOLS_FAIL_CYPRESS_ON_DIFF=false ./node_modules/.bin/cypress run --headless --headless --spec cypress/integration-play/always-fail.js --config integrationFolder=cypress/integration-play,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
        {
          maxBuffer: 10000000,
        },
      )
    } catch (ex) {
      console.error(
        'Test Failed even though failCypressOnDiff flag is false, If this is the first time u ran this test then u need to set up an invalid baseline for it.',
        ex.stdout,
      )
      throw ex
    }
  })
})
