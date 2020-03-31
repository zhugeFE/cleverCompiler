import { Version, Config } from "./common";

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

export interface GitCommit {
  id: string;
  message: string;
}

export interface GitBranch {
  name: string;
  commit: GitCommit;
}
export interface GitTag {
  name: string;
  message: string;
  commit: GitCommit;
}