import * as React from 'react'
import './config.less'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'

interface Props {
  store: Record[]
}
interface Record {

}
interface State {
  columns: ColumnProps<Record>[]
}
class GitConfigPanel extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      columns: [
        {title: '名称', dataIndex: 'name'},
        {title: '类型', dataIndex: 'type'},
        {title: '文件位置', dataIndex: 'filePath'},
        {title: '匹配规则', dataIndex: 'reg'},
        {title: '描述', dataIndex: 'desc'},
        {title: '操作', render () {
          return (
            <div>
              <a>编辑</a>
              <a>删除</a>
            </div>
          )
        }}
      ]
    }
  }
  render () {
    return (
      <div className="git-config-panel">
        <Table bordered columns={this.state.columns} dataSource={this.props.store}></Table>
      </div>
    )
  }
}
export default GitConfigPanel