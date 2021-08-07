/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-06 16:01:47
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-06 17:25:41
 */

import request from "@/utils/request";
import api from "./constants/apis";
import { TemplateCreateParam } from "@/models/template";

class TemplateService {
  async queryTemplateList (){
    return request(api.template.queryTemplateList)
  }
  async createTemplate (data: TemplateCreateParam) {
    return request(api.template.createTemplate , {
      method:"post",
      data
    })
  }
}

export default new TemplateService()