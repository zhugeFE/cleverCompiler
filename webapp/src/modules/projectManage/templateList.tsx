import * as React from 'react'
import './styles/templateList.less'
import { Table, Button } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
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
  store: Record[],
  rowSelection: TableRowSelection<Record>
}
class TemplateList extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      store: [
        {
          key: 'xxx', 
          name: 'webapp', 
          latest: '1.0.3', 
          update: new Date().getTime(),
          devDoc: 'http://xx.com/a', 
          depDoc: 'http://xx.com/b'
        },
        {
          key: 'aaa', 
          name: 'sdkv', 
          latest: '1.2.2', 
          update: new Date().getTime(),
          devDoc: 'http://xx.com/a', 
          depDoc: 'http://xx.com/b'
        }
      ],
      rowSelection: {
        getCheckboxProps: (record: Record) => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        })
      }
    }
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
        render () {
          return (
            <div className="to-handle">
              <a>编辑</a>
              <a className="btn-del">删除</a>
            </div>
          )
        }
      }
    ]
    return (
      <div className="template-source-list">
        <Table columns={columns} dataSource={this.state.store}></Table>
      </div>
    )
  }
}
export default TemplateList