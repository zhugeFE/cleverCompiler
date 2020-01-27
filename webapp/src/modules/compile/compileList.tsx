import * as React from 'react'
// import './styles/templateList.less'
import { Table, Button } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import { compileType } from '../../constants/index';
interface Props {

}
interface Record {
  key: string,
  name: string,
  latest: string,
  update: number,
  createTime: number,
  compileType: compileType,
  lastCompiler: string
}
interface State {
  store: Record[],
  rowSelection: TableRowSelection<Record>
}
class CompileList extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      store: [
        {
          key: 'xxx', 
          name: 'webapp', 
          latest: '1.0.3', 
          update: new Date().getTime(),
          createTime: new Date().getTime(),
          compileType: compileType.privateDep,
          lastCompiler: '张三'
        },
        {
          key: 'aaa', 
          name: 'sdkv', 
          latest: '1.2.2', 
          update: new Date().getTime(),
          createTime: new Date().getTime(),
          compileType: compileType.production,
          lastCompiler: '李四'
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
        title: '编译类型',
        dataIndex: 'compileType',
        render (text) {
          let labelMap:any = {}
          labelMap[compileType.privateDep] = '私有部署'
          labelMap[compileType.production] = '生产环境'
          labelMap[compileType.test] = '测试环境'
          return (
            <span>{labelMap[text]}</span>
          )
        }
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
        title: '上次编译时间',
        dataIndex: 'update',
        render (text, record: Record) {
          return (
            <span>{new Date(record.update).toLocaleString()}</span>
          )
        },
        sorter (a: Record, b: Record) {
          const val = a.update - b.update
          return val
        }
      },
      {
        title: '上次编译人',
        dataIndex: 'lastCompiler'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render (text) {
          return (
            <span>{new Date(text).toLocaleString()}</span>
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
export default CompileList