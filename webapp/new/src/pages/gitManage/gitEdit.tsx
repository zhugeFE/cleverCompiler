import { Dispatch } from '@/.umi/core/umiExports'
import Description from '@/components/description/description'
import { Version, VersionStatus } from '@/models/common'
import { GitConfig, GitInfo, GitUpdateVersionParam, GitVersion } from '@/models/git'
import util from '@/utils/utils'
import * as _ from 'lodash'
import { LeftOutlined } from '@ant-design/icons'
import { IRouteComponentProps } from '@umijs/renderer-react'
import { Button, Tabs, Tag, Spin, Tooltip, Progress, Input } from 'antd'
import { connect } from 'dva'
import React from 'react'
import { withRouter } from 'react-router'
import CreateGitVersion from './createGitVersion'
import GitConfigPanel from './gitConfig'
import TimeLinePanel from './gitTimeLine'
import GitAddConfig from './gitAddConfig'
import styles from './styles/gitEdit.less'
import Commands from './commands'
import Markdown from '@/components/markdown/markdown'

export interface GitEditProps extends IRouteComponentProps<{
  id: string;
}>{
  dispatch: Dispatch;
}
interface State {
  gitInfo: GitInfo | null;
  showAddConfig: boolean;
  currentVersion: GitVersion | null;
  updateTimeout: number;
  delTimeout: number;
  savePercent: number;
  delInterval?: NodeJS.Timeout;
  delTooltip: string;
}

class GitEdit extends React.Component<GitEditProps, State> {
  constructor (props: GitEditProps) {
    super(props)
    this.state = {
      gitInfo: null,
      showAddConfig: false,
      currentVersion: null,
      updateTimeout: 0,
      delTimeout: 0,
      savePercent: 100,
      delTooltip: '',
    }

    this.onCancelConfig = this.onCancelConfig.bind(this)
    this.afterAddConfig = this.afterAddConfig.bind(this)
    this.onDeleteVersion = this.onDeleteVersion.bind(this)
    this.onChangeVersion = this.onChangeVersion.bind(this)
    this.afterCreateVersion = this.afterCreateVersion.bind(this)
    this.afterDelConfig = this.afterDelConfig.bind(this)
    this.onAddConfig = this.onAddConfig.bind(this)
    this.onChangeOrders = this.onChangeOrders.bind(this)
    this.onChangeReadme = this.onChangeReadme.bind(this)
    this.onChangeBuild = this.onChangeBuild.bind(this)
    this.onChangeUpdate = this.onChangeUpdate.bind(this)
    this.onCancelAddVersion = this.onCancelAddVersion.bind(this)
    this.onPlaceOnFile = this.onPlaceOnFile.bind(this)
    this.afterUpdateConfig = this.afterUpdateConfig.bind(this)
    this.onChangeOutputName = this.onChangeOutputName.bind(this)
  }

  componentDidMount () {
    if (this.props.match.params.id != "createGit") {
      this.getInfo(this.props.match.params.id)
    }
  }
  componentWillUnmount () {
    if (this.state.delInterval) clearInterval(this.state.delInterval)
  }
  getInfo (id: string) {
    this.props.dispatch({
      type: 'git/getInfo',
      payload: id,
      callback: (info: GitInfo) => {
        const currentVersion = info.versionList.length ? info.versionList[0] : null
        this.setState({
          gitInfo: info,
          currentVersion
        })
        this.initDelInterval(currentVersion)
      }
    })
  }

  initDelInterval (version: GitVersion | null) {
    clearInterval(this.state.delInterval as unknown as number)
    if (!version || version.status == VersionStatus.placeOnFile) {
      this.setState({
        delTimeout: 0,
        delTooltip: ''
      })
      return
    }
    let delTimeout = 24 * 60 * 60 * 1000 - (new Date().getTime() - version!.publishTime)
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

  onCancelConfig () {
    this.setState({
      showAddConfig: false
    })
  }

  onDeleteVersion () {
    this.props.dispatch({
      type: 'git/deleteVersion',
      payload: this.state.currentVersion!.id,
      callback: () => {
        const versionList: GitVersion[] = []
        this.state.gitInfo?.versionList.forEach(version => {
          if (version.id !== this.state.currentVersion!.id) {
            versionList.push(version)
          }
        })
        const currentVersion = versionList.length > 0 ? versionList[0] : null
        const gitInfo = util.clone(this.state.gitInfo)
        gitInfo!.versionList = versionList
        this.setState({
          gitInfo,
          currentVersion
        })
        this.initDelInterval(currentVersion)
      }
    })
  }

  onChangeVersion (version: Version) {
    this.setState({
      currentVersion: version as GitVersion
    })
    this.initDelInterval(version as GitVersion)
  }

  onAddConfig () {
    if ( this.state.currentVersion?.status !== VersionStatus.normal) return
    this.setState({
      showAddConfig: true
    })
  }

  

  onUpdateVersion () {
    if (this.state.updateTimeout) {
      clearTimeout(this.state.updateTimeout)
    }
    this.setState({
      savePercent: _.random(10, 90, false),
      updateTimeout: setTimeout(() => {
        const { currentVersion } = this.state
        const param: GitUpdateVersionParam = {
          id: currentVersion!.id,
          outputName: currentVersion!.outputName,
          compileOrders: JSON.stringify(currentVersion!.compileOrders),
          readmeDoc: currentVersion!.readmeDoc,
          buildDoc: currentVersion!.buildDoc,
          updateDoc: currentVersion!.updateDoc
        }
        this.props.dispatch({
          type: 'git/updateVersion',
          payload: param,
          callback: () => {
            this.setState({
              savePercent: 100
            })
          }
        })
      }, 500) as unknown as number
    })
  }

  onChangeReadme (content: string) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion!.readmeDoc = content
    this.setState({
      currentVersion
    })
    this.onUpdateVersion()
  }

  onChangeBuild (content: string) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion!.buildDoc = content
    this.setState({
      currentVersion
    })
    this.onUpdateVersion()
  }

  onChangeUpdate (content: string) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion!.updateDoc = content
    this.setState({
      currentVersion
    })
    this.onUpdateVersion()
  }

  onCancelAddVersion () {
    this.props.history.goBack()
  }

  onChangeOrders (orders: string[]) {
    const version = util.clone(this.state.currentVersion)
    version!.compileOrders = orders
    const gitInfo = util.clone(this.state.gitInfo)
    gitInfo?.versionList.forEach((item, i) => {
      if (item.id === version!.id) {
        gitInfo.versionList[i] = version!
      }
    })
    this.setState({
      gitInfo,
      currentVersion: version
    })
    this.onUpdateVersion()
  }

  onChangeOutputName (event: any) {
    const version = util.clone(this.state.currentVersion)
    version!.outputName = event.target.value
    console.log(version?.outputName)
    const gitInfo = util.clone(this.state.gitInfo)
    gitInfo?.versionList.forEach((item, i) => {
      if (item.id === version!.id) {
        gitInfo.versionList[i] = version!
      }
    })
    this.setState({
      gitInfo,
      currentVersion: version
    })
    this.onUpdateVersion()
  }

  afterAddConfig (config: GitConfig) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.configs.push(config)
    const gitInfo = util.clone(this.state.gitInfo)
    gitInfo?.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        gitInfo.versionList[i] = currentVersion!
      }
    })
    this.setState({
      showAddConfig: false,
      currentVersion,
      gitInfo
    })
  }

  afterUpdateConfig (config: GitConfig) {
    console.log(config)
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.configs.map( (item, index) => {
      if (item.id == config.id) {
        currentVersion.configs[index] = config
      }
    })
    const gitInfo = util.clone(this.state.gitInfo)
    gitInfo?.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        gitInfo.versionList[i] = currentVersion!
      }
    })
    this.setState({
      showAddConfig: false,
      currentVersion,
      gitInfo
    })
  }

  afterCreateVersion (version: GitVersion) {
    if (this.props.match.params.id == 'createGit') {
      this.props.history.replace(`/manage/git/${version.sourceId}`)
    }else{
      // this.getInfo(version.sourceId)
      const gitInfo = util.clone(this.state.gitInfo)
      gitInfo!.versionList.unshift(version)
      this.props.match.params.id = version.sourceId
      this.setState({
        gitInfo,
        currentVersion: version
      })
      this.initDelInterval(version)
    }
    
  }
  onPlaceOnFile () {
    if (!this.state.currentVersion) return
    this.props.dispatch({
      type: "git/updateGitVersionStatus",
      payload: {
        id: this.state.currentVersion.id,
        status: Number(VersionStatus.placeOnFile)
      },
      callback: () => {
        const currentVersion = util.clone( this.state.currentVersion )
        currentVersion!.status = Number(VersionStatus.placeOnFile)

        const gitInfo = util.clone(this.state.gitInfo)
        gitInfo?.versionList.map( (version, index) => {
          if (version.id == currentVersion!.id) {
            gitInfo.versionList[index] = currentVersion!
          }
        })
        this.setState({
          currentVersion,
          gitInfo
        })
        this.initDelInterval(currentVersion)
      }
    })
  }

  afterDelConfig (configId: string) {
    const currentVersion = util.clone(this.state.currentVersion)
    currentVersion?.configs.forEach((config, i) => {
      if (configId === config.id) {
        currentVersion.configs.splice(i, 1)
      }
    })
    const gitInfo = util.clone(this.state.gitInfo)
    gitInfo!.versionList.forEach((version, i) => {
      if (version.id === currentVersion!.id) {
        gitInfo!.versionList[i] = currentVersion!
      }
    })
    this.setState({
      gitInfo,
      currentVersion
    })
  }

  render () {
    const labelWidth = 75
    if (!this.state.gitInfo && this.props.match.params.id != 'createGit') {
      return (
        <Spin className={styles.gitEditLoading} tip="git详情获取中..." size="large"></Spin>
      )
    }
    return (
      <div className={styles.gitEditPanel}>
        {
          this.state.showAddConfig ? (
            <GitAddConfig 
              gitId={this.props.match.params.id}
              versionId={this.state.currentVersion!.id}
              onClose={this.onCancelConfig}
              onSubmit={this.afterAddConfig}></GitAddConfig>
          ) : null
        }
        <div className={styles.gitPanelTop}>
          <a onClick={() => {this.props.history.goBack()}}><LeftOutlined/>返回</a>
          <span style={{marginLeft: '20px'}}>
            <Tooltip title="发布后版本将变为只读状态">
              {
                this.state.currentVersion?.status === VersionStatus.placeOnFile ? (
                   <a style={{marginLeft: '10px', color: '#faad14'}}>已发布</a>): (
                   <a style={{marginLeft: '10px', color: '#faad14'}} onClick={this.onPlaceOnFile} >发布 </a> )
              }
            </Tooltip>
            <Tooltip title="废弃后，新建项目中该版本将不可用">
              <a style={{marginLeft: '10px', color: '#f5222d'}}>废弃</a>
            </Tooltip>
            {
              this.state.delTimeout > 0 && this.state.currentVersion?.status === VersionStatus.normal ? (
                <span>
                  <a onClick={this.onDeleteVersion} style={{marginLeft: '10px', color: '#f5222d', marginRight: '5px'}}>删除</a>
                  ({this.state.delTooltip})
                </span>
              ) : null
            }
            <Progress 
              percent={this.state.savePercent} 
              size="small"
              strokeWidth={2}
              format={percent => percent === 100 ? 'saved' : 'saving'}></Progress>
          </span>
        </div>
        {
          this.state.gitInfo?.versionList.length ? (
            <div className={styles.gitPanelCenter}>
              <TimeLinePanel 
                gitId={this.state.gitInfo.id} 
                repoId={this.state.gitInfo.gitId}
                versionList={this.state.gitInfo.versionList}
                currentVersion={this.state.currentVersion!}
                afterAdd={this.afterCreateVersion}
                onChange={this.onChangeVersion}></TimeLinePanel>
              <div className={styles.gitDetail}>
                <Description label="项目名称" labelWidth={labelWidth}>
                  {this.state.gitInfo.name} 
                  <Tooltip title={this.state.currentVersion?.description} placement="bottom">
                    <Tag color="#87d068" style={{marginLeft: '5px'}}>v:{this.state.currentVersion?.name}</Tag>
                  </Tooltip>
                  <Tooltip title="版本发布时间">
                    <Tag color="#f50">{util.dateTimeFormat(new Date(this.state.currentVersion!.publishTime))}</Tag>
                  </Tooltip>
                </Description>
                <Description label="git地址"  className={styles.gitAddr}>
                  <a>{this.state.gitInfo.gitRepo}</a>
                </Description>
                <Description label="git来源" className={styles.gitAddr}>
                  <a>{`${this.state.gitInfo.name}(${this.state.currentVersion?.sourceType}：${this.state.currentVersion?.sourceValue})`}</a>
                </Description>
                <Description label="配置项" labelWidth={labelWidth} display="flex" className={styles.gitConfigs}>
                  
                  <GitConfigPanel 
                    store={this.state.currentVersion?.configs || []}
                    mode={this.state.currentVersion!.status}
                    onSubmit={this.afterUpdateConfig}
                    afterDelConfig={this.afterDelConfig}></GitConfigPanel>
                  {this.state.currentVersion?.status === VersionStatus.normal && <Button className={styles.btnAddConfigItem} onClick={this.onAddConfig}>添加配置项</Button>}
                </Description>
                <Description label="编译命令" display="flex" labelWidth={labelWidth}>
                  {this.state.currentVersion ? <Commands onChange={this.onChangeOrders} mode={this.state.currentVersion.status} tags={this.state.currentVersion.compileOrders}></Commands> : null}
                </Description>
                <Description label="输出文件" display="flex" labelWidth={labelWidth}>
                  {this.state.currentVersion ? <Input style={{width: 350}} onChange={this.onChangeOutputName} placeholder="填写项目根目录下的绝对路径：（例：/dist）" disabled={this.state.currentVersion.status != VersionStatus.normal} defaultValue={this.state.currentVersion.outputName}></Input> : null}
                </Description>
                <Tabs defaultActiveKey="readme" style={{margin: '10px 15px'}}>
                  <Tabs.TabPane tab="使用文档" key="readme">
                    {this.state.currentVersion ? <Markdown onChange={this.onChangeReadme} content={this.state.currentVersion.readmeDoc}></Markdown> : null}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部署文档" key="build">
                    {this.state.currentVersion ? <Markdown onChange={this.onChangeBuild} content={this.state.currentVersion.buildDoc}></Markdown> : null}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="更新内容" key="update">
                    {this.state.currentVersion ? <Markdown onChange={this.onChangeUpdate} content={this.state.currentVersion.updateDoc}></Markdown> : null}
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className={styles.gitPanelCenter}>
              <CreateGitVersion 
                mode='init'
                title="创建初始版本"
                onCancel={this.onCancelAddVersion}
                afterAdd={this.afterCreateVersion}></CreateGitVersion>
            </div>
          )
        }
      </div>
    )
  }
}

export default connect()(withRouter(GitEdit))