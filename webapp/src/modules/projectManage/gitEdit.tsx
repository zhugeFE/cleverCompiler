import * as React from 'react'
import { Icon, Button, Tabs } from 'antd'
import TimeLinePanel from '../../components/timeline/timeLine'
import './styles/gitEditPanel.less'
import Description from '../../components/description/description'
import GitConfigPanel from './edit/config'
import Markdown from '../../components/markdown/markdown'

interface Props {

}
interface State {

}
class GitEditPanel extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
  }
  render () {
    const source = '# Live demo\nChanges are automatically rendered as you type.\n## Table of Contents\n* Implements [GitHub Flavored Markdown](https://github.github.com/gfm/)\n* Renders actual, "native" React DOM elements\n* Allows you to escape or skip HTML (try toggling the checkboxes above)\n## HTML block below'
    return (
      <div className="git-edit-panel">
        <div className="git-panel-top">
          <a><Icon type="left" />返回</a>
        </div>
        <div className="git-panel-center">
          <TimeLinePanel></TimeLinePanel>
          <div className="git-detail">
            <Description label="名称">webapp</Description>
            <Description label="git地址">http://gl.zhugeio.com/dongyongqiang/webapp</Description>
            <Description label="配置" display="flex">
              <GitConfigPanel store={[]}></GitConfigPanel>
              <Button>添加配置项</Button>
            </Description>
            <Description label="编译命令"></Description>
            <Tabs defaultActiveKey="readme">
              <Tabs.TabPane tab="使用文档" key="readme">
                <Markdown content={source}></Markdown>
              </Tabs.TabPane>
              <Tabs.TabPane tab="部署文档" key="build"></Tabs.TabPane>
              <Tabs.TabPane tab="更新内容" key="update"></Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}
export default GitEditPanel