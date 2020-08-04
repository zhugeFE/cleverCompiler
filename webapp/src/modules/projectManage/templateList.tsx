import * as React from 'react'
import './styles/templateList.less'
import { Table, Button, Form, Input } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import history from '../../utils/history'
import CreateTemplate from './createTemplate'
interface Props {

}
interface Record {
  key: string,
  name: string,
  latest: string,
  devDoc: string,
  depDoc: string,
  update: number
}
interface State {
  store: Record[];
  showCreate: boolean;
}
class TemplateList extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      store: [],
      showCreate: true
    }
    this.onCreate = this.onCreate.bind(this)
  }
  onCreate () {
    this.setState({
      showCreate: true
    })
  }
  render () {
    const columns: ColumnProps<Record>[] = [
      {
        title: '项目名称',
        dataIndex: 'name'
      },
      {
        title: '最新版本',
        dataIndex: 'latest',
        showSorterTooltip: false,
        sorter (a:Record, b: Record) {
          const val = Number(a.latest.replace(/\D/g, '')) - Number(b.latest.replace(/\D/g, ''))
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
        title: '更新时间',
        dataIndex: 'update',
        render (text, record: Record) {
          return (
            <span>{new Date(record.update).toLocaleString()}</span>
          )
        },
        showSorterTooltip: false,
        sorter (a: Record, b: Record) {
          return a.update - b.update
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
        render (text, record: Record) {
          return (
            <div className="to-handle">
              <a onClick={() => {history.push(`/project/template/${record.key}`)}}>编辑</a>
              <a style={{marginLeft: 5}}>版本记录</a>
              <a className="btn-del">删除</a>
            </div>
          )
        }
      }
    ]
    return (
      <div className="template-source-list">
        {this.state.showCreate ? <CreateTemplate></CreateTemplate> : null}
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
        <Table columns={columns} dataSource={this.state.store}></Table>
      </div>
    )
  }
}
export default TemplateList