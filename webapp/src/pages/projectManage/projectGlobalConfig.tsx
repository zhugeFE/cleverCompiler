/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-27 16:13:10
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-30 14:40:50
 */
import type { TemplateGlobalConfig } from "@/models/template";
import type { ColumnProps  } from "antd/lib/table";
import { Button, Table } from 'antd';
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
}

class ProjectGlobalConfig  extends React.Component<Props, States> {
    constructor(prop: Props){
      super(prop)
      this.state = {
        currentGlobalConfig: null,
        showGlobalConfigMarage: false
      }
      this.onCancelConfig = this.onCancelConfig.bind(this)
      this.afterUpdateConfig = this.afterUpdateConfig.bind(this)
      this.filterSourceData = this.filterSourceData.bind(this)
      this.hideConfigManage = this.hideConfigManage.bind(this)
      this.updateConfigList = this.updateConfigList.bind(this)
      this.onClickConfigMarage = this.onClickConfigMarage.bind(this)
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
          <Table
            bordered
            columns={columns}
            rowKey="id"
            dataSource={this.visableSourceData(this.props.globalConfigList)}
            pagination={{
              showTotal(totle: number) {
                return `总记录数${totle}`;
              },
            }}/>
          <Button onClick={this.onClickConfigMarage}>配置项管理</Button>

        </div>
      )
    }
}

export default connect()(ProjectGlobalConfig)