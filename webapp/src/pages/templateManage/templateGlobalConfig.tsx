/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-11 17:57:37
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-13 14:55:53
 */

import * as React from 'react';
import {Button, Input, message, Select, Space, Table } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import type { Dispatch } from '@/.umi/plugin-dva/connect';
import type { TemplateGlobalConfig, TemplateVersionGit } from '@/models/template';
import UpdateTextGlobalConfig from './addTemplateGlobalTextConfig';
import UpdateFileGlobalConfig from './addTemplateGlobalFileConfig';
import { EditMode, TypeMode, VersionStatus } from '@/models/common';
import styles from './styles/templateGlobalConfig.less';
import type { ConnectState } from '@/models/connect';


export interface GitConfigPanelProps {
  mode: VersionStatus;
  globalConfigList: TemplateGlobalConfig[];
  gitList: TemplateVersionGit[];
  onAddGlobalConfig: () => void;
  signArr: string[];
  setSignArr: (data: string[]) => void;
  dispatch: Dispatch;
}
interface State {
  showGlobalConfig: boolean;
  mode: string;
  currentGlobalConfig: TemplateGlobalConfig | null ;
  filterType: string;
  filterValue: string;
  searchVaild: boolean;
  selectedRowKeys: string[]
}
class GlobalConfigPanel extends React.Component<GitConfigPanelProps, State> {
  constructor(props: GitConfigPanelProps) {
    super(props);
    this.state = {
      showGlobalConfig: false,
      mode: "add",
      currentGlobalConfig: null,
      filterType: "name",
      filterValue: '',
      searchVaild: true,
      selectedRowKeys: []
    };
    
    this.afterEditConfig = this.afterEditConfig.bind(this)
    this.onCancelEditConfig = this.onCancelEditConfig.bind(this)
    this.onChangeFilterConfig = this.onChangeFilterConfig.bind(this)
    this.onChangeFilterType = this.onChangeFilterType.bind(this)
    this.onBatchOption = this.onBatchOption.bind(this)
    this.rowSelectChange = this.rowSelectChange.bind(this)
    this.referenceComputer = this.referenceComputer.bind(this)
  }
  

  onSign (e, config: TemplateGlobalConfig) {
    let data = []
    if (e.target.innerText == '取消标记') {
      data = this.props.signArr.filter( item => item != config.id)
    }else {
      data = [...this.props.signArr, config.id]
    }
    this.props.setSignArr(data)
  }
  onEdit(config: TemplateGlobalConfig , type: string){
    switch(type){
      case "edit": {
        this.setState({
          currentGlobalConfig: config
        })
        break
      }
      case "delete": {
        this.props.dispatch({
          type: 'template/delGlobalConfig',
          payload: config.id,
          callback: (res: boolean) => {
            if (res) {
              message.success({
                content: "删除成功",
                duration: 0.5
              })
            } else {
              message.error({
                content: "删除失败",
                duration: 0.5
              })
            }
          }
        });
        break;
      }
      case "hidden": {
        this.props.dispatch({
          type: 'template/updateGlobalConfigStatus',
          payload: {
            configList: [
              {
                id: config.id,
                status: Number(!config.isHidden)
              }
            ]
          },
          callback: (res: boolean) => {
            if (res) {
              message.success({
                content:"修改状态成功",
                duration: 0.5
              })
            } else {
              message.error({
                content:"修改状态失败",
                duration: 0.5,
              })
            }
          }
        })
      }
    }
  }


  onCancelEditConfig(){
    this.setState({
      currentGlobalConfig: null
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
    form.append("configId", this.state.currentGlobalConfig!.id)
    this.props.dispatch({
      type: 'template/updateGlobalConfig',
      payload: form,
      callback: (res: boolean) => {
        if (res) {
          message.success({
            content: "修改成功",
            duration: 0.5
          })
          this.setState({
            currentGlobalConfig: null
          })
        } else {
          message.error({
            content: "修改失败",
            duration: 0.5
          })
        }
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
  
  rowSelectChange (selectedRowKeys: React.Key[]) {
    const arr = selectedRowKeys.map(item => String(item))
    this.setState({
      selectedRowKeys: arr
    })
  }
  onBatchOption (order: string) {
    if (this.state.selectedRowKeys.length == 0) return
    const data = this.state.selectedRowKeys.map( item => { return {id: item, status: order === 'hidden' ? 1 : 0}})
    this.props.dispatch({
      type: 'template/updateGlobalConfigStatus',
      payload: {
        configList: data
      },
      callback: (res: boolean) => {
        if (res) {
          message.success({
            content: "状态修改成功",
            duration: 0.5
          })
        } else {
          message.error({
            content: "状态修改失败",
            duration: 0.5
          })
        }
      }
    })
  }

  referenceComputer (record: TemplateGlobalConfig) {
    let gitCount = 0
    let configCount = 0
    this.props.gitList.forEach( git => {
      let flag = false
      git.configList.forEach( config => {
        if (config.globalConfigId == record.id) {
          configCount += 1
          flag = true
        }
      })
      if (flag) gitCount++
    })
    return `git: ${gitCount} config: ${configCount}`
  }
  
  render() {
    const columns: ColumnProps<TemplateGlobalConfig>[] = [
      { 
        title: '名称', 
        ellipsis: true, 
        dataIndex: 'name', 
        fixed: 'left',
        sorter: (rowA: TemplateGlobalConfig , rowB: TemplateGlobalConfig) => {
          const reg = /[a-zA-Z0-9]/
          if (reg.test(rowA.name) || reg.test(rowB.name)) {
            if (rowA.name > rowB.name) {
              return 1
            } else if (rowA.name < rowB.name) {
              return -1
            } else {
              return 0
            }
          } else {
            return rowA.name.localeCompare(rowB.name)
          }
        }
      },
      {
        title: '类型',
        dataIndex: 'type',
        render(value) {
          if (value === 0) return <span>文本</span>;
          if (value === 1) return <span>文件</span>;
        }
      },
      {
        title: '目标内容', 
        ellipsis: true, 
        dataIndex: 'targetValue',
        sorter: (rowA: TemplateGlobalConfig , rowB: TemplateGlobalConfig) => {
          const reg = /[a-zA-Z0-9]/
          if (reg.test(rowA.targetValue) || reg.test(rowB.targetValue)) {
            if (rowA.targetValue > rowB.targetValue) {
              return 1
            } else if (rowA.targetValue < rowB.targetValue) {
              return -1
            } else {
              return 0
            }
          } else {
            return rowA.targetValue.localeCompare(rowB.targetValue)
          }
        },
        render: (text: string, record) => {
          if (record.type == TypeMode.text) {
            return record.targetValue
          }else {
            return JSON.parse(record.targetValue).originalFilename
          }
      }},
      { 
        title: '描述', 
        ellipsis:true, 
        dataIndex: 'description'
      },
      {
        title: '是否隐藏',
        dataIndex: 'isHidden',
        render(value: any) {
          return <>{value ? '是' : '否'}</>;
        }
      },
      {
        title: "引用",
        sorter: (rowA: TemplateGlobalConfig , rowB: TemplateGlobalConfig) => {
          const rowAref = this.referenceComputer(rowA)
          const rowBref = this.referenceComputer(rowB)
          return rowAref.localeCompare(rowBref)
        },
        render: (record: TemplateGlobalConfig) => {
          return this.referenceComputer(record)
        }
      },
      {
        title: '操作',
        width: "30%",
        render: (value: any, record: TemplateGlobalConfig) => {
          return (
            <div>
              <Space wrap>
                <Button
                  type="primary"
                  disabled={this.props.mode != VersionStatus.normal || !!record.isHidden}
                  onClick={this.onEdit.bind(this, record , 'edit')}>编辑</Button>
                <Button 
                  disabled={this.props.mode != VersionStatus.normal}
                  onClick={this.onEdit.bind(this, record, 'hidden')}>
                  {record.isHidden ? "启用" : "隐藏"}
                </Button>
                <Button 
                  type="primary" 
                  danger 
                  onClick={this.onEdit.bind(this, record, 'delete')}>
                  删除
                </Button>
                <Button 
                  type="primary" 
                  onClick={(event) => this.onSign(event,record)}>
                  {this.props.signArr.includes(record.id) ? "关闭引用" : "查看引用"}
                </Button>
              </Space>
            </div>
          );
        },
      },
    ];
    const filterType = [
      {
        text: "名称",
        value: "name"
      },
      {
        text: "类型",
        value: "type"
      },
      {
        text: "是否隐藏",
        value: "isHidden"
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
    const data = this.props.globalConfigList.filter( item => {
      if ( this.state.filterType == 'targetValue' && item.type == 1) {
        return JSON.parse(item.targetValue).originalFilename.includes(this.state.filterValue)
      } else if ( this.state.filterType == 'type'){
        const content = item[this.state.filterType] ? "文件" : "文本"        
        return content.includes(this.state.filterValue)
      } else if ( this.state.filterType == 'isHidden') {
        const content = item[this.state.filterType] ? "是" : "否"        
        return content.includes(this.state.filterValue)
      } else {                
        return item[this.state.filterType]?.includes(this.state.filterValue)
      }
    })
    return (
      <div>
        {
          this.state.currentGlobalConfig && (
            this.state.currentGlobalConfig.type === TypeMode.text ? (
              <UpdateTextGlobalConfig
                mode={EditMode.update}
                templateId={this.state.currentGlobalConfig.templateId}
                templateVersionId={this.state.currentGlobalConfig.templateVersionId}
                globalConfig={this.state.currentGlobalConfig}
                onCancel={this.onCancelEditConfig}
                onSubmit={this.afterEditConfig}
               />
            ) : (
              <UpdateFileGlobalConfig
                mode={EditMode.update}
                templateId={this.state.currentGlobalConfig.templateId}
                templateVersionId={this.state.currentGlobalConfig.templateVersionId}
                globalConfig={this.state.currentGlobalConfig}
                onCancel={this.onCancelEditConfig}
                onSubmit={this.afterEditConfig}
               />
            )
          )
        }
        <div className={styles.templateFilterPanel}>
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
            <div>
              <Space>
                <Button 
                  className={styles.btnAddConfigItem} 
                  type='primary'
                  disabled={this.props.mode !== VersionStatus.normal}
                  onClick={this.props.onAddGlobalConfig}>添加配置项</Button>
                <Button 
                  className={styles.btn}
                  disabled={!this.state.selectedRowKeys.length}
                  type="primary" 
                  onClick={this.onBatchOption.bind(this, 'display')}>批量显示</Button>
                <Button 
                  className={styles.btn}
                  danger 
                  disabled={!this.state.selectedRowKeys.length}
                  onClick={this.onBatchOption.bind(this, 'hidden')}>批量隐藏</Button>
              </Space>
            </div>
          </Input.Group>
        </div>
        <Table
          bordered
          columns={columns}
          rowSelection={{
            type: "checkbox",
            onChange: this.rowSelectChange
          }}
          rowKey="id"
          dataSource={data}
          rowClassName={ (record) => record.isHidden ? styles.disable : ""}
          pagination={{
            showTotal(totle: number) {
              return `总记录数${totle}`;
            },
          }}/>
      </div>
    );
  }
}
export default connect( ({template}: ConnectState) => {
  return {
    mode: template.currentVersion?.status!,
    gitList: template.currentVersion?.gitList!,
    globalConfigList: template.currentVersion?.globalConfigList!,
  }
})(GlobalConfigPanel);
