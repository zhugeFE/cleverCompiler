/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-05 20:08:04
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-30 15:00:50
 */
import * as React from 'react'
import styles from './styles/gitConfig.less'
import { Button, message, Table } from 'antd'
import type { GitConfig } from '@/models/git'
import { connect } from 'dva'
import type { Dispatch } from '@/.umi/plugin-dva/connect'
import { EditMode, TypeMode, VersionStatus } from '@/models/common'
import UpdateTextConfig from "./gitTextConfig";
import UpdateFileConfig from "./gitFileConfig";
import type { ConnectState } from '@/models/connect'

export interface GitConfigPanelProps {
  store: GitConfig[],
  mode: number;
  dispatch: Dispatch;
}
interface State {
  currentConfig: GitConfig | null;
}
class GitConfigPanel extends React.Component<GitConfigPanelProps, State> {
  constructor (props: GitConfigPanelProps) {
    super(props)
    this.state = {
      currentConfig: null
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
      callback: (res: boolean) => {
        if (res) {
          message.success({
            content: "删除配置项成功",
            duration: 0.5
          })
        } else {
          message.error({
            content: "删除配置项失败",
            duration: 0.5
          })
        }
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
    for (const key of Object.keys(formData)) {
      if (key == 'file') {
        form.append("files", formData[key].file)
      } else {
        form.append(key, formData[key])
      }
    }
    form.append("configId", this.state.currentConfig!.id)
    this.props.dispatch({
      type: 'git/updateConfig',
      payload: form,
      callback: () => {
        this.setState({
          currentConfig: null
        })
      }
    })
  }

  filterFunc = (key: string) => {
    const textList: string[] = []
    const data = []
    for (const item of this.props.store) {
      if ( !textList.includes(item[key])){
        textList.push(item[key])
        if (key == 'reg') {
          const val = JSON.parse(item[key])
          const reg = new RegExp(val.source, `${val.global ? 'g' : ''}${val.ignoreCase ? 'i' : ''}`)
          data.push({
            text: reg.toString(),
            value: item[key]
          })
        } else if ( key == 'targetValue' && item.type == '文件') {
          data.push({
            text: JSON.parse(item.targetValue).originalFilename,
            value: item.targetValue
          })
        } else {
          data.push ({
            text: item[key],
            value: item[key]
          })
        }
        
      }
    }
    return data
  }

  render () {
    const columns = [
      {
        title: '文件位置',
        dataIndex: 'filePath', 
        fixed: 'left',
        filters: this.filterFunc('filePath'),
        filterMode: 'tree',
        onFilter: (value: string, record: GitConfig) => record.filePath.indexOf(value) == 0, 
        filterSearch: true,
      },
      {
        title: '类型',
        dataIndex: 'type',
        filters: [
          {
            text: "文本",
            value: "文本"
          },
          {
            text: "文件",
            value: "文件"
          }
        ],
        filterMode: 'tree',
        onFilter: (value: string, record: GitConfig) => record.type.indexOf(value) == 0, 
        filterSearch: true,
      },
      {
        title: '匹配规则',
        dataIndex: 'reg', render (value) {
          if (!value) return <span>-</span>
          const val = JSON.parse(value)
          const reg = new RegExp(val.source, `${val.global ? 'g' : ''}${val.ignoreCase ? 'i' : ''}`)
          return (
            <span>{reg.toString()}</span>
          )
        },
        filters: this.filterFunc('reg'),
        filterMode: 'tree',
        onFilter: (value: string, record: GitConfig) => record.reg.indexOf(value) == 0,
        filterSearch: true,
      },
      {
        title: '目标内容',
        dataIndex: 'targetValue', render: (text: string, record) => {
          if (record.typeId == TypeMode.text) {
            return record.targetValue
          }else {
            return JSON.parse(record.targetValue).originalFilename
          }
        },
        filters: this.filterFunc('targetValue'),
        filterMode: 'tree',
        onFilter: (value: string, record: GitConfig) => record.targetValue.indexOf(value) == 0,
        filterSearch: true,
      },
      {
        title: '描述',
        dataIndex: 'description',
        filters: this.filterFunc('description'),
        filterMode: 'tree',
        onFilter: (value: string, record: GitConfig) => record.description.indexOf(value) == 0,
        filterSearch: true,
      },
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
    const {currentConfig} = this.state
    return (
      <div className={styles.gitConfigPanel}>
        {
          currentConfig && ((() => {
            let res = null
            switch (currentConfig.typeId) {
              case TypeMode.file:
                res = <UpdateFileConfig
                  mode={EditMode.update}
                  gitId={currentConfig.sourceId}
                  gitVersionId={currentConfig.versionId}
                  configInfo={currentConfig}
                  onCancel={this.onCancelEditConfig}
                  onSubmit={this.afterEditConfig}
                 />
                break
              case TypeMode.text:
                res = <UpdateTextConfig
                  mode={EditMode.update}
                  gitId={currentConfig.sourceId}
                  gitVersionId={currentConfig.versionId}
                  configInfo={currentConfig}
                  onCancel={this.onCancelEditConfig}
                  onSubmit={this.afterEditConfig}
                 />
                break
              default:
                console.warn('无法识别的配置类型', currentConfig)
            }
            return res
          })())
        }
        <Table 
          bordered 
          columns={columns} 
          rowKey="id" 
          pagination={{ showTotal(totle: number) {
            return (
              `总记录数${totle}`
            )
          }}}
          dataSource={this.props.store} />
      </div>
    )
  }
}
export default connect(({git}: ConnectState) => {
  return {
    store: git.currentVersion!.configs,
    mode: git.currentVersion!.status
  }
})(GitConfigPanel)