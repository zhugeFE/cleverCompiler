import * as React from 'react'
import { Button, Tabs, Tag, message, Spin } from 'antd'
import TimeLinePanel from './timeline/timeLine'
import './styles/gitEditPanel.less'
import Description from '../../components/description/description'
import GitConfigPanel from './edit/config'
import Markdown from '../../components/markdown/markdown'
import history from '../../utils/history'
import Commands from './edit/commands'
import { GitInfo } from '../../store/state/git';
import ajax from '../../utils/ajax'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import CreateVersion from './createVersion'
import { LeftOutlined } from '@ant-design/icons'
import { Version } from '../../store/state/common';
import * as _ from 'lodash';
import util from '../../utils/util'

interface Props extends RouteComponentProps<{
  id: string
}>{

}
interface State {
  tags: string[];
  gitInfo: GitInfo;
  currentVersion: Version;
}
class GitEditPanel extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      tags: [],
      gitInfo: null,
      currentVersion: null
    }
    this.afterCreateVersion = this.afterCreateVersion.bind(this)
    this.onCancelAddVersion = this.onCancelAddVersion.bind(this)
    this.onChangeVersion = this.onChangeVersion.bind(this)
    this.onChangeOrders = this.onChangeOrders.bind(this)
    this.onChangeReadme = this.onChangeReadme.bind(this)
    this.onChangeBuild = this.onChangeBuild.bind(this)
    this.onChangeUpdate = this.onChangeUpdate.bind(this)
    this.onSave = this.onSave.bind(this)
  }
  componentDidMount () {
    this.getInfo()
  }
  getInfo () {
    ajax({
      url: `/api/git/info/${this.props.match.params.id}`,
      method: 'GET'
    })
    .then(res => {
      const gitInfo = res.data as GitInfo
      this.setState({
        gitInfo
      })
      if (gitInfo.versionList && gitInfo.versionList.length) {
        this.setState({
          currentVersion: gitInfo.versionList[0]
        })
      }
    })
    .catch(err => {
      message.error(err.message)
    })
  }
  afterCreateVersion (version: Version): void {
    const gitInfo = _.cloneDeep(this.state.gitInfo)
    gitInfo.versionList.unshift(version)
    this.setState({
      gitInfo,
      currentVersion: version
    })
  }
  onChangeVersion (version: Version) {
    this.setState({
      currentVersion: version
    })
  }
  onChangeOrders (orders: string[]) {
    const version = _.cloneDeep(this.state.currentVersion)
    version.compileOrders = orders
    this.setState({
      currentVersion: version
    })
  }
  onChangeReadme (content: string) {
    const version = _.cloneDeep(this.state.currentVersion)
    version.readmeDoc = content
    this.setState({
      currentVersion: version
    })
  }
  onChangeBuild (content: string) {
    const version = _.cloneDeep(this.state.currentVersion)
    version.buildDoc = content
    this.setState({
      currentVersion: version
    })
  }
  onChangeUpdate (content: string) {
    const version = _.cloneDeep(this.state.currentVersion)
    version.updateDoc = content
    this.setState({
      currentVersion: version
    })
  }
  onSave () {
    console.log('保存', _.cloneDeep(this.state.currentVersion))
  }
  onCancelAddVersion (): void {
    console.log('取消添加版本')
  }
  render () {
    const labelWidth = 75
    if (!this.state.gitInfo) {
      return (
        <Spin className="git-edit-loading" tip="git详情获取中..." size="large"></Spin>
      )
    }
    return (
      <div className="git-edit-panel">
        <div className="git-panel-top">
          <a onClick={() => {history.goBack()}}><LeftOutlined/>返回</a>
        </div>
        {
          this.state.gitInfo?.versionList.length ? (
            <div className="git-panel-center">
              <TimeLinePanel 
                gitId={this.state.gitInfo.id} 
                repoId={this.state.gitInfo.gitId}
                versionList={this.state.gitInfo.versionList}
                afterAdd={this.afterCreateVersion}
                onChange={this.onChangeVersion}></TimeLinePanel>
              <div className="git-detail">
                <Description label="项目名称" labelWidth={labelWidth}>
                  {this.state.gitInfo.name} 
                  <Tag color="#87d068" style={{marginLeft: '5px'}}>v:{this.state.currentVersion?.name}</Tag> 
                  <Tag color="#f50">{util.dateTimeFormat(new Date(this.state.currentVersion?.publishTime))}</Tag>
                </Description>
                <Description label="git地址" labelWidth={labelWidth} className="git-addr">
                  <a>{this.state.gitInfo.gitRepo}</a>
                </Description>
                <Description label="配置项" labelWidth={labelWidth} display="flex" className="git-configs">
                  <GitConfigPanel store={this.state.gitInfo?.configs || []}></GitConfigPanel>
                  <Button className="btn-add-config-item">添加配置项</Button>
                </Description>
                <Description label="编译命令" display="flex" labelWidth={labelWidth}>
                  <Commands onChange={this.onChangeOrders} tags={this.state.tags}></Commands>
                </Description>
                <Tabs defaultActiveKey="readme" style={{margin: '10px 15px'}}>
                  <Tabs.TabPane tab="使用文档" key="readme">
                    <Markdown onChange={this.onChangeReadme} content={this.state.currentVersion?.readmeDoc}></Markdown>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部署文档" key="build">
                    <Markdown onChange={this.onChangeBuild} content={this.state.currentVersion?.buildDoc}></Markdown>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="更新内容" key="update">
                    <Markdown onChange={this.onChangeUpdate} content={this.state.currentVersion?.updateDoc}></Markdown>
                  </Tabs.TabPane>
                </Tabs>
                <Button type="primary" onClick={this.onSave}>保存</Button>
              </div>
            </div>
          ) : (
            <div className="git-panel-center">
              <CreateVersion 
                title="创建初始版本"
                gitId={this.state.gitInfo?.id} 
                repoId={this.state.gitInfo.gitId}
                onCancel={this.onCancelAddVersion}
                afterAdd={this.afterCreateVersion}></CreateVersion>
            </div>
          )
        }
      </div>
    )
  }
}
export default withRouter(GitEditPanel)