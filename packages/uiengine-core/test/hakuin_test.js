/* global describe, it */
const assert = require('assert')
const fs = require('fs-extra')
const assertFileExists = require('./support/assertFileExists')

const Hakuin = require('../lib/index')

const sitePath = './test/tmp/site'
const assetsPath = './test/tmp/assets'
const testConfigPath = './test/project/project.yml'

describe('Hakuin', () => {
  describe('#generate', () => {
    afterEach(() => {
      fs.removeSync(sitePath)
      fs.removeSync(assetsPath)
    })

    it('should generate site', done => {
      const opts = { config: testConfigPath }

      Hakuin.generate(opts)
        .then(state => {
          assertFileExists(`${sitePath}/index.html`)

          done()
        })
        .catch(done)
    })

    it('should throw error if no config option is provided', done => {
      Hakuin.generate()
        .catch(error => {
          assert(error)
          done()
        })
    })
  })
})