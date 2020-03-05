export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
}
export interface LoginParam {
  username: string;
  password: string;
}