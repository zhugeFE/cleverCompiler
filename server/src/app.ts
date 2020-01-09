import * as express from 'express'
import config from './config'
import api from './controller/index'
import './dao/pool'
import auth from './middleware/auth'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'

const app = express()
app.use(session({
  secret: 'compile'
}))
app.use(auth)
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use('/api', api)

app.listen(config.port, () => {
  console.warn(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
})