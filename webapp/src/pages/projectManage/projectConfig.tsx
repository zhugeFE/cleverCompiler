/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-27 16:13:19
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-05 11:23:06
 */

import { TypeMode } from "@/models/common";
import type { TemplateConfig, TemplateGlobalConfig, TemplateVersionGit } from "@/models/template";
import { Badge, Button, Empty, Input, Select, Table, Tabs } from "antd";
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
  signArr: string[];
  gitList: TemplateVersionGit[];
  onUpdateConfigHidden: (data: string[]) => void;
  onChangeActiveKey: (activeKey: string) => void;
  onUpdateConfig: (config: TemplateConfig) => void;
}

interface States {
  currentConfig: TemplateConfig | null;
  showMarageConfig: boolean;
  filterType: string;
  filterValue: string;
  searchVaild: boolean;
}

class ProjectConfig extends React.Component <Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      currentConfig: null,
      showMarageConfig: false,
      filterType: "filePath",
      filterValue: '',
      searchVaild: true,
    }
    this.onCancelEditConfig = this.onCancelEditConfig.bind(this)
    this.onClickConfig = this.onClickConfig.bind(this)
    this.afterUpdateConfig = this.afterUpdateConfig.bind(this)
    this.onClickConfigMarage = this.onClickConfigMarage.bind(this)
    this.onChangeTabs = this.onChangeTabs.bind(this)
    this.filterSourceData = this.filterSourceData.bind(this)
    this.hideConfigManage = this.hideConfigManage.bind(this)
    this.updateConfigList = this.updateConfigList.bind(this)
    this.onChangeFilterConfig = this.onChangeFilterConfig.bind(this)
    this.onChangeFilterType = this.onChangeFilterType.bind(this)
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

  filterData (data: TemplateConfig[]) {  
    const preData = util.clone(data)
    const newData = []
    const signArr = this.props.signArr
    if (signArr.length ) {
      signArr.forEach( sign => {
        preData.forEach( (config, index) => {
          if (config.globalConfigId == sign){
            newData.push(config)
            preData.splice(index,1)
          }
        })
      })
      newData.push(...preData)
    } else {
      newData.push(...preData)
    }  
    return newData.filter( item => {
      if ( this.state.filterType == 'targetValue' && item.typeId == 1) {
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
  }

  countSignGlobalConfig(data: TemplateConfig[]) {
    let count = 0 
    data.forEach(config => {
      if (this.props.signArr.includes(config.globalConfigId)) {
        count++
      }
    })
    return count
  }

  returnActiveKey (): string {
    const data = this.props.gitList
    let resStr = this.props.activeKey
    if (this.props.signArr.length > 0) {
      for (const git of data) {
        for (const config of git.configList){
          if (this.props.signArr.includes(config.globalConfigId)) {
            resStr = git.id
            return resStr
          }
        }
      }
    }
    return resStr
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
        render: (value) =>{
          switch (value) {
            case 1 :
              return <span>文件</span>;
            default :
            return <span>文本</span>;
          }
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
        text: "默认值",
        value: "targetValue"
      },
      {
        text: "描述",
        value: "description"
      }
    ]
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
            activeKey={this.returnActiveKey()}
            onChange={this.onChangeTabs}
            >
            {this.props.gitList.map((item) => {
              return (
                <Tabs.TabPane className={styles.tabPanel} tab={ <Badge count={this.countSignGlobalConfig(item.configList)}><div>{`${item.name}-${item.branchName}-${item.version}`}</div></Badge> } key={item.id}>
                  <div style={{marginBottom: 10}}>
                    <Input.Group compact>
                      <Select defaultValue={filterType[0].value}
                        onChange={this.onChangeFilterType}
                      >
                        {
                          filterType.map( type => <Select.Option key={type.value} value={type.value}>{type.text}</Select.Option>)
                        }
                      </Select>
                      <Input
                        onChange={this.onChangeFilterConfig}
                        placeholder='输入筛选内容'
                        style={{width: "300px"}}
                      />
                      <Button className={styles.btn} onClick={this.onClickConfigMarage}>配置项管理</Button>
                    </Input.Group>
                  </div>
                  <Table
                    columns={columns}
                    rowKey="id"
                    rowClassName={ (record) => {
                      const className = []                      
                      className.push( this.props.signArr.includes(record.globalConfigId) ?  styles.sign: "" )                      
                      return className.join("")
                    }}
                    dataSource={this.visableSourceData(this.filterData(item.configList))}
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