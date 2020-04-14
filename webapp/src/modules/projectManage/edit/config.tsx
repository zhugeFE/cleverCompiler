import * as React from 'react'
import './styles/config.less'
import { Table, message } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { GitConfig } from '../../../store/state/git';
import ajax from '../../../utils/ajax';
import api from '../../../store/api';

interface Props {
  store: GitConfig[],
  afterDelConfig? (configId: string): void;
}
interface State {
  columns: ColumnProps<GitConfig>[]
}
class GitConfigPanel extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    const that = this
    this.state = {
      columns: [
        {title: '文件位置', dataIndex: 'filePath', fixed: 'left'},
        {title: '类型', dataIndex: 'type'},
        {title: '匹配规则', dataIndex: 'reg', render (value) {
          if (!value) return <span>-</span>
          const val = JSON.parse(value)
          const reg = new RegExp(val.source, `${val.global ? 'g' : ''}${val.ignoreCase ? 'i' : ''}`)
          return (
            <span>{reg.toString()}</span>
          )
        }},
        {title: '目标内容', dataIndex: 'targetValue'},
        {title: '描述', dataIndex: 'desc'},
        {title: '操作', render (value: any, record: GitConfig) {
          return (
            <div>
              <a>编辑</a>
              <a style={{marginLeft: '5px'}} onClick={that.onDel.bind(that, record)}>删除</a>
            </div>
          )
        }}
      ]
    }
  }
  onDel (config: GitConfig) {
    ajax({
      url: api.git.delConfig,
      method: 'DELETE',
      params: {
        configId: config.id
      }
    })
    .then(() => {
      if (this.props.afterDelConfig) this.props.afterDelConfig(config.id)
    })
    .catch(err => {
      message.error('删除配置项失败')
      console.error('删除配置项失败', err)
    })
  }
  render () {
    return (
      <div className="git-config-panel">
        <Table bordered 
          pagination={false}
          columns={this.state.columns} 
          rowKey="id" 
          dataSource={this.props.store}></Table>
      </div>
    )
  }
}
export default GitConfigPanel