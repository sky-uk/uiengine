const R = require('ramda')
const YamlUtil = require('./yaml')
const ParsingUtil = require('@uiengine/util/src/parsing')

// taken from the fastmatter source code, see
// https://github.com/yuanqing/fastmatter/blob/master/index.js

// this is "forked" to enable custom js-yaml instance with custom types.

// the '---' separator can have trailing whitespace but not leading whitespace
const isSeparator = line => line[0] === '-' && line.trim() === '---'

const NEWLINE = '\n'

const fastmatter = function (str, filename, sourcePaths) {
  var bodyOnly = {
    attributes: {},
    body: str
  }

  var lines = str.split(NEWLINE)

  if (!isSeparator(lines[0])) { // no attributes; entire `str` is body
    return bodyOnly
  }

  var attributes = []
  var i = 1
  var len = lines.length
  while (i < len) {
    if (isSeparator(lines[i])) { // end of attributes
      break
    }
    var line = lines[i]
    if (line.trim().length) attributes.push(line)
    i += 1
  }

  if (i === lines.length) { // second '---' is missing; assume entire `str` is body
    return bodyOnly
  }

  return {
    attributes: attributes.length ? YamlUtil.parseString(attributes.join(NEWLINE), filename, sourcePaths) : {},
    body: lines.slice(i + 1).join(NEWLINE)
  }
}

const parseString = (string, filename, sourcePaths) =>
  fastmatter(string.trim(), filename, sourcePaths)

const fromFile = R.partial(ParsingUtil.fromFile, [parseString])

const fromString = R.partial(ParsingUtil.fromString, [parseString])

module.exports = {
  parseString,
  fromFile,
  fromString
}
