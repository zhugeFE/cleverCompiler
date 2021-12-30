/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-27 16:13:19
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-30 22:50:56
 */

import { TypeMode } from "@/models/common";
import type { TemplateConfig, TemplateGlobalConfig, TemplateVersionGit } from "@/models/template";
import { Button, Empty, Table, Tabs } from "antd";
import type { ColumnProps } from "antd/lib/table";
import { connect } from "dva";
import React from "react"
import styles from './styles/projectConfig.less';
import TextConfigEdit from "./TextConfigEdit";
import FileConfigEdit from "./FileConfigEdit";
import util from "@/utils/utils";
import ConfigMarage from "./configMarage";

interface Props {
  disabled?: boolean;
  globalConfigList: TemplateGlobalConfig[];
  activeKey: string;
  gitList: TemplateVersionGit[];
  onUpdateConfigHidden: (data: string[]) => void;
  onChangeActiveKey: (activeKey: string) => void;
  onUpdateConfig: (config: TemplateConfig) => void;
}

interface States {
  currentConfig: TemplateConfig | null,
  showMarageConfig: boolean,
}

class ProjectConfig extends React.Component <Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      currentConfig: null,
      showMarageConfig: false,
    }
    this.onCancelEditConfig = this.onCancelEditConfig.bind(this)
    this.onClickConfig = this.onClickConfig.bind(this)
    this.afterUpdateConfig = this.afterUpdateConfig.bind(this)
    this.onClickConfigMarage = this.onClickConfigMarage.bind(this)
    this.onChangeTabs = this.onChangeTabs.bind(this)
    this.filterSourceData = this.filterSourceData.bind(this)
    this.hideConfigManage = this.hideConfigManage.bind(this)
    this.updateConfigList = this.updateConfigList.bind(this)
  }


  onChangeTabs (activeKey: string) {
    this.props.onChangeActiveKey(activeKey)
  }
  onCancelEditConfig () {
    this.setState({
      currentConfig: null
    })
  }
  onClickConfigMarage () {
    this.setState({
      showMarageConfig: true
    })
  }
  updateConfigList (data: string[]) {
    this.props.onUpdateConfigHidden(data)
    this.hideConfigManage()
  }

  hideConfigManage () {
    this.setState({
      showMarageConfig: false
    })
  }
  afterUpdateConfig (data: {file?: File, targetValue: string}) {
    if (!this.state.currentConfig) return
    const config = util.clone(this.state.currentConfig)
    config.targetValue = data.targetValue
    if ( config.typeId == TypeMode.file) {
      config.file = data.file
    }

    this.onCancelEditConfig()

    this.props.onUpdateConfig(config)

  }

  onClickConfig(config: TemplateConfig) {
    this.setState({
      currentConfig: config
    })
  }

  filterSourceData (configList: TemplateConfig[], isHidden: number): TemplateConfig[] {
    return configList.filter( item => item.isHidden == isHidden)
  }

  visableSourceData (configList: TemplateConfig[]): TemplateConfig[] {
    return configList.filter( item => item.visable == 1)
  }
  render () {
    
    const columns: ColumnProps<TemplateConfig>[] = [
      { title: '文件位置', width: 100, ellipsis: true, dataIndex: 'filePath', fixed: 'left' },
      {
        title: '默认值',
        width: 180,
        ellipsis: true,
        render: (record: TemplateConfig) => {
          if ( record.globalConfigId) {
            return "-"
          }else {
            return record.typeId == TypeMode.text ? record.targetValue : JSON.parse(record.targetValue).originalFilename
          }
        },
      },
      {
        title: "全局配置",
        width: 150,
        ellipsis: true,
        render: (record: TemplateConfig) => {
          return (
            record.globalConfigId ? this.props.globalConfigList.filter(item => item.id == record.globalConfigId)[0].name : "-"
          )
        }
      },
      { title: '描述', width: 100, dataIndex: 'description' },
      {
        title: '类型',
        width: 60,
        dataIndex: 'typeId',
        render(value) {
          if (value === 0) return <span>文本</span>;
          if (value === 1) return <span>文件</span>;
        },
      },
      {
        title: '匹配规则',
        width: 200,
        ellipsis: true,
        dataIndex: 'reg',
        render(value) {
          if (!value) return <span>-</span>;
          const val = JSON.parse(value);
          const reg = new RegExp(
            val.source,
            `${val.global ? 'g' : ''}${val.ignoreCase ? 'i' : ''}`,
          );
          return <span>{reg.toString()}</span>;
        },
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        render: (value: any, record: TemplateConfig) => {
          return (
            <div>
              <Button
                disabled={!!record.globalConfigId || this.props.disabled}
                onClick={this.onClickConfig.bind(this, record)}>编辑</Button>
              {
              record.isHidden == 1 &&
              <Button
                disabled={!!record.globalConfigId || this.props.disabled}
                onClick={() => {this.props.onUpdateConfigHidden([record.id])}}>隐藏</Button>
              }
            </div>
          );
        },
      },
    ];
    return (
      <div className={styles.projectPanel}>
        {
          this.state.currentConfig && (
            this.state.currentConfig.typeId == TypeMode.text ? (
              <TextConfigEdit
                config={this.state.currentConfig}
                gitId={this.props.gitList[0].gitSourceId}
                gitVersionId={this.props.gitList[0].gitSourceVersionId}
                onCancel={this.onCancelEditConfig}
                onSubmit={this.afterUpdateConfig}
               />
            ) : (
              <FileConfigEdit
                config={this.state.currentConfig}
                onCancel={this.onCancelEditConfig}
                onSubmit={this.afterUpdateConfig}
               />
            )
          )
        }

        {
          this.props.activeKey &&
          <ConfigMarage
            visible={this.state.showMarageConfig}
            disabled={this.props.disabled}
            dataSource={
              this.filterSourceData(this.props.gitList.filter(item => item.id == this.props.activeKey)[0].configList, 1)
            }
            onAddConfig={this.updateConfigList}
            onCancel={this.hideConfigManage}
         />}
          
        
        { !this.props.gitList.length ? (
          <Tabs type="card" 
          className={styles.cardBg} 
          >
            <Tabs.TabPane tab="引导页" className={styles.initTabs}>
              <Empty />
            </Tabs.TabPane>
          </Tabs>
        ) : (
          <Tabs
            type="card"
            className={styles.cardBg}
            activeKey={this.props.activeKey}
            onChange={this.onChangeTabs}
            >
            {this.props.gitList.map((item, index) => {
              return (
                <Tabs.TabPane className={styles.tabPanel} tab={`${item.name}-${item.version}`} key={item.id}>
                  <div className={styles.tabHandle}>
                    <Button size="small" onClick={this.onClickConfigMarage}>配置项管理</Button>
                  </div>
                  <Table
                    columns={columns}
                    rowKey="id"
                    dataSource={this.visableSourceData(item.configList)}
                    pagination={{
                      showTotal(totle: number) {
                        return `总记录数${totle}`;
                      },
                    }}/>
                </Tabs.TabPane>
              )
            })}
          </Tabs>
        )}

      </div>
    )
  }
}


export default connect()(ProjectConfig)