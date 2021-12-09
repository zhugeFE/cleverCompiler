/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-04 15:09:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-09 15:53:09
 */

import { connect } from 'dva';
import React from 'react';
import styles from './styles/templateEdit.less';
import { withRouter } from 'react-router';
import { IRouteComponentProps } from '@umijs/renderer-react';
import { Dispatch, GitInfo, GitInfoBranch, GitVersion } from '@/.umi/plugin-dva/connect';
import { Button, Progress, Radio, RadioChangeEvent, Spin, Tabs, Tag, Tooltip } from 'antd';
import {
  ChangeGitVersionParams,
  TemplateConfig,
  TemplateGlobalConfig,
  TemplateInfo,
  TemplateVersion,
  TemplateVersionGit,
  UpdateTemplateVersion,
} from '@/models/template';
import TimeLinePanel from './templateTimeLine';
import Description from '@/components/description/description';
import Markdown from '@/components/markdown/markdown';
import { LeftOutlined } from '@ant-design/icons';
import util from '@/utils/utils';
import * as _ from 'lodash';
import TemplateConfigPanel from './templateConfig';
import CreateTemplateVersion from './createTemplateVersion';
import TemplateAddGlobalConfig from './addTemplateGlobalConfig';
import TemplateGlobalConfigComponent from './templateGlobalConfig';
import { publicType, VersionStatus } from '@/models/common';

export interface TemplateEditProps
  extends IRouteComponentProps<{
    id: string;
  }> {
  dispatch: Dispatch;
}

interface State {
  templateInfo: TemplateInfo | null;
  showAddGlobalConfig: boolean;
  currentVersion: TemplateVersion | null;
  savePercent: number;
  updateTimeout: number;
  delTimeout: number;
  delTooltip: string;
  delInterval?: NodeJS.Timeout;
  currentGitId: string;
  currentBranch: GitInfoBranch | null;
  gitInfo: GitInfo | null;
  publicType: number;
}

class TemplateEdit extends React.Component<TemplateEditProps, State> {
  constructor(prop: TemplateEditProps) {
    super(prop);
    this.state = {
      templateInfo: null,
      currentVersion: null,
      currentBranch: null,
      showAddGlobalConfig: false,
      savePercent: 100,
      delTimeout: 0,
      delTooltip: '',
      currentGitId: "",
      updateTimeout: 0,
      gitInfo: null,
      publicType: 0,
    };

    this.afterUpdateGlobalConfigStatus = this.afterUpdateGlobalConfigStatus.bind(this)
    this.onAddGlobalConfig = this.onAddGlobalConfig.bind(this);
    this.onChangeVersion = this.onChangeVersion.bind(this);
    this.onDeleteVersion = this.onDeleteVersion.bind(this);
    this.afterUpdateConfig = this.afterUpdateConfig.bind(this);
    this.afterUpdateGlobalConfig = this.afterUpdateGlobalConfig.bind(this);
    this.afterDelGlobalConfig = this.afterDelGlobalConfig.bind(this);
    this.onCancelGlobalConfig = this.onCancelGlobalConfig.bind(this);
    this.afterAddGlobalConfig = this.afterAddGlobalConfig.bind(this);
    this.afterCreateVersion = this.afterCreateVersion.bind(this);
    this.onCancelAddVersion = this.onCancelAddVersion.bind(this);
    this.onChangeReadme = this.onChangeReadme.bind(this);
    this.onChangeBuild = this.onChangeBuild.bind(this);
    this.onChangeUpdate = this.onChangeUpdate.bind(this);
    this.afterAddGit = this.afterAddGit.bind(this);
    this.afterDelGit = this.afterDelGit.bind(this);
    this.onChangeGit = this.onChangeGit.bind(this);
    this.afterSelectGitVersion = this.afterSelectGitVersion.bind(this)
    this.onRadioChange = this.onRadioChange.bind(this)
  }


  componentDidMount() {
    const id = this.props.match.params.id;

    this.getGitList()
    if (id != 'createTemplate') {
      this.getTemplateInfo(id)
    }
  }

  componentWillUnmount () {
    if (this.state.delInterval) clearInterval(this.state.delInterval)
  }

  onChangeGit (id: string) {
    this.getGitInfo(id)
    this.setState({
      currentGitId: id,
    })
  }

  getGitInfo (gitId: string) {
    const data = this.state.currentVersion!.gitList.filter( item => item.id == gitId)[0]
    this.setState({
      gitInfo: null
    })
    this.props.dispatch({
      type: 'git/getInfo',
      payload: data.gitSourceId,
      callback: (info: GitInfo) => {
        this.setState({
          gitInfo: info,
        })
      }
    })
  }

  getTemplateInfo (id: string) {
    this.props.dispatch({
      type: 'template/getInfo',
      payload: id,
      callback: (info: TemplateInfo) => {
        const currentVersion = info.versionList.length ? info.versionList[0] : null
        this.setState({
          templateInfo: info,
          publicType: currentVersion!.publicType,
          currentVersion,
          currentGitId: currentVersion?.gitList.length ? currentVersion.gitList[0].id : ""
        })
        if ( currentVersion?.gitList.length) {
          this.getGitInfo(currentVersion.gitList[0].id)
        }
        this.initDelInterval(currentVersion)
      }
    });
  }


  getGitList () {
    this.props.dispatch({
      type: 'git/query',
      callback: () => {
      }
    });
  }

  initDelInterval (version: TemplateVersion | null) {
    clearInterval(this.state.delInterval as unknown as number)
    if (!version || version.status != VersionStatus.normal) {
      this.setState({
        delTimeout: 0,
        delTooltip: ''
      })
      return
    }
    let delTimeout = 24 * 60 * 60 * 1000 - (new Date().getTime() -  new Date(version!.publishTime).getTime())
    let delTooltip = `可删除倒计时：${util.timeFormat(delTimeout)}`
    this.setState({
      delTimeout,
      delTooltip,
      delInterval: setInterval(() => {
        delTimeout = delTimeout - 1000
        delTooltip = `可删除倒计时：${util.timeFormat(delTimeout)}`
        if (delTimeout <= 0) {
          clearInterval(this.state.delInterval as unknown as number)
        }
        this.setState({
          delTimeout,
          delTooltip
        })
      }, 1000)
    })
  }
  
  

  //异步更新版本里的文档
  onUpdateVersion() {
    if (this.state.updateTimeout) {
      clearTimeout(this.state.updateTimeout);
    }
    this.setState({
      savePercent: _.random(10, 90, false),
      updateTimeout: setTimeout(() => {
        const {currentVersion} = this.state
        const param: UpdateTemplateVersion = {
          id: currentVersion!.id,
          publicType: currentVersion!.publicType,
          readmeDoc: currentVersion!.readmeDoc,
          buildDoc: currentVersion!.buildDoc,
          updateDoc: currentVersion!.updateDoc,
        };
        this.props.dispatch({
          type: 'template/updateVersion',
          payload: param,
          callback: () => {
            this.setState({
              savePercent: 100,
            });
          }
        })
      }, 500) as unknown as number,
    })
  }
  //修改操作文档，同步更新状态
  onChangeReadme(content: string) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion!.readmeDoc = content
    this.setState({
      currentVersion
    })
    this.onUpdateVersion();
  }
  //操作部署文档，同步更新状态
  onChangeBuild(content: string) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion!.buildDoc = content
    this.setState({
      currentVersion
    })
    this.onUpdateVersion();
  }
  //修改更新文档，同步更新状态
  onChangeUpdate(content: string) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion!.updateDoc = content
    this.setState({
      currentVersion
    })
    this.onUpdateVersion();
  }

  onChangeVersion (templateVersion: TemplateVersion) {
    this.setState({
      currentVersion: templateVersion ,
      currentGitId: templateVersion.gitList.length ? templateVersion.gitList[0].id : ""
    })
    this.initDelInterval(templateVersion)
  }
  onDeleteVersion () {
    this.props.dispatch({
      type: 'template/deleteVersion',
      payload: this.state.currentVersion!.id,
      callback: () => {
        const versionList: TemplateVersion[] = []
        this.state.templateInfo?.versionList.forEach(version => {
          if (version.id !== this.state.currentVersion!.id) {
            versionList.push(version)
          }
        })
        const currentVersion = versionList.length > 0 ? versionList[0] : null
        const templateInfo = util.clone(this.state.templateInfo)
        templateInfo!.versionList = versionList
        this.setState({
          templateInfo,
          currentVersion,
          currentGitId: currentVersion?.gitList.length ? currentVersion.gitList[0].id : ""
        })
        this.initDelInterval(currentVersion)
      }
    })
  }
  afterCreateVersion (version: TemplateVersion) {
    if (this.props.match.params.id == 'createTemplate') {
      this.props.history.replace(`/manage/template/${version.templateId}`)
    }else{
      const templateInfo = util.clone(this.state.templateInfo)
      templateInfo!.versionList.unshift(version)
      this.props.match.params.id = version.templateId
      this.setState({
        templateInfo,
        currentVersion: version,
        currentGitId: version.gitList.length ? version.gitList[0].id : ""
      })
      this.initDelInterval(version)
    } 
  }
  onCancelAddVersion () {
    this.props.history.goBack()
  }
  afterUpdateConfigStatus (data: {id: string; status: number}) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.gitList.forEach( (git) => {
      git.configList.forEach((item, index) => {
        if (item.id == data.id) {
          item.isHidden = data.status
        }
      })
    })
    const templateInfo = util.clone(this.state.templateInfo)
    templateInfo?.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        templateInfo.versionList[i] = currentVersion!
      }
    })
    this.setState({
      currentVersion,
      templateInfo
    })
  }
  afterUpdateConfig (config: TemplateConfig) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.gitList.forEach( (git) => {
      git.configList.forEach((item,index)=>{
        if (item.id == config.id) {
          git.configList[index] = config
        }
      })
    })
    const templateInfo = util.clone(this.state.templateInfo)
    templateInfo?.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        templateInfo.versionList[i] = currentVersion!
      }
    })
    this.setState({
      showAddGlobalConfig: false,
      currentVersion,
      templateInfo
    })
  }

  afterAddGit (git: TemplateVersionGit) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.gitList.push(git)
    
    const templateInfo = util.clone(this.state.templateInfo)
    templateInfo?.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        templateInfo.versionList[i] = currentVersion!
      }
    })
    this.setState({
      currentVersion,
      templateInfo,
      currentGitId: currentVersion!.gitList[currentVersion!.gitList.length - 1].id
    })
    this.getGitInfo(currentVersion!.gitList[currentVersion!.gitList.length - 1].id)
  }

  afterSelectGitVersion ( value: string) {
    if (!this.state.gitInfo) return

    let versionData: GitVersion
    for (const branch of this.state.gitInfo.branchList) {
      for (const version of branch.versionList) {
        if (version.id == value) {
          versionData = version
          break
        }
      }
    }
    const currentVersion = util.clone(this.state.currentVersion)
    const data = {}
    if (currentVersion) {
      currentVersion.gitList.map( git => {
        if ( git.id === this.state.currentGitId){
          data['id'] = git.id
          data['gitSourceVersionId'] = versionData?.id
          data['configList'] = []
          versionData?.configs.map( config => {
            data['configList'].push({
              templateId: git.templateId,
              templateVersionId: git.templateVersionId,
              templateVersionGitId: git.id,
              gitSourceConfigId: config.id,
              targetValue: config.targetValue,
            })
          })
        }
      })
    }
    this.props.dispatch({
      type: "template/changeGitVersion",
      payload: data as ChangeGitVersionParams,
      callback: (data: TemplateVersionGit) => {
        const currentVersion = util.clone(this.state.currentVersion)
        currentVersion?.gitList.map( (git, index) => {
          if ( git.id === this.state.currentGitId) {
            currentVersion.gitList[index] = data
          }
        })
        this.setState({
          currentVersion
        })
      }
    })
  }
  afterDelGit (gitId: string) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.gitList.forEach((git,index) => {
      if (gitId === git.id) {
        currentVersion.gitList.splice(index, 1)
      }
    })
    const templateInfo = util.clone(this.state.templateInfo)
    templateInfo!.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        templateInfo!.versionList[i] = currentVersion!
      }
    })
    this.setState({
      templateInfo,
      currentVersion,
      currentGitId: currentVersion?.gitList.length ? currentVersion.gitList[currentVersion.gitList.length-1].id : ""
    })
    if (currentVersion?.gitList.length) {
      this.getGitInfo(currentVersion!.gitList[currentVersion!.gitList.length - 1].id)
    }
  }

  onAddGlobalConfig () {
    if ( this.state.currentVersion?.status !== VersionStatus.normal) return
    this.setState({
      showAddGlobalConfig: true
    })
  }
  afterDelGlobalConfig (configId: string) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.globalConfigList.forEach((config, i) => {
      if (configId === config.id) {
        currentVersion.globalConfigList.splice(i, 1)
      }
    })
    const templateInfo = util.clone(this.state.templateInfo)
    templateInfo!.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        templateInfo!.versionList[i] = currentVersion!
      }
    })
    this.setState({
      templateInfo,
      currentVersion
    })
  }
  onCancelGlobalConfig () {
    this.setState({
      showAddGlobalConfig: false
    })
  }
  afterUpdateGlobalConfigStatus (data: {id: string; status: number}) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.globalConfigList.forEach( (item, index) => {
      if (item.id == data.id) {
        item.isHidden = data.status
      }
    })
    const templateInfo = util.clone(this.state.templateInfo)
    templateInfo?.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        templateInfo.versionList[i] = currentVersion!
      }
    })
    this.setState({
      currentVersion,
      templateInfo
    })
  }
  afterUpdateGlobalConfig (config: TemplateGlobalConfig) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.globalConfigList.forEach( (item, index) => {
      if (item.id == config.id) {
        currentVersion.globalConfigList[index] = config
      }
    })
    const templateInfo = util.clone(this.state.templateInfo)
    templateInfo?.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        templateInfo.versionList[i] = currentVersion!
      }
    })
    this.setState({
      showAddGlobalConfig: false,
      currentVersion,
      templateInfo
    })
  }
  afterAddGlobalConfig (config: TemplateGlobalConfig) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.globalConfigList.push(config)
    const templateInfo = util.clone(this.state.templateInfo)
    templateInfo?.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        templateInfo.versionList[i] = currentVersion!
      }
    })
    this.setState({
      showAddGlobalConfig: false,
      currentVersion,
      templateInfo
    })
  }

  onChangeVersionStatue (status: VersionStatus) {
    if (!this.state.currentVersion) return
    this.props.dispatch({
      type: "template/updateTemplateVersionStatus",
      payload: {
        id: this.state.currentVersion.id,
        status: Number(status)
      },
      callback: () => {
        const currentVersion = util.clone( this.state.currentVersion )
        currentVersion!.status = Number(status)

        const templateInfo = util.clone(this.state.templateInfo)
        templateInfo?.versionList.map( (version, index) => {
          if (version.id == currentVersion!.id) {
            templateInfo.versionList[index] = currentVersion!
          }
        })
        this.setState({
          currentVersion,
          templateInfo
        })
        this.initDelInterval(currentVersion)
      }
    })
  }
  onRadioChange (e: RadioChangeEvent) {
    const version = util.clone(this.state.currentVersion)
    version!.publicType = e.target.value
    const template = util.clone(this.state.templateInfo)
    template?.versionList.forEach( (item, index) => {
      if (item.id == version?.id) {
        template.versionList[index] = version
      }
    })
    this.setState({
      templateInfo: template,
      currentVersion: version
    })
    this.onUpdateVersion()
  }
  render() {
    const labelWidth = 75;
    if (!this.state.templateInfo && this.props.match.params.id != 'createTemplate') {
      return <Spin className={styles.gitEditLoading} tip="git详情获取中..." size="large"></Spin>;
    }
    return (
      <div className={styles.gitEditPanel}>
        {
          this.state.showAddGlobalConfig ? (
              <TemplateAddGlobalConfig
                templateId={this.props.match.params.id}
                versionId={this.state.currentVersion!.id}
                onClose={this.onCancelGlobalConfig}
                onSubmit={this.afterAddGlobalConfig}
              ></TemplateAddGlobalConfig>
          ): null
        }
        <div className={styles.gitPanelTop}>
          <a
            onClick={() => {
              this.props.history.goBack();
            }}>
            <LeftOutlined />
            返回
          </a>
          <span style={{marginLeft: '20px'}}>
            <Tooltip title="发布后版本将变为只读状态">
              {
                this.state.currentVersion?.status === VersionStatus.placeOnFile ? (
                  <a style={{marginLeft: '10px', color: '#faad14'}}>已发布</a>): (
                  this.state.currentVersion?.status !== VersionStatus.deprecated &&
                  <a style={{marginLeft: '10px', color: '#faad14'}} onClick={()=>this.onChangeVersionStatue(VersionStatus.placeOnFile)} >发布 </a> )
              }
            </Tooltip>
            <Tooltip title="废弃后，新建项目中该版本将不可用">
              {
                this.state.currentVersion?.status === VersionStatus.deprecated ? (
                  <a style={{marginLeft: '10px', color: '#f5222d'}} >已废弃</a>
                ) : (
                  <a style={{marginLeft: '10px', color: '#f5222d'}} onClick={()=>this.onChangeVersionStatue(VersionStatus.deprecated)}>废弃</a>
                )
              }
            </Tooltip>
            {
              this.state.delTimeout > 0 && this.state.currentVersion?.status === VersionStatus.normal ? (
                <span>
                  <a onClick={this.onDeleteVersion} style={{marginLeft: '10px', color: '#f5222d', marginRight: '5px'}}>删除</a>
                  ({this.state.delTooltip})
                </span>
              ) : null
            }
          
            {
              this.state.savePercent !== 100 && <Progress
                percent={this.state.savePercent}
                size="small"
                strokeWidth={2}
                format={(percent) => (percent === 100 ? 'saved' : 'saving')}
              ></Progress>
            }

          </span>
        </div>
      
        {
          this.state.templateInfo?.versionList.length ? (
            <div className={styles.gitPanelCenter}>
              <TimeLinePanel
                versionList={this.state.templateInfo.versionList}
                currentVersion={this.state.currentVersion!}
                afterAdd={this.afterCreateVersion}
                onChange={this.onChangeVersion}
              ></TimeLinePanel>
              <div className={styles.gitDetail}>
                <Description label="项目名称" labelWidth={labelWidth}>
                  {this.state.templateInfo.name}
                  <Tooltip title="版本" placement="bottom">
                    <Tag color="#87d068" style={{ marginLeft: '5px' }}>
                      v:{this.state.currentVersion?.version}
                    </Tag>
                  </Tooltip>
                  <Tooltip title="版本发布时间">
                    <Tag color="#f50">
                      {util.dateTimeFormat(new Date(this.state.templateInfo.createTime))}
                    </Tag>
                  </Tooltip>
                </Description>

                <Description
                  label="全局配置"
                  labelWidth={labelWidth}
                  display="flex"
                  className={styles.gitConfigs}>
                    
                    {/* 全局配置组件 */}
                    <TemplateGlobalConfigComponent
                      //全局配置项
                      mode={this.state.currentVersion!.status}
                      globalConfigList={this.state.currentVersion!.globalConfigList}
                      onSubmit={this.afterUpdateGlobalConfig}
                      afterUpdateGlobalConfigStatus={this.afterUpdateGlobalConfigStatus}
                      afterDelConfig={this.afterDelGlobalConfig}/>
                    {this.state.currentVersion?.status === VersionStatus.normal && <Button className={styles.btnAddConfigItem} onClick={this.onAddGlobalConfig}>添加配置项</Button>}

                </Description>

                <Description
                  label="配置项"
                  labelWidth={labelWidth}
                  display="flex"
                  className={styles.gitConfigs}>
                  
                  {/* 配置组件 */}
                  <TemplateConfigPanel
                    mode={this.state.currentVersion!.status}
                    activeKey={this.state.currentGitId}
                    gitInfo={this.state.gitInfo}
                    onChangeGit={this.onChangeGit}                  
                    templateId={this.state.currentVersion!.templateId}
                    templateVersionId={this.state.currentVersion!.id}
                    globalConfigList={this.state.currentVersion!.globalConfigList} //全局配置项
                    gitList={this.state.currentVersion!.gitList} //版本git项
                    onSubmit={this.afterUpdateConfig}
                    afterAddGit={this.afterAddGit}
                    afterDelGit={this.afterDelGit}
                    afterSelectGitVersion={this.afterSelectGitVersion}
                  ></TemplateConfigPanel>

                </Description>

                <Description
                  label='发布方式'
                  labelWidth={labelWidth}
                >
                 <Radio.Group onChange={this.onRadioChange} defaultValue={this.state.publicType} disabled={this.state.currentVersion?.status != VersionStatus.normal}>
                    {
                      publicType.map( item => {
                        return <Radio key={item.value} value={item.value}>{item.text}</Radio>
                      })
                    }
                  </Radio.Group>
                </Description>
                
                <Tabs defaultActiveKey="readme" style={{ margin: '10px 0 10px 85px' }}>
                  <Tabs.TabPane tab="使用文档" key="readme">
                    {
                      this.state.currentVersion && (
                        <Markdown
                          DisabledEdit={true}
                          content={this.state.currentVersion.readmeDoc}
                        ></Markdown>
                      )
                    }
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部署文档" key="build">
                    {
                      this.state.currentVersion && (
                        <Markdown
                          // onChange={this.onChangeBuild}
                          DisabledEdit={true}
                          content={this.state.currentVersion.buildDoc}
                        ></Markdown>
                      )
                    }
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="更新内容" key="update">
                    {
                      this.state.currentVersion && (
                        <Markdown
                          // onChange={this.onChangeUpdate}
                          DisabledEdit={true}
                          content={this.state.currentVersion.updateDoc}
                        ></Markdown>
                      )
                    }
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          ) : (
            <CreateTemplateVersion
              mode="init"
              title="创建初始版本"
              afterAdd={this.afterCreateVersion} 
              onCancel={this.onCancelAddVersion}/>
          )
        }
      </div>
    )
  }
}

export default connect()(withRouter(TemplateEdit));
