import { Config } from './common';
import { Version } from '../../types/common.d';

export interface GitInstance {
  id: string;
  gitId: string;
  name: string;
  git: string;
  enable: boolean;
  lastVersionId: string;
  description: string;
  lastVersion: string;
  readmeDoc: string;
  buildDoc: string;
}
export interface GitInfo {
  id: string;
  gitId: string;
  name: string;
  gitRepo: string;
  configs: Config[];
  versionList: Version[];
}
export interface GitState {
  list: GitInstance[]
}