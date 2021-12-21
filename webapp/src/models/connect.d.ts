/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-01 21:57:06
 */
import { GitModelState } from './git';
import { SysModelState } from './sys';
import type { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { TemplateModelState } from "./template";
import { CompileModelState } from "./compile";
import { CustomerModelState } from "./customer";
import { ProjectModelState } from "./project";

export { GlobalModelState, UserModelState };

export type Loading = {
  global: boolean;
  effects: Record<string, boolean | undefined>;
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    template?: boolean;
    customer?: boolean;
    project?: boolean;
    compile?: boolean;
  };
};

export type ConnectState = {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  sys: SysModelState;
  git: GitModelState;
  template: TemplateModelState;
  customer: CustomerModelState;
  project: ProjectModelState;
  compile: CompileModelState;
};

export type Route = {
  routes?: Route[];
} & MenuDataItem;
