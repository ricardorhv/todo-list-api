export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-z]+)/g
  const pathWithParameters = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParameters}(?<query>\\?(.*))?$`)

  return pathRegex
}