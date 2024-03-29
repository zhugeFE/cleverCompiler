import type { Dispatch } from '@/.umi/core/umiExports'
import Description from '@/components/description/description'
import { VersionStatus } from '@/models/common'
import type { GitBranch, GitInfo, GitInfoBranch, GitList, GitVersion } from '@/models/git'
import util from '@/utils/utils'
import { LeftOutlined } from '@ant-design/icons'
import type { IRouteComponentProps } from '@umijs/renderer-react'
import { Tabs, Tag, Spin, Tooltip, Progress, Input, Select, message, Radio } from 'antd'
import { connect } from 'dva'
import React from 'react'
import { withRouter } from 'react-router'
import CreateGitVersion from './createGitVersion'
import GitConfigPanel from './gitConfig'
import GitAddConfig from './gitAddConfig'
import styles from './styles/gitEdit.less'
import Commands from './commands'
import Markdown from '@/components/markdown/markdown'
import SlidePanel from './leftPanel'
import type { ConnectState } from '@/models/connect'
import type { RefSelectProps, SelectProps} from 'antd/lib/select';
import { SelectValue } from 'antd/lib/select'
export interface GitEditProps extends IRouteComponentProps<{
  id: string;
}>{
  gitInfo: GitInfo;
  currentBranch: GitInfoBranch;
  currentVersion: GitVersion;
  dispatch: Dispatch;
}
interface State {
  showAddConfig: boolean;
  updateTimeout: number;
  delTimeout: number;
  savePercent: number;
  delTooltip: string;
  gitList: GitList[] | null;
  queryGitData: boolean;
  branchPending: boolean;
  branchList: GitBranch[];
  sourceType: string;
}

class GitEdit extends React.Component<GitEditProps, State> {
  delInterval?: NodeJS.Timeout;
  outputInput= React.createRef<Input>()
  deboundtimerId?: NodeJS.Timeout 
  // publicGit = React.createRef<any>()
  constructor (props: GitEditProps) {
    super(props)
    this.state = {
      showAddConfig: false,
      updateTimeout: 0,
      delTimeout: 0,
      savePercent: 100,
      delTooltip: '',
      gitList: null,
      queryGitData: false,
      branchPending: false,
      branchList: [],
      sourceType: "select"
    }

    this.onCancelConfig = this.onCancelConfig.bind(this)
    this.afterAddConfig = this.afterAddConfig.bind(this)
    this.onDeleteVersion = this.onDeleteVersion.bind(this)
    this.onAddConfig = this.onAddConfig.bind(this)
    this.onChangeReadme = this.onChangeReadme.bind(this)
    this.onChangeBuild = this.onChangeBuild.bind(this)
    this.onChangeBuildUpdate = this.onChangeBuildUpdate.bind(this)
    this.onChangeUpdate = this.onChangeUpdate.bind(this)
    this.onCancelAddVersion = this.onCancelAddVersion.bind(this)
    this.onChangeOutputName = this.onChangeOutputName.bind(this)
    this.onDeleteBranch = this.onDeleteBranch.bind(this)
    this.selectPubliceGit = this.selectPubliceGit.bind(this)
    this.onRadioChange = this.onRadioChange.bind(this)
    this.updateVersion = this.updateVersion.bind(this)
    this.RadioButtonChange = this.RadioButtonChange.bind(this)
  }

  componentDidMount () {
    this.delInterval = setInterval( () => this.initDelInterval(this.props.currentVersion), 1000)
    this.getRemoteList () 
    if (this.props.match.params.id != "createGit") {
      this.getGitInfo(this.props.match.params.id)
    }
  }
  componentDidUpdate (pre: GitEditProps) {    
    if (pre.currentVersion && pre.currentVersion.outputName != this.props.currentVersion.outputName) {
      this.outputInput.current?.setValue(this.props.currentVersion.outputName)
    }  
    //尝试用ref替换publicGit
    // if (pre.currentVersion && pre.currentVersion.publicGit != this.props.currentVersion.publicGit) {
    //   this.publicGit.current?.setValue(this.props.currentVersion.publicGit)
    // }      
    this.delInterval = setInterval( () => this.initDelInterval(this.props.currentVersion), 1000)
  }
  componentWillUnmount () {
    if (this.delInterval) clearInterval(this.delInterval);
    this.setState = ()=>false;

  }

  getGitInfo (id: string) {
    this.props.dispatch({
      type: 'git/getInfo',
      payload: id
    })
  }

  initDelInterval (version: GitVersion | null) {
    clearInterval(this.delInterval as unknown as number)
    if (!version || version.status != VersionStatus.normal) {
      this.setState({
        delTimeout: 0,
        delTooltip: ''
      })
      return
    }
    const delTimeout = 24 * 60 * 60 * 1000 - (new Date().getTime() - version!.publishTime)
    const delTooltip = `可删除倒计时：${util.timeFormat(delTimeout)}`
    if (delTimeout <= 0) {
      clearInterval(this.initDelInterval as unknown as number)
    }
    this.setState({
      delTimeout,
      delTooltip
    })
  }

  onCancelConfig () {
    this.setState({
      showAddConfig: false
    })
  }

  onDeleteBranch () {
    const { currentVersion, currentBranch} = this.props
    const { gitInfo } = this.props
    if ( !gitInfo || !currentBranch || !currentVersion) return
    if ( gitInfo.branchList.length == 1) {
      message.error('初始分支，不可删除！') 
      return
    }
    this.props.dispatch({
      type: 'git/deleteBranch',
      payload: currentBranch.id,
      callback: (res: boolean) => {
        if (!res) {
          message.error({
            content: "删除失败",
            duration: 0.5
          })
        } else {
          message.success({
            content: "删除成功",
            duration: 0.5
          })
        }
      }   
    })
  }
  onDeleteVersion () {
    const { currentVersion, currentBranch} = this.props
    const { gitInfo } = this.props
    if ( !gitInfo || !currentBranch || !currentVersion) return
    if ( currentBranch.versionList.length == 1) {
      this.onDeleteBranch()
      return
    }
    this.props.dispatch({
      type: 'git/deleteVersion',
      payload: currentVersion.id,
      callback: (res: boolean) => {
        if (!res) {
          message.error({
            content: "删除失败",
            duration: 0.5
          })
        } else {
          message.success({
            content: "删除成功",
            duration: 0.5
          })
        }
      }
    })
  }

  onAddConfig () {
    this.setState({
      showAddConfig: true
    })
  }

  onCancelAddVersion () {
    this.props.history.goBack()
  }

  debounce (fn: (param: Record<string, string | number>) => void, wait: number = 500) {
    return (obj: Record<string, string | number>) => {
      if (this.deboundtimerId) {
        clearTimeout(this.deboundtimerId)
      }
      this.deboundtimerId = setTimeout(() => { 
        fn(obj)      
      }, wait);
    }
  }

  onChangeOutputName (event: any) {    
    const outputName = event.target.value
    this.debounce(this.updateVersion)({outputName})
  }

  afterAddConfig (isContonue: boolean) {
    this.setState({
      showAddConfig: isContonue 
    })
  }
 
  onChangeVersionStatue (status: VersionStatus) {
    if (!this.props.currentVersion) return
    this.props.dispatch({
      type: "git/updateGitVersionStatus",
      payload: {
        id: this.props.currentVersion.id,
        status: Number(status)
      },
      callback: (res: boolean) => {
        if(!res) {
          message.error({
            content: "操作失败",
            duration: 0.5
          })
        } else{
          message.success({
            content: "操作成功",
            duration: 0.5
          })
        }
      }
    })
  }

  getRemoteList () {
    this.setState({
      queryGitData: true
    })
    this.props.dispatch({
      type: 'git/queryRemoteGitList',
      callback: (list: GitList[]) => {
        this.setState({
          gitList: list,
          queryGitData: false,
        })
      }
    })
  }

  getBranchList (id: string) {
    this.setState({
      branchPending: true
    })
    this.props.dispatch({
      type: 'git/queryBranchs',
      payload: id,
      callback: (list: GitBranch[]) => {
        this.setState({
          branchList: list,
          branchPending: false
        })
      }
    })
  }

  onChangeReadme (content: string) {
    const readmeDoc = content
    this.debounce(this.updateVersion)({readmeDoc})
  }

  onChangeBuild (content: string) {
    const buildDoc = content
    this.debounce(this.updateVersion)({buildDoc})
  }


  onChangeBuildUpdate (content: string) {
    const buildUpdateDoc = content
    this.debounce(this.updateVersion)({buildUpdateDoc})
  }

  onChangeUpdate (content: string) {    
    const updateDoc = content
    this.debounce(this.updateVersion)({updateDoc})
  }

  selectPubliceGit (id: number) {
    const publicGit = id
    // this.getBranchList(String(publicGit)) //这里获取git里的分支信息。后期可以做指定到git
    this.updateVersion({
      publicGit
    })
  }

  onRadioChange (e: any) {
    const publicType = e.target.value
    this.updateVersion({
      publicType
    })
  }

  RadioButtonChange (e: any) {
    const soucre = e.target.value
    this.setState({
      sourceType: soucre
    })
  }

  updateVersion (param: Record<string, string | number>) {
    this.props.dispatch({
      type: 'git/updateVersion',
      payload: param
    })
  }

  render () {
    const labelWidth = 75
    const displaySelect = this.state.sourceType == 'select' ? " " : "none"
    const displayInput =  this.state.sourceType == "add" ? " " : "none" 
    if (!this.props.gitInfo && this.props.match.params.id != 'createGit') {
      return (
        <Spin className={styles.gitEditLoading} tip="git详情获取中..." size="large" />
      )
    }
    return (
      <div className={styles.gitEditPanel}>
        {this.state.showAddConfig && <GitAddConfig onClose={this.onCancelConfig} />}
        <div className={styles.gitPanelTop}>
          <a onClick={() => {this.props.history.goBack()}}><LeftOutlined/>返回</a>
          <span style={{marginLeft: '20px'}}>
            <Tooltip title="发布后版本将变为只读状态">
              {
                this.props.currentVersion?.status === VersionStatus.placeOnFile ? (
                   <a style={{marginLeft: '10px', color: '#faad14'}}>已发布</a>): (
                     
                    this.props.currentVersion?.status !== VersionStatus.deprecated) &&
                     <a style={{marginLeft: '10px', color: '#faad14'}} onClick={()=>this.onChangeVersionStatue(VersionStatus.placeOnFile)} >发布 </a> 
              }
            </Tooltip>
            <Tooltip title="废弃后，新建项目中该版本将不可用">
              {
                this.props.currentVersion?.status === VersionStatus.deprecated ? (
                  <a style={{marginLeft: '10px', color: '#f5222d'}} >已废弃</a>
                ) : (
                  <a style={{marginLeft: '10px', color: '#f5222d'}} onClick={()=>this.onChangeVersionStatue(VersionStatus.deprecated)} >废弃</a>
                )
              }
            </Tooltip>
            {
              this.state.delTimeout > 0 && this.props.currentVersion?.status === VersionStatus.normal ? (
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
              format={percent => percent === 100 ? 'saved' : 'saving'}
               />
          </span>
        </div>
        {           
          this.props.match.params.id !== 'createGit' ? (
            <div className={styles.gitPanelCenter}>
              <SlidePanel />
              <div className={styles.gitDetail}>
                {
                  this.props.currentVersion.status == VersionStatus.deprecated && <div className={styles.mark}> 已废弃 </div>
                }
                <Description label="项目名称" labelWidth={labelWidth}>
                  {this.props.gitInfo.name} 
                  <Tooltip title={this.props.currentBranch?.description} placement="bottom">
                    <Tag color="#87d068" style={{marginLeft: '5px'}}>b:{this.props.currentBranch?.name}</Tag>
                  </Tooltip>
                  <Tooltip title={this.props.currentVersion?.description} placement="bottom">
                    <Tag color="#87d068" style={{marginLeft: '5px'}}>v:{this.props.currentVersion?.name}</Tag>
                  </Tooltip>
                  <Tooltip title="版本发布时间">
                    <Tag color="#f50">{ this.props.currentVersion?.publishTime ? util.dateTimeFormat(new Date(this.props.currentVersion!.publishTime)) : "-"}</Tag>
                  </Tooltip>
                </Description>
                <Description label="git地址" labelWidth={labelWidth} display="block"  className={styles.gitAddr}>
                    <a>{this.props.gitInfo.gitRepo}</a>
                  </Description>
                <Description label="git来源" labelWidth={labelWidth} display="block" className={styles.gitAddr}>
                    <a>{`${this.props.gitInfo.name}(${this.props.currentVersion?.sourceType}：${this.props.currentVersion?.sourceValue})`}</a>
                  </Description>
                <Description label="配置项" labelWidth={labelWidth} display="flex" className={styles.gitConfigs}>
                  <GitConfigPanel onAddConfig={this.onAddConfig} />
                </Description>
                <Description label="编译命令" display="flex" labelWidth={labelWidth} style={{marginBottom:10}}>
                  {this.props.currentVersion && <Commands/>}
                </Description>
                <Description label="输出文件" display="flex" labelWidth={labelWidth} style={{marginBottom:10}}>
                  {this.props.currentVersion ? <div className={!this.props.currentVersion.outputName ? styles.nullValue : ""}>
                    <Input 
                      ref={this.outputInput}
                      style={{width: 350}} 
                      autoComplete="off"
                      onChange={this.onChangeOutputName} 
                      placeholder="填写项目根目录下的绝对路径：（例：/dist）" 
                      disabled={this.props.currentVersion.status != VersionStatus.normal} 
                      defaultValue={this.props.currentVersion.outputName} /> 
                  </div> : null}
                </Description>
                <Description label="是否发布到git">
                  <Radio.Group 
                    onChange={this.onRadioChange} 
                    disabled={this.props.currentVersion?.status != VersionStatus.normal}  
                    value={this.props.currentVersion?.publicType}>
                    <Radio id="0" value={0}>是</Radio>
                    <Radio id="1" value={1}>否</Radio>
                  </Radio.Group>
                </Description>
                {
                  this.props.currentVersion?.publicType == 0 &&
                  this.state.gitList &&
                  (
                    <Description 
                      label="发布代码库"
                      style={{marginTop:10}}
                      labelWidth={labelWidth}
                      display="flex">
                      <Select 
                        ref={this.publicGit}
                        style={{width:250}} 
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={this.props.currentVersion?.status != VersionStatus.normal} 
                        onChange={this.selectPubliceGit} 
                        placeholder="选择发布代码库"
                        defaultValue={this.props.currentVersion.publicGit}>
                        {
                          this.state.gitList?.map(item => {
                            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                          })
                        }
                      </Select>
                    </Description>
                  )
                }
                <Tabs defaultActiveKey="readme" style={{margin: '10px 15px'}}>
                  <Tabs.TabPane tab="使用文档" key="readme">
                    {
                    this.props.currentVersion ? 
                      <Markdown
                        DisabledEdit={this.props.currentVersion.status != VersionStatus.normal}
                        onChange={this.onChangeReadme} 
                        markId={this.props.currentVersion.id} 
                        content={this.props.currentVersion.readmeDoc} /> : null}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="完整部署文档" key="build1">
                    {
                    this.props.currentVersion ? 
                    <Markdown 
                      onChange={this.onChangeBuild} 
                      DisabledEdit={this.props.currentVersion.status != VersionStatus.normal}
                      markId={this.props.currentVersion.id} 
                      content={this.props.currentVersion.buildDoc} /> : null}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部署更新文档" key="build2">
                    {
                    this.props.currentVersion ? 
                    <Markdown 
                      onChange={this.onChangeBuildUpdate} 
                      DisabledEdit={this.props.currentVersion.status != VersionStatus.normal}
                      markId={this.props.currentVersion.id} 
                      content={this.props.currentVersion.buildUpdateDoc} /> : null}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="更新内容" key="update">
                    {
                    this.props.currentVersion ? 
                    <Markdown 
                      onChange={this.onChangeUpdate} 
                      DisabledEdit={this.props.currentVersion.status != VersionStatus.normal}
                      markId={this.props.currentVersion.id} 
                      content={this.props.currentVersion.updateDoc} /> : null}
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
              />
            </div>
          )
        }
      </div>
    )
  }
}

export default connect(({git}: ConnectState) => {
  return {
    gitInfo: git.currentGit!,
    currentBranch: git.currentBranch!,
    currentVersion: git.currentVersion!
  }
})(withRouter(GitEdit))