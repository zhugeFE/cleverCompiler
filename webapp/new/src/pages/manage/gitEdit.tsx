import { Dispatch } from '@/.umi/core/umiExports'
import Description from '@/components/description/description'
import { GitInfo, GitVersion } from '@/models/git'
import util from '@/utils/utils'
import { LeftOutlined } from '@ant-design/icons'
import { IRouteComponentProps } from '@umijs/renderer-react'
import { Button, Tabs, Tag, Spin, Tooltip, Progress } from 'antd'
import { connect } from 'dva'
import React from 'react'
import { withRouter } from 'react-router'
import CreateGitVersion from './createGitVersion'
import TimeLinePanel from './gitTimeLine'
import styles from './styles/gitEdit.less'

export interface GitEditProps extends IRouteComponentProps<{
  id: string;
}>{
  dispatch: Dispatch;
}
interface State {
  gitInfo: GitInfo | null;
  showAddConfig: boolean;
  currentVersion: GitVersion | null;
  delTimeout: number;
  delTip: string;
  savePercent: number;
}

class GitEdit extends React.Component<GitEditProps, State> {
  constructor (props: GitEditProps) {
    super(props)
    this.state = {
      gitInfo: null,
      showAddConfig: false,
      currentVersion: null,
      delTimeout: 0,
      delTip: '',
      savePercent: 100
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
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'git/getInfo',
      payload: this.props.match.params.id,
      callback: (info: GitInfo) => {
        this.setState({
          gitInfo: info
        })
      }
    })
  }

  onCancelConfig () {

  }

  onDeleteVersion () {

  }

  onChangeVersion () {

  }

  onAddConfig () {
    
  }

  onChangeOrders () {

  }

  onChangeReadme () {

  }

  onChangeBuild () {

  }

  onChangeUpdate () {

  }

  onCancelAddVersion () {

  }

  afterAddConfig () {

  }

  afterCreateVersion () {

  }

  afterDelConfig () {

  }

  render () {
    const labelWidth = 75
    if (!this.state.gitInfo) {
      return (
        <Spin className={styles.gitEditLoading} tip="git详情获取中..." size="large"></Spin>
      )
    }
    return (
      <div className={styles.gitEditPanel}>
        {/* {
          this.state.showAddConfig ? (
            <GitAddConfig 
              gitId={this.props.match.params.id}
              version={this.state.currentVersion}
              onClose={this.onCancelConfig}
              onSubmit={this.afterAddConfig}></GitAddConfig>
          ) : null
        } */}
        <div className={styles.gitPanelTop}>
          <a onClick={() => {this.props.history.goBack()}}><LeftOutlined/>返回</a>
          <span style={{marginLeft: '20px'}}>
            <Tooltip title="归档后版本将变为只读状态">
              <a style={{marginLeft: '10px', color: '#faad14'}}>归档</a>
            </Tooltip>
            <Tooltip title="废弃后，新建项目中该版本将不可用">
              <a style={{marginLeft: '10px', color: '#f5222d'}}>废弃</a>
            </Tooltip>
            {
              this.state.delTimeout > 0 ? (
                <span>
                  <a onClick={this.onDeleteVersion} style={{marginLeft: '10px', color: '#f5222d', marginRight: '5px'}}>删除</a>
                  ({this.state.delTip})
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
                afterAdd={this.afterCreateVersion}
                onChange={this.onChangeVersion}></TimeLinePanel>
              <div className={styles.gitDetail}>
                <Description label="项目名称" labelWidth={labelWidth}>
                  {this.state.gitInfo.name} 
                  <Tooltip title={`${this.state.currentVersion?.sourceType}: ${this.state.currentVersion?.sourceValue}`} placement="bottom">
                    <Tag color="#87d068" style={{marginLeft: '5px'}}>v:{this.state.currentVersion?.name}</Tag>
                  </Tooltip>
                  <Tag color="#f50">{util.dateTimeFormat(new Date(this.state.currentVersion!.publishTime))}</Tag>
                </Description>
                <Description label="git地址" labelWidth={labelWidth} className={styles.gitAddr}>
                  <a>{this.state.gitInfo.gitRepo}</a>
                </Description>
                <Description label="配置项" labelWidth={labelWidth} display="flex" className={styles.gitConfigs}>
                  {/* <GitConfigPanel 
                    store={this.state.currentVersion?.configs || []}
                    afterDelConfig={this.afterDelConfig}></GitConfigPanel> */}
                  <Button className={styles.btnAddConfigItem} onClick={this.onAddConfig}>添加配置项</Button>
                </Description>
                <Description label="编译命令" display="flex" labelWidth={labelWidth}>
                  {/* {this.state.currentVersion ? <Commands onChange={this.onChangeOrders} tags={this.state.currentVersion?.compileOrders}></Commands> : null} */}
                </Description>
                <Tabs defaultActiveKey="readme" style={{margin: '10px 15px'}}>
                  <Tabs.TabPane tab="使用文档" key="readme">
                    {/* {this.state.currentVersion ? <Markdown onChange={this.onChangeReadme} content={this.state.currentVersion?.readmeDoc}></Markdown> : null} */}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部署文档" key="build">
                    {/* {this.state.currentVersion ? <Markdown onChange={this.onChangeBuild} content={this.state.currentVersion?.buildDoc}></Markdown> : null} */}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="更新内容" key="update">
                    {/* {this.state.currentVersion ? <Markdown onChange={this.onChangeUpdate} content={this.state.currentVersion?.updateDoc}></Markdown> : null} */}
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className={styles.gitPanelCenter}>
              <CreateGitVersion 
                title="创建初始版本"
                versionList={this.state.gitInfo?.versionList}
                gitId={this.state.gitInfo?.id} 
                repoId={this.state.gitInfo.gitId}
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