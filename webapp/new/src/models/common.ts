/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-07 09:58:37
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-07 19:53:08
 */
export enum VersionStatus {
  deprecated = 0, // 已废弃
  normal, // 正常
  placeOnFile
}
export enum EditMode {
  create = 0 ,
  update
}
export enum TypeMode {
  text = 0,
  file
}

export enum StatusMode {
  enable = 0,
  disable
}

export interface Version {
  id: string; // 版本id
  name?: string; // 版本名称
  description: string; // 版本描述
  status: number; // 版本状态
  publishTime: number; // 版本创建时间
  compileOrders: string[]; // 编译命令组
  readmeDoc: string; // 介绍文档
  buildDoc: string; // 部署文档
  updateDoc: string; // 更新文档
}
export interface Config {
  id: string; // 配置项id
  name: string; // 配置项名称
  typeId: number; // 类型id
  desc: string; // 描述信息
  reg: string; // 正则表达式
  filePath: string; // 原始文件路径
  targetValue: string; // 目标值，配置项类型是文件时，该值是文件存放地址
}
export interface ConfigType {
  id: number;
  label: string;
  key: string;
}
export interface Role {
  id: number;
  name: string;
}
export interface BaseState {
  roleList: Role[];
  configTypes: ConfigType[];
}
export interface DirNode {
  name: string;
  filePath: string;
  isDirectory: boolean;
  children: DirNode[];
  fileType: string;
}

export const compileType = [
  {
    value: 0,
    text: "私有部署"
  },
  {
    value: 1,
    text: "常规迭代"
  },
  {
    value: 2,
    text: "发布测试"
  }
]

export const publicType = [
  {
    value: 0,
    text: "全部下载"
  },
  {
    value: 1,
    text: "自动"
  }
]

export const VersionType = [
  { title: '大版本', key: '0' },
  { title: '中版本', key: '1' },
  { title: '小版本', key: '2' },
];