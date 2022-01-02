/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-27 16:13:10
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-02 14:05:50
 */
import type { TemplateGlobalConfig } from "@/models/template";
import type { ColumnProps  } from "antd/lib/table";
import { Button, Input, Select, Table } from 'antd';
import { connect } from "dva";
import React from "react";
import type { Dispatch } from "umi";
import TextGlobalConfig from "./TextGlobalConfig";
import FileGlobalConfig from "./FileGlobalConfig";
import styles from "./styles/projectGlobalConfig.less"
import { TypeMode } from "@/models/common";
import util from "@/utils/utils";
import GlobalConfigMarage from "./globalConfigMarage";


export interface Props {
  disabled?: boolean;
  globalConfigList: TemplateGlobalConfig[];
  onUpdateConfigHidden: (data: string[]) => void;
  onUpdateConfig: (config: TemplateGlobalConfig) => void;
  dispatch: Dispatch;
}

interface States {
  currentGlobalConfig: TemplateGlobalConfig | null;
  showGlobalConfigMarage: boolean;
  filterType: string;
  filterValue: string;
  searchVaild: boolean;
}

class ProjectGlobalConfig  extends React.Component<Props, States> {
    constructor(prop: Props){
      super(prop)
      this.state = {
        currentGlobalConfig: null,
        showGlobalConfigMarage: false,
        filterType: "name",
        filterValue: '',
        searchVaild: true,
      }
      this.onCancelConfig = this.onCancelConfig.bind(this)
      this.afterUpdateConfig = this.afterUpdateConfig.bind(this)
      this.filterSourceData = this.filterSourceData.bind(this)
      this.hideConfigManage = this.hideConfigManage.bind(this)
      this.updateConfigList = this.updateConfigList.bind(this)
      this.onClickConfigMarage = this.onClickConfigMarage.bind(this)
      this.onChangeFilterConfig = this.onChangeFilterConfig.bind(this)
      this.onChangeFilterType = this.onChangeFilterType.bind(this)
    }

    onCancelConfig() {
      this.setState({
        currentGlobalConfig: null
      })
    }

    afterUpdateConfig (data: {file?: File, targetValue: string}) {
      if (!this.state.currentGlobalConfig) return
      const globalConfig = util.clone(this.state.currentGlobalConfig)
      globalConfig.targetValue = data.targetValue
      if ( globalConfig.type == TypeMode.file) {
        globalConfig.file = data.file
      }
      this.onCancelConfig()
      this.props.onUpdateConfig(globalConfig)
    }

    onEdit(config: TemplateGlobalConfig){
      this.setState({
        currentGlobalConfig: config
      })
    }

    updateConfigList (data: string[]) {
      this.props.onUpdateConfigHidden(data)
      this.hideConfigManage()
    }
    hideConfigManage () {
      this.setState({
        showGlobalConfigMarage: false
      })
    }
    onClickConfigMarage () {
      this.setState({
        showGlobalConfigMarage: true
      })
    }

    filterSourceData (configList: TemplateGlobalConfig[], isHidden: number): TemplateGlobalConfig[] {
      return configList.filter( item => item.isHidden == isHidden)
    }


    visableSourceData (configList: TemplateGlobalConfig[]): TemplateGlobalConfig[] {
      return configList.filter( item => item.visable == 1)
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

    filterData (data: TemplateGlobalConfig[]) {    
      return data.filter( item => {
        if ( this.state.filterType == 'targetValue' && item.type == 1) {
          return JSON.parse(item.targetValue).originalFilename.includes(this.state.filterValue)
        } else if ( this.state.filterType == 'type'){
          const content = item[this.state.filterType] ? "文件" : "文本"        
          return content.includes(this.state.filterValue)
        } else {                
          return item[this.state.filterType]?.includes(this.state.filterValue)
        }
      })
    }

    render () {
      const columns: ColumnProps<TemplateGlobalConfig>[] = [
        { title: '名称', dataIndex: 'name', fixed: 'left' },
        {
          title: '类型',
          width: 80,
          dataIndex: 'type',
          render(value) {
            if (value === 0) return <span>文本</span>;
            if (value === 1) return <span>文件</span>;
            if (value === 2) return <span>json</span>;
          },
        },
        {title: '目标内容', width: 200, ellipsis: true, dataIndex: 'targetValue', render: (text: string, record) => {
          if (record.type == TypeMode.text) {
            return record.targetValue
          }else {
            return JSON.parse(record.targetValue).originalFilename
          }
        }},        
        { title: '描述', dataIndex: 'description' },
        {
          title: '操作',
          render: (value: any, record: TemplateGlobalConfig) => {
            return (
              <div>
                <Button onClick={this.onEdit.bind(this, record)} disabled={this.props.disabled}>编辑</Button>
                {
                  record.isHidden == 1 &&
                  <Button
                    disabled={this.props.disabled}
                    onClick={() => {this.props.onUpdateConfigHidden([record.id])}}>隐藏</Button>
                }
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
          text: "目标内容",
          value: "targetValue"
        },
        {
          text: "描述",
          value: "description"
        }
      ]
      return (
        <div className={styles.projectGlobalConfigPanel}>
          {
            this.state.currentGlobalConfig &&(
              this.state.currentGlobalConfig.type == TypeMode.text ? (
                <TextGlobalConfig
                  globalConfig={this.state.currentGlobalConfig}
                  onCancel={this.onCancelConfig}
                  onSubmit={this.afterUpdateConfig}
                 />
              ) : (
                <FileGlobalConfig
                  globalConfig={this.state.currentGlobalConfig}
                  onCancel={this.onCancelConfig}
                  onSubmit={this.afterUpdateConfig}
                 />
              )
            )
          }
          <GlobalConfigMarage
            visible={this.state.showGlobalConfigMarage}
            disabled={this.props.disabled}
            dataSource={
              this.filterSourceData(this.props.globalConfigList, 1)
            }
            onAddConfig={this.updateConfigList}
            onCancel={this.hideConfigManage}
          /> 
          <div className={styles.projectFilterPanel}>
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
                onClick={this.onClickConfigMarage}>配置项管理</Button>
            </Input.Group>
          </div>
          <Table
            bordered
            columns={columns}
            rowKey="id"
            dataSource={this.visableSourceData(this.filterData(this.props.globalConfigList))}
            pagination={{
              showTotal(totle: number) {
                return `总记录数${totle}`;
              },
            }}/>
        </div>
      )
    }
}

export default connect()(ProjectGlobalConfig)