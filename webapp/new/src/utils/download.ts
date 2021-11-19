/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-19 10:55:08
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-19 11:04:16
 */

import { ProjectCompile } from "@/models/project";


const download =  (file: string, name: string) => {
  const x = new window.XMLHttpRequest();
  x.open('GET', `/api/download?filePath=${file}`, true);
  x.responseType = 'blob';
  x.onload = () => {
      const url = window.URL.createObjectURL(x.response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.tar.gz`;
      a.click();
  };
  x.send();
}


export {
  download
}
