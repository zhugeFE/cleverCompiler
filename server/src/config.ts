import * as path from 'path'
import * as fs from 'fs'
import * as jsBeautify from 'js-beautify'
const configPath: string = path.resolve(__dirname, '../.config')

interface Database {
  connectionLimit?: number;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
interface ServerConfig{
  database: Database;
  port: number;
  compileDir: string;
}

let config: ServerConfig = {
  port: 3000,
  database: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Dong_1013501639',
    database: 'clever_compile',
    connectionLimit: 20
  },
  compileDir: path.resolve(__dirname, '../.compile')
}
try {
  fs.statSync(configPath)
  config = JSON.parse(fs.readFileSync(configPath).toString())
} catch (e) {
  fs.writeFileSync(configPath, jsBeautify.js(JSON.stringify(config)))
}
try {
  fs.statSync(config.compileDir)
} catch (e) {
  fs.mkdirSync(config.compileDir)
}
export default config