import { Template, TemplateListItem } from "../types/template"
import util from "../utils/util"
import templateDao from "../dao/template"

class TemplateService {
  async add (userId: string, name: string, description: string): Promise<Template> {
    const param: Template = {
      id: util.uuid(),
      name,
      description,
      creatorId: userId,
      createTime: new Date()
    }
    return await templateDao.create(param)
  }
  async query (): Promise<TemplateListItem[]> {
    return await templateDao.query()
  }
}

const templateService = new TemplateService()
export default templateService