import path from 'path'
import pug from 'pug'
import helpers from './helpers'

const componentsPath = path.resolve(__dirname, 'components')
const templatesPath = path.resolve(__dirname, 'templates')

const pugOpts = {
  basedir: componentsPath,
  pretty: true,
  cache: true
}

export const staticPath = path.resolve(__dirname, '..', 'static')

export async function render (options, id, data = {}) {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(templatesPath, `${id}.pug`)
    const theme = { h: helpers(options, data) }
    const context = Object.assign({}, pugOpts, options, data, theme)

    try {
      const rendered = pug.renderFile(filePath, context)

      resolve(rendered)
    } catch (err) {
      const message = [`Pug could not render "${filePath}"!`, err]

      if (options.debug) message.push(JSON.stringify(context, null, '  '))

      reject(message.join('\n\n'))
    }
  })
}