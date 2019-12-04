'use strict'
const build = {
  ASSETS_PUBLIC_PATH: '/',
  OUTPUT_DIR: 'dist',
  ASSETS_DIR: 'static',
  INDEX_PATH: 'index.html'
}
const env = {
  NODE_ENV: '"development"',
  ASSETS_PUBLIC_PATH: JSON.stringify(build.ASSETS_PUBLIC_PATH),
}

module.exports = {
  env,
  build
}
