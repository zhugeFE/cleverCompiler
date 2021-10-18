/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-10-15 16:16:01
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-15 18:31:59
 */

import request from "@/utils/request";
import api from "./constants/apis";


class DownloadService {

  async getDownloadFilePath (fileName: string) {
    return request(api.download.getDownloadFilePath, {
      method: "post",
      data: {
        pathName: fileName
      }
    })
  }
  async downloadFile (filePath: string) {
    return request(api.download.downloadFile, {
      params: {
        filePath
      }
    })
  }
  
}

export default new DownloadService()