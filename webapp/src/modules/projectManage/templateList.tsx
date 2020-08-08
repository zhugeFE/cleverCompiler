import * as React from 'react'
import './styles/templateList.less'
import { Table, Button, Form, Input, message } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import history from '../../utils/history'
import CreateTemplate from './createTemplate'
import { Template, TemplateListItem } from '../../store/state/template'
import ajax from '../../utils/ajax'
import api from '../../store/api'
interface Props {

}
interface State {
  store: TemplateListItem[];
  showCreate: boolean;
}
class TemplateList extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      store: [],
      showCreate: false
    }
    this.onCreate = this.onCreate.bind(this)
    this.afterCreate = this.afterCreate.bind(this)
    this.onCancelCreate = this.onCancelCreate.bind(this)
  }
  onCreate () {
    this.setState({
      showCreate: true
    })
  }
  onCancelCreate () {
    this.setState({
      showCreate: false
    })
  }
  afterCreate (template: Template) {
    this.setState({
      showCreate: false
    })
    history.push(`/project/template/${template.id}`)
  }
  queryList  () {
    ajax({
      url: api.template.query,
      method: 'GET'
    })
    .then(res => {
      this.setState({
        store: res.data
      })
    })
    .catch(err => {
      message.error({
        content: '查询模板列表失败'
      })
      console.error('查询模板列表失败', err)
    })
  }
  componentDidMount () {
    this.queryList()
  }
  render () {
    const columns: ColumnProps<TemplateListItem>[] = [
      {
        title: '模板名称',
        dataIndex: 'name'
      },
      {
        title: '最新版本',
        dataIndex: 'version',
        showSorterTooltip: false,
        render (version) {
          return (
          <span>{version || '-'}</span>
          )
        },
        sorter (a:TemplateListItem, b: TemplateListItem) {
          const val = Number(a.version.replace(/\D/g, '')) - Number(b.version.replace(/\D/g, ''))
          if (val > 0) {
            return 1
          } else if (val < 0) {
            return -1
          } else {
            return 0
          }
        }
      },
      {
        title: '使用文档',
        dataIndex: 'devDoc',
        render (text) {
          return (
            <a>{text}</a>
          )
        }
      },
      {
        title: '部署文档',
        dataIndex: 'depDoc',
        render (text) {
          return (
            <a>{text}</a>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'handle',
        render (text, item: TemplateListItem) {
          return (
            <div className="to-handle">
              <a onClick={() => {history.push(`/project/template/${item.id}`)}}>编辑</a>
              <a style={{marginLeft: 5}}>版本记录</a>
              <a className="btn-del">删除</a>
            </div>
          )
        }
      }
    ]
    return (
      <div className="template-source-list">
        {this.state.showCreate ? <CreateTemplate onCreate={this.afterCreate} onCancel={this.onCancelCreate}></CreateTemplate> : null}
        <Form layout="inline" style={{marginBottom: '10px'}}>
          <Form.Item name="name" label="项目名称">
            <Input></Input>
          </Form.Item>
          <Form.Item name="version" label="版本">
            <Input></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.onCreate}>新建</Button>
          </Form.Item>
        </Form>
        <Table columns={columns} rowKey="id" dataSource={this.state.store}></Table>
      </div>
    )
  }
}
export default TemplateList