/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-10-15 16:16:01
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-14 14:34:01
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
    const xhr = new XMLHttpRequest()
    // xhr.open('get', url="")

    // xhr.onreadystatechange = () => {
    //   if (xhr.readyState == 4 && xhr.status == 200)
    // }
  }
  
}

export default new DownloadService()