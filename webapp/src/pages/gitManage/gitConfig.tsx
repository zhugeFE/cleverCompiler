/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-05 20:08:04
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-05 10:16:12
 */
import * as React from 'react'
import styles from './styles/gitConfig.less'
import { Button, Select, Input, message, Table } from 'antd'
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
  onAddConfig: () => void;
}
interface State {
  currentConfig: GitConfig | null;
  filterType: string;
  filterValue: string;
  searchVaild: boolean;
}
class GitConfigPanel extends React.Component<GitConfigPanelProps, State> {
  constructor (props: GitConfigPanelProps) {
    super(props)
    this.state = {
      currentConfig: null,
      filterType: "filePath",
      filterValue: "",
      searchVaild: true,
    }
    this.onCancelEditConfig = this.onCancelEditConfig.bind(this)
    this.afterEditConfig = this.afterEditConfig.bind(this)
    this.onChangeFilterConfig = this.onChangeFilterConfig.bind(this)
    this.onChangeFilterType = this.onChangeFilterType.bind(this)
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

  onChangeFilterType (value: string) {
    this.setState({
      filterType: value
    })    
  }
  onChangeFilterConfig (e: { target: { value: any } }) {
    // 防抖处理 300ms
    if ( !this.state.searchVaild ) {
      return 
    } 
    this.setState({
      searchVaild: false
    })
    setTimeout(() => {
      this.setState({
        searchVaild: true,
        filterValue: e.target.value
      })
    }, 300)
  }
 
  

  render () {
    const filterType = [
      {
        text: "文件位置",
        value: "filePath"
      },
      {
        text: "类型",
        value: "type"
      },
      {
        text: "匹配规则",
        value: "reg"
      },
      {
        text: "目标内容",
        value: "targetValue"
      },
      {
        text: "描述",
        value: "description"
      }
    ]
    const columns = [
      {
        title: '文件位置',
        dataIndex: 'filePath', 
        fixed: 'left'
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '匹配规则',
        dataIndex: 'reg', 
        render (value) {
          if (!value) return <span>-</span>
          const val = JSON.parse(value)
          const reg = new RegExp(val.source, `${val.global ? 'g' : ''}${val.ignoreCase ? 'i' : ''}`)
          return (
            <span>{reg.toString()}</span>
          )
        }
      },
      {
        title: '目标内容',
        dataIndex: 'targetValue', render: (text: string, record) => {
          if (record.typeId == TypeMode.text) {
            return record.targetValue
          }else {
            return JSON.parse(record.targetValue).originalFilename
          }
        }
      },
      {
        title: '描述',
        dataIndex: 'description'
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
    const data = this.props.store.filter( item => {
      if ( this.state.filterType == 'targetValue' && item.typeId == 1) {
        return JSON.parse(item.targetValue).originalFilename.includes(this.state.filterValue)
      } else {        
        return item[this.state.filterType]?.includes(this.state.filterValue)
      }
    })
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
        <div className={styles.gitFilterPanel}>
          <Input.Group compact>
            <Select defaultValue={filterType[0].value}
               onChange={this.onChangeFilterType}
            >
              {
                filterType.map( item => <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>)
              }
            </Select>
            <Input
              onChange={this.onChangeFilterConfig}
              placeholder='输入筛选内容'
              style={{width: "300px"}}
            />
            <Button 
              className={styles.btnAddConfigItem} 
              type='primary'
              disabled={this.props.mode !== VersionStatus.normal}
              onClick={this.props.onAddConfig}>添加配置项</Button>
          </Input.Group>
        </div>
        <Table 
          bordered 
          columns={columns} 
          rowKey="id"
          pagination={{ showTotal(totle: number) {
            return (
              `总记录数${totle}`
            )
          }}}
          dataSource={data} />
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