import * as React from 'react'
import { Button, Tabs, Input, Tag, message, Spin } from 'antd'
import TimeLinePanel from '../../components/timeline/timeLine'
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
  }
  onAddVersion () {

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
    gitInfo.versionList.push(version)
    this.setState({
      gitInfo,
      currentVersion: version
    })
  }
  onCancelAddVersion (): void {
    console.log('取消添加版本')
  }
  render () {
    const source = '# Live demo\nChanges are automatically rendered as you type.\n## Table of Contents\n* Implements [GitHub Flavored Markdown](https://github.github.com/gfm/)\n* Renders actual, "native" React DOM elements\n* Allows you to escape or skip HTML (try toggling the checkboxes above)\n## HTML block below'
    const labelWidth = 75
    if (!this.state.gitInfo) {
      return (
        <Spin tip="git详情获取中..." size="large"></Spin>
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
              <TimeLinePanel versionList={this.state.gitInfo.versionList} onAddVersion={this.onAddVersion}></TimeLinePanel>
              <div className="git-detail">
                <Description label="项目名称" labelWidth={labelWidth}>webapp <Tag color="#87d068">v:1.2.1</Tag> <Tag color="#f50">2020-01-15 12:00:20</Tag></Description>
                <Description label="git地址" labelWidth={labelWidth} className="git-addr"><a>http://gl.zhugeio.com/dongyongqiang/webapp</a></Description>
                <Description label="配置项" labelWidth={labelWidth} display="flex" className="git-configs">
                  <GitConfigPanel store={[]}></GitConfigPanel>
                  <Button className="btn-add-config-item">添加配置项</Button>
                </Description>
                <Description label="编译命令" display="flex" labelWidth={labelWidth}>
                  <Commands tags={this.state.tags}></Commands>
                </Description>
                <Tabs defaultActiveKey="readme" style={{margin: '10px 15px'}}>
                  <Tabs.TabPane tab="使用文档" key="readme">
                    <Markdown content={source}></Markdown>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部署文档" key="build">
                    <Markdown content="部署文档"></Markdown>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="更新内容" key="update">
                    <Markdown content="更新内容"></Markdown>
                  </Tabs.TabPane>
                </Tabs>
                <Button type="primary">保存</Button>
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