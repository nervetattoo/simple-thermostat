const fs = require('fs')
const pkg = require('../package.json')

const REPO = 'nervetattoo/simple-thermostat'

const [ name, version, date ] = process.argv.slice(2)

const content = {
  [name]: {
    updated_at: date,
    version,
    remote_location: `https://raw.githubusercontent.com/${REPO}/master/${pkg.main}`,
    visit_repo: `https://github.com/${REPO}`,
    changelog: `https://github.com/${REPO}/releases/latest`,
  },
}

fs.writeFileSync('tracker.json', JSON.stringify(content, null, 2))
