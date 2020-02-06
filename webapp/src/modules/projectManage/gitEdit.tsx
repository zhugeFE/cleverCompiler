import * as React from 'react'
import { Icon, Button, Tabs, Input, Tag } from 'antd'
import TimeLinePanel from '../../components/timeline/timeLine'
import './styles/gitEditPanel.less'
import Description from '../../components/description/description'
import GitConfigPanel from './edit/config'
import Markdown from '../../components/markdown/markdown'
import history from '../../utils/history'
import Commands from './edit/commands'
import { Version } from '../../types/common.d';

interface Props {

}
interface State {
  tags: string[],
  versionList: Version[]
}
class GitEditPanel extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      tags: [],
      versionList: [
        {id: '1', version: '1.0.0', createTime: new Date(), updateTime: new Date(), disabled: false},
        {id: '2', version: '1.1.0', createTime: new Date(), updateTime: new Date(), disabled: true},
        {id: '3', version: '1.2.0', createTime: new Date(), updateTime: new Date(), disabled: false}
      ].reverse()
    }
  }
  onAddVersion () {

  }
  render () {
    const source = '# Live demo\nChanges are automatically rendered as you type.\n## Table of Contents\n* Implements [GitHub Flavored Markdown](https://github.github.com/gfm/)\n* Renders actual, "native" React DOM elements\n* Allows you to escape or skip HTML (try toggling the checkboxes above)\n## HTML block below'
    const labelWidth = 75
    return (
      <div className="git-edit-panel">
        <div className="git-panel-top">
          <a onClick={() => {history.goBack()}}><Icon type="left" />返回</a>
        </div>
        <div className="git-panel-center">
          <TimeLinePanel versionList={this.state.versionList} onAddVersion={this.onAddVersion}></TimeLinePanel>
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
          </div>
        </div>
      </div>
    )
  }
}
export default GitEditPanel