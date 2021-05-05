import * as React from 'react'
import styles from './styles/gitConfig.less'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { GitConfig } from '@/models/git'
import { connect } from 'dva'
import { Dispatch } from '@/.umi/plugin-dva/connect'

export interface GitConfigPanelProps {
  store: GitConfig[],
  afterDelConfig? (configId: string): void;
  dispatch: Dispatch;
}
interface State {
  columns: ColumnProps<GitConfig>[]
}
class GitConfigPanel extends React.Component<GitConfigPanelProps, State> {
  constructor (props: GitConfigPanelProps) {
    super(props)
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
    this.props.dispatch({
      type: 'git/delConfig',
      payload: config.id,
      callback: () => {
        if (this.props.afterDelConfig) this.props.afterDelConfig(config.id)
      }
    })
  }
  render () {
    return (
      <div className={styles.gitConfigPanel}>
        <Table bordered 
          pagination={false}
          columns={this.state.columns} 
          rowKey="id" 
          dataSource={this.props.store}></Table>
      </div>
    )
  }
}
export default connect()(GitConfigPanel)