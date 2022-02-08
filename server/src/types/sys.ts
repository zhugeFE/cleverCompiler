export interface SysInfo{
  gitHost: string;
  gitToken: string;
  gitSsh: string;
  gitAccount: string;
  email: string;
  password: string;
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