import * as childProcess from 'child_process'
import * as _ from 'lodash';
import logger from './logger';
class DashUtil {
  exec (command: string, options?: childProcess.ExecOptions, onData?: (data: string) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      logger.info(`exec command: ${command}`)
      const process = childProcess.exec(command, options, (err: childProcess.ExecException, out: string) => {
        if (err) {
          reject(err)
        } else {
          resolve(out)
        }
      })
      process.stdout.on('data', (chunk: any) => {
        if (_.isFunction(onData)) {
          onData(chunk.toString())
        }
        logger.info(chunk.toString())
      })
      process.stderr.on('data', (chunk: any) => {
        if (_.isFunction(onData)) {
          onData(chunk.toString())
        }
        logger.info(chunk.toString())
      })
    })
  }
}
export default new DashUtil()