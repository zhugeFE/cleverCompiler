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
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'dongyongqiang',
    database: 'compile_deploy_sys',
    connectionLimit: 20
  }
}
try {
  fs.statSync(configPath)
  config = JSON.parse(fs.readFileSync(configPath).toString())
} catch (e) {
  fs.writeFileSync(configPath, JSON.stringify(config))
}

export default config