import * as express from 'express'
import config from './config'

const app = express()

app.listen(config.port, () => {
  console.warn(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
})