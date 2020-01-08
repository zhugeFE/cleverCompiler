import * as path from 'path'
import * as fs from 'fs'

const configPath: string = path.resolve(__dirname, '../.config')

interface Database {
  connectionLimit?: number,
  host: string,
  port: number,
  user: string,
  password: string,
  database: string
}
interface ServerConfig{
  database: Database,
  port: number
}

let config: ServerConfig = {
  port: 3000,
  database: {
    host: '111.231.195.117',
    port: 3306,
    user: 'root',
    password: 'dongyongqiang',
    database: 'clever_mock'
  }
}
try {
  fs.statSync(configPath)
  config = JSON.parse(fs.readFileSync(configPath).toString())
} catch (e) {
  fs.writeFileSync(configPath, JSON.stringify(config))
}

export default config