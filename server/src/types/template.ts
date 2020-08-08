export interface Template {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createTime: Date;
}
export interface TemplateListItem {
  id: string;
  name: string;
  description: string;
  versionId: string;
  version: string;
}