export enum VersionStatus {
  deprecated = 0, // 已废弃
  normal = 1 // 正常
}
export interface Version {
  id: string; // 版本id
  name: string; // 版本名称
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
export interface DirNode {
  name: string;
  filePath: string;
  children: DirNode[];
}