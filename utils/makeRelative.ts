const path = require('path-browserify')

// Straight copy-paste from https://github.com/sindresorhus/file-url/blob/main/index.js
// - couldn't use it directly because it uses "import path from 'path-browserify'" syntax internally
function toFileUrl(filePath: string, options = { resolve: false }) {
  if (typeof filePath !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof filePath}`)
  }

  const { resolve = true } = options

  let pathName = filePath
  if (resolve) {
    pathName = path.resolve(filePath)
  }

  pathName = pathName.replace(/\\/g, '/')

  // Windows drive letter must be prefixed with a slash.
  if (pathName[0] !== '/') {
    pathName = `/${pathName}`
  }

  // Escape required characters for path components.
  // See: https://tools.ietf.org/html/rfc3986#section-3.3
  return encodeURI(`file://${pathName}`).replace(/[?#]/g, encodeURIComponent)
}

const makeRelative = function makeRelative(baseUrl: string, url: string) {
  const baseFileUrl = toFileUrl(baseUrl, { resolve: false })
  const fileUrl = toFileUrl(url, { resolve: false })

  if (fileUrl.startsWith(baseFileUrl)) {
    return decodeURIComponent(fileUrl.replace(`${baseFileUrl}/`, ''))
  }

  return decodeURIComponent(url)
}

export { makeRelative }
