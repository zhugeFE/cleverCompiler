/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-05 20:08:04
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-08 19:43:21
 */
import * as React from 'react'
import styles from './styles/gitConfig.less'
import { Button, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { GitConfig } from '@/models/git'
import { connect } from 'dva'
import { Dispatch } from '@/.umi/plugin-dva/connect'
import { EditMode, TypeMode, VersionStatus } from '@/models/common'
import UpdateTextConfig from "./gitTextConfig";
import UpdateFileConfig from "./gitFileConfig";

export interface GitConfigPanelProps {
  store: GitConfig[],
  mode: number | undefined;
  onSubmit? (config: GitConfig): void,
  afterDelConfig? (configId: string): void;
  dispatch: Dispatch;
}
interface State {
  currentConfig: GitConfig | null;
  columns: ColumnProps<GitConfig>[]
}
class GitConfigPanel extends React.Component<GitConfigPanelProps, State> {
  constructor (props: GitConfigPanelProps) {
    super(props)
    this.state = {
      currentConfig: null,
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
        {title: '目标内容', dataIndex: 'targetValue', render: (text: string, record) => {
          if (record.typeId == TypeMode.text) {
            return record.targetValue
          }else {
            return JSON.parse(record.targetValue)['originalFilename']
          }
        }},
        {title: '描述', dataIndex: 'description'},
        {title: '操作', render: (value: any, record: GitConfig) =>{
          return (
            <div>
              <Button 
                type="primary"
                style={{marginLeft: '5px'}} 
                disabled={this.props.mode != VersionStatus.normal}
                onClick={this.onTableClick.bind(this, 'edit', record)}>编辑</Button>
              <Button 
                danger 
                disabled={this.props.mode != VersionStatus.normal}
                style={{marginLeft: '5px'}} 
                onClick={this.onTableClick.bind(this, 'delete', record)}>删除</Button>
            </div>
          )
        }}
      ]
    }
    this.onCancelEditConfig = this.onCancelEditConfig.bind(this)
    this.afterEditConfig = this.afterEditConfig.bind(this)
  }

  onTableClick ( order: string, config: GitConfig) {
    if (this[order]) this[order](config)
  }
  edit (config: GitConfig) {
    if (this.props.mode != VersionStatus.normal)return
    this.setState({
      currentConfig: config
    })
  }
  delete (config: GitConfig) {
    this.props.dispatch({
      type: 'git/delConfig',
      payload: config.id,
      callback: () => {
        if (this.props.afterDelConfig) this.props.afterDelConfig(config.id)
      }
    })
  }

  onCancelEditConfig () {
    this.setState({
      currentConfig: null
    })
  }

  afterEditConfig (formData: any) {
    const form = new FormData()
    for (let key of Object.keys(formData)) {
      if (key == 'file') {
        form.append("files", formData[key]['file'])
      } else {
        form.append(key, formData[key])
      }
    }
    form.append("configId", this.state.currentConfig!.id)
    this.props.dispatch({
      type: 'git/updateConfig',
      payload: form,
      callback: (config: GitConfig) => {
        this.setState({
          currentConfig: null
        })
        if (this.props.onSubmit) this.props.onSubmit(config)
      }
    })
  }

  render () {
    return (
      <div className={styles.gitConfigPanel}>
        {
          this.state.currentConfig && (
            this.state.currentConfig.typeId === TypeMode.text ? (
              <UpdateTextConfig
                mode={EditMode.update}
                gitId={this.state.currentConfig.sourceId}
                gitVersionId={this.state.currentConfig.versionId}
                configInfo={this.state.currentConfig}
                onCancel={this.onCancelEditConfig}
                onSubmit={this.afterEditConfig}
              ></UpdateTextConfig>
            ) : (
              <UpdateFileConfig
                mode={EditMode.update}
                gitId={this.state.currentConfig.sourceId}
                gitVersionId={this.state.currentConfig.versionId}
                configInfo={this.state.currentConfig}
                onCancel={this.onCancelEditConfig}
                onSubmit={this.afterEditConfig}
              ></UpdateFileConfig>
            )
          )
        }
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