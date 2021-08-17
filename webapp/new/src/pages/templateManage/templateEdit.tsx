/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-04 15:09:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-16 18:34:32
 */

import { connect } from 'dva'
import React from 'react'
import styles from './styles/templateEdit.less'
import { withRouter } from 'react-router'
import { IRouteComponentProps } from '@umijs/renderer-react'
import { Dispatch, GitInstance } from '@/.umi/core/umiExports'
import { Button, Progress, Spin, Tabs, Tag, Tooltip } from 'antd'
import { TemplateInfo, TemplateVersion, TemplateConfig, UpdateTemplateVersion, TemplateGlobalConfig, TemplateVersionGit } from "@/models/template"
import TimeLinePanel from "./templateTimeLine"
import Description from '@/components/description/description'
import Markdown from '@/components/markdown/markdown'
import { LeftOutlined } from '@ant-design/icons'
import util from '@/utils/utils'
import * as _ from 'lodash'
import TemplateConfigPanel from "./templateConfig"
import CreateTemplateVersion from "./createTemplateVersion"
import CreateTemplate from "./createTemplate"
import { ConnectState } from '@/models/connect'
import AddTemplateGitSourse from "./addTemplateGitSourse"
import AddTemplateGlobalConfig from "./addTemplateGlobalConfig"
import AddTemplateConfig from "./addTemplateConfig"
import TemplateGlobalConfigComponent from "./templateGlobalConfig"


export interface TemplateEditProps extends IRouteComponentProps<{
  id: string;
}>{
  gitList:GitInstance[];
  dispatch: Dispatch;
}


interface State {
  templateInfo: TemplateInfo | null;
  savePercent: number;
  updateTimeout: number;
  showCreateTemplate: boolean;
  // showConfig: boolean;
  showAddGitSouse: boolean;
  showGlobalConfig: boolean;
}


class TemplateEdit extends React.Component<TemplateEditProps, State> {
  constructor (prop: TemplateEditProps) {
    super(prop)
    this.state = {
      showAddGitSouse:false,
      showCreateTemplate:false,
      showGlobalConfig:false,
      // showConfig:false,
      templateInfo: null,
      savePercent: 100,
      updateTimeout: 0,
    }
    this.onChangeVersion = this.onChangeVersion.bind(this)
    this.afterCreateVersion = this.afterCreateVersion.bind(this)
    this.afterDelVersion = this.afterDelVersion.bind(this)
    this.afterCreateTemplate = this.afterCreateTemplate.bind(this)
    this.onClickAddGitSourse = this.onClickAddGitSourse.bind(this)
    this.onCancelAddGitSourse = this.onCancelAddGitSourse.bind(this)
    this.onCommitAddGitSourse = this.onCommitAddGitSourse.bind(this)
    this.onAddGlobalConfig = this.onAddGlobalConfig.bind(this)
    this.onCancelAddGlobalConfig = this.onCancelAddGlobalConfig.bind(this)
    this.afterAddGlobalConfig = this.afterAddGlobalConfig.bind(this)
    this.afterDelGlobalConfig = this.afterDelGlobalConfig.bind(this)
    // this.onAddConfig = this.onAddConfig.bind(this)
    // this.onCancelAddConfig = this.onCancelAddConfig.bind(this)
    // this.afterAddConfig = this.afterAddConfig.bind(this)
    this.afterchangeHiddenStatus = this.afterchangeHiddenStatus.bind(this)
    this.onChangeConfigTab = this.onChangeConfigTab.bind(this)
    this.onChangeReadme = this.onChangeReadme.bind(this)
    this.onChangeBuild = this.onChangeBuild.bind(this)
    this.onChangeUpdate = this.onChangeUpdate.bind(this)
  }

  async componentDidMount () {
    const id = this.props.match.params.id
    
    await this.props.dispatch({
      type: 'git/query'
    })
    if(id == "createTemplate"){
      this.setState({
        showCreateTemplate:true
      })
      return
    }
    this.props.dispatch({
      type: 'template/getInfo',
      payload: this.props.match.params.id,
      callback: (info: TemplateInfo) => {
        const templateInfo:TemplateInfo = {
          ...info,
          currentVersion: info.versionList[0], //当前版本
        }
        this.setState({
          templateInfo,
        })

        // this.initDelInterval(currentVersion!)
      }
    })
  }

  onChangeVersion (version: TemplateVersion) {
    const templateInfo = util.clone(this.state.templateInfo)
    if(templateInfo){
      console.log(version)
      templateInfo.currentVersion = version
      this.setState({
        templateInfo
      })
    }
  }

  afterCreateTemplate (template: TemplateInfo) {
    history.replaceState("","",`/manage/template/${template.id}`)
    const templateInfo:TemplateInfo = {
      ...template,
      currentVersion: template.versionList[0], //当前版本
    }
    this.setState({
      templateInfo
    })
  }

  afterCreateVersion (version: TemplateVersion) {
    const templateInfo = util.clone(this.state.templateInfo)
    templateInfo?.versionList.unshift(version)
    templateInfo!.currentVersion = version
    this.setState({
      templateInfo
    })
    // this.initDelInterval(version)
  }
  afterDelVersion (id: string){
    const templateInfo = util.clone(this.state.templateInfo)
    if(templateInfo){
      templateInfo.currentVersion!.gitList = templateInfo.currentVersion?.gitList?.filter(item=>item.id!=id)
      templateInfo.versionList.map(item=>{
        if(item.id === templateInfo.currentVersion?.id){
          item = templateInfo.currentVersion
        }
      })
      this.setState({
        templateInfo
      })
    }
  }

  onUpdateVersion () {
    if (this.state.updateTimeout) {
      clearTimeout(this.state.updateTimeout)
    }
    this.setState({
      savePercent: _.random(10, 90, false),
      updateTimeout: setTimeout(() => {
        if(this.state.templateInfo?.currentVersion)
        {
          const { currentVersion } = this.state.templateInfo
          const param: UpdateTemplateVersion= {
            id: currentVersion.id,
            readmeDoc: currentVersion.readmeDoc,
            buildDoc: currentVersion.buildDoc,
            updateDoc: currentVersion.updateDoc
          }
          this.props.dispatch({
            type: 'template/updateVersion',
            payload: param,
            callback: () => {
              this.setState({
                savePercent: 100
              })
            }
          })
        }
      }, 500) as unknown as number
    })
  }


  onChangeReadme (content: string) {
    const templateInfo = util.clone(this.state.templateInfo)
    if(templateInfo){
      templateInfo.currentVersion!.readmeDoc = content
      templateInfo.versionList.map(item=>{
        if(item.id === templateInfo.currentVersion?.id){
          item = templateInfo.currentVersion
        }
      })
    }
    this.setState({
      templateInfo
    })
    this.onUpdateVersion()
  }

  onChangeBuild (content: string) {
    const templateInfo = util.clone(this.state.templateInfo)
    if(templateInfo){
      templateInfo.currentVersion!.buildDoc = content
      templateInfo.versionList.map(item=>{
        if(item.id === templateInfo.currentVersion?.id){
          item = templateInfo.currentVersion
        }
      })
    }
    this.setState({
      templateInfo
    })
    this.onUpdateVersion()
  }

  onChangeUpdate (content: string) {
    const templateInfo = util.clone(this.state.templateInfo)
    if(templateInfo){
      templateInfo.currentVersion!.updateDoc = content
      templateInfo.versionList.map(item=>{
        if(item.id === templateInfo.currentVersion?.id){
          item = templateInfo.currentVersion
        }
      })
    }
    this.setState({
      templateInfo
    })
    this.onUpdateVersion()
  }

  onChangeConfigTab (id: string){
    const templateInfo = util.clone(this.state.templateInfo)
    if(templateInfo?.versionList){
      templateInfo.versionList.map(item=>{
        if(item.id === id){
         templateInfo.currentVersion = item
        }
      })
      this.setState({
        templateInfo
      })
    }
  }

  // onAddConfig(){
  //   this.setState({
  //     showConfig:true
  //   })
  // }
  // onCancelAddConfig(){
  //   this.setState({
  //     showConfig:false
  //   })
  // }
  // afterAddConfig(config: TemplateConfig){
  //   const templateInfo = util.clone(this.state.templateInfo)
  //   templateInfo?.currentVersion?.configList.push(config)
  //   templateInfo?.versionList.map(item=>{
  //     if(item.id == templateInfo?.currentVersion?.id){
  //       item.configList = templateInfo.currentVersion.configList
  //     }
  //   })
  //   this.setState({
  //     templateInfo
  //   })
  //   this.onCancelAddConfig()
  // }


  afterchangeHiddenStatus (configId: string){
    const templateInfo = util.clone(this.state.templateInfo)
    if(templateInfo){
      templateInfo.currentVersion.gitList.map(item=>{
        item.configList.map(config=>{
          if(config.id == configId){
            config.isHidden = config.isHidden === 0 ? 1 : 0
          }
        })
      })
      templateInfo?.versionList.map(item=>{
        if(item.id == templateInfo?.currentVersion?.id){
          item = templateInfo.currentVersion
        }
      })
      this.setState({
        templateInfo
      }) 
    }

  }


  onAddGlobalConfig() {
    this.setState({
      showGlobalConfig:true
    })
  }

  onCancelAddGlobalConfig (){
    this.setState({
      showGlobalConfig: false
    })
  }
  afterAddGlobalConfig (config: TemplateGlobalConfig){
    const templateInfo = util.clone(this.state.templateInfo)
    if(templateInfo?.currentVersion){
      templateInfo.currentVersion.globalConfigList.push(config)
      templateInfo.versionList.map(item=>{
        if(templateInfo.currentVersion && item.id === templateInfo.currentVersion.id){
          item = templateInfo.currentVersion
        }
      })
      this.setState({ 
        templateInfo
      })
    } 

    this.onCancelAddGlobalConfig()
  }

  afterDelGlobalConfig (configId: string){
    const templateInfo = util.clone(this.state.templateInfo)
    if(templateInfo?.currentVersion){
      templateInfo.currentVersion.globalConfigList = templateInfo.currentVersion.globalConfigList.filter(item=>item.id!=configId)
      templateInfo.versionList.map(item=>{
        if(templateInfo.currentVersion && item.id === templateInfo.currentVersion.id){
          item = templateInfo.currentVersion
        }
      })
      this.setState({
        templateInfo
      })
    } 
  }

  onClickAddGitSourse() {
    this.setState({
      showAddGitSouse:true
    })
  }
  onCancelAddGitSourse(){
    this.setState({
      showAddGitSouse:false
    })
  }
  onCommitAddGitSourse(version: TemplateVersionGit){
    const templateInfo = util.clone(this.state.templateInfo)
    if(templateInfo?.currentVersion){
      templateInfo.currentVersion.gitList.push(version)
      templateInfo.versionList.map(item=>{
        if(templateInfo.currentVersion && item.id === templateInfo.currentVersion.id){
          item = templateInfo.currentVersion
        }
      })
      this.setState({
        templateInfo
      })
    }
    this.onCancelAddGitSourse()
  }


  render () {
    const labelWidth = 75
    if (!this.state.templateInfo) {
      return (
        <Spin className={styles.gitEditLoading} tip="git详情获取中..." size="large"></Spin>
      )
    }
    return (
      <div className={styles.gitEditPanel}>
        {
          this.state.showGlobalConfig && this.state.templateInfo && this.state.templateInfo.currentVersion? (
            <AddTemplateGlobalConfig
              templateId={this.state.templateInfo.id}
              templateVersionId={this.state.templateInfo.currentVersion?.id}
              onCancel={this.onCancelAddGlobalConfig}
              afterAdd={this.afterAddGlobalConfig}
            ></AddTemplateGlobalConfig>
          ):null
        }
        {
          this.state.showAddGitSouse&&this.state.templateInfo?(
            <AddTemplateGitSourse
              id={this.props.match.params.id}
              version={this.state.templateInfo.currentVersion!.id}
              gitList={this.props.gitList}
              onCancel={this.onCancelAddGitSourse}
              afterAdd={this.onCommitAddGitSourse}
            ></AddTemplateGitSourse>
          ):null
        }
         <div className={styles.gitPanelTop}>
          <a onClick={() => {this.props.history.goBack()}}><LeftOutlined/>返回</a>
          <span style={{marginLeft: '20px'}}>
            <Tooltip title="归档后版本将变为只读状态">
              <a style={{marginLeft: '10px', color: '#faad14'}}>归档</a>
            </Tooltip>
            <Tooltip title="废弃后，新建项目中该版本将不可用">
              <a style={{marginLeft: '10px', color: '#f5222d'}}>废弃</a>
            </Tooltip>
            <Progress 
              percent={this.state.savePercent} 
              size="small"
              strokeWidth={2}
              format={percent => percent === 100 ? 'saved' : 'saving'}></Progress>
          </span>
        </div>
        {
          this.state.showCreateTemplate?(
            <div className={styles.gitPanelCenter}>
                <CreateTemplate
                  onCommit={this.afterCreateTemplate}
                ></CreateTemplate>
            </div>):null
        }
        {
          this.state.templateInfo?(
            <div className={styles.gitPanelCenter}>
              <TimeLinePanel 
                id={this.state.templateInfo.id} 
                versionList={this.state.templateInfo.versionList}
                afterAdd={this.afterCreateVersion}
                onChange={this.onChangeVersion}></TimeLinePanel>
              <div className={styles.gitDetail}>
                <Description label="项目名称" labelWidth={labelWidth}>
                  {this.state.templateInfo.name} 
                  <Tooltip title="版本" placement="bottom">
                    <Tag color="#87d068" style={{marginLeft: '5px'}}>v:{this.state.templateInfo.currentVersion?.version}</Tag>
                  </Tooltip>
                  <Tooltip title="版本发布时间">
                    <Tag color="#f50">{util.dateTimeFormat (new Date(this.state.templateInfo.createTime))}</Tag>
                  </Tooltip>
                </Description>
                <Description label="全局配置" labelWidth={labelWidth} display="flex" className={styles.gitConfigs}>
                  <>
                    {
                      this.state.templateInfo.currentVersion?(
                        <TemplateGlobalConfigComponent
                          store={this.state.templateInfo.currentVersion.globalConfigList}
                          afterDelConfig={this.afterDelGlobalConfig}
                        ></TemplateGlobalConfigComponent>
                      ):null
                    }
                    <Button onClick={this.onAddGlobalConfig}>添加配置项</Button>
                  </>
                </Description>
                <Description label="配置项" labelWidth={labelWidth} display="flex" className={styles.gitConfigs}>
                    {
                      <>
                        {
                          this.state.templateInfo.currentVersion?.gitList ?(
                            <TemplateConfigPanel 
                              comConfig={this.state.templateInfo.currentVersion.globalConfigList}
                              gitList={this.state.templateInfo.currentVersion.gitList}
                              currentVersioinGit={this.state.templateInfo.currentVersion.gitList[0]}
                              onChange={this.onChangeConfigTab}
                              onClick={this.onClickAddGitSourse}
                              afterchangeHiddenStatus={this.afterchangeHiddenStatus}
                              afterDelVersion={this.afterDelVersion}
                              ></TemplateConfigPanel>
                          ):null
                        }
                        {/* <Button className={styles.btnAddConfigItem} onClick={this.onAddConfig}>添加配置项</Button> */}
                      </>
                    }
                  </Description>
                
                <Tabs defaultActiveKey="readme" style={{margin: '10px 15px'}}>
                  <Tabs.TabPane tab="使用文档" key="readme">
                    {this.state.templateInfo.currentVersion? <Markdown onChange={this.onChangeReadme} content={this.state.templateInfo.currentVersion.readmeDoc || ""}></Markdown> : null}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部署文档" key="build">
                    {this.state.templateInfo.currentVersion? <Markdown onChange={this.onChangeBuild} content={this.state.templateInfo.currentVersion.buildDoc || ""}></Markdown> : null}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="更新内容" key="update">
                    {this.state.templateInfo.currentVersion? <Markdown onChange={this.onChangeUpdate} content={this.state.templateInfo.currentVersion.updateDoc || ""}></Markdown> : null}
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
            ):null
          }  
      </div>
    )
  }
}

export default connect(({git}: ConnectState) => {
  return {
    gitList: git.gitList
  }
})(withRouter(TemplateEdit))