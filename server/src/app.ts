import * as express from 'express'
import config from './config'
import './dao/pool'
const app = express()

app.listen(config.port, () => {
  console.warn(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
})