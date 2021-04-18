import * as React from 'react'
import './styles/templateEditPanel.less'
import TimeLinePanel from './timeline/gitTimeLine'
import Description from '../../components/description/description'
import GitConfigPanel from './edit/config'
import { Button, Tabs, Tag, Radio, Tooltip, Progress } from 'antd'
import Commands from './edit/commands'
import Markdown from '../../components/markdown/markdown'
import history from '../../utils/history'
import { LeftOutlined } from '@ant-design/icons'
import { Version } from '../../store/state/common';

interface Props {

}
interface State {
  versionList: Version[];
  /**
   * 自动保存进度条
   */
  savePercent: number;
  /**
   * 可删除操作倒计时
   */
  delTimeout: number;
  delTooltip: string;
}
class TemplateEdit extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      versionList: [],
      savePercent: 100,
      delTimeout: 0,
      delTooltip: ''
    }
    this.onAddVersion = this.onAddVersion.bind(this)
    this.onDeleteVersion = this.onDeleteVersion.bind(this)
  }
  onAddVersion () {
    console.log('add new version')
  }
  onDeleteVersion () {

  }
  savePercentFormat (percent: number) {
    return percent === 100 ? 'saved' : 'saving'
  }
  render () {
    const source = '# Live demo\nChanges are automatically rendered as you type.\n## Table of Contents\n* Implements [GitHub Flavored Markdown](https://github.github.com/gfm/)\n* Renders actual, "native" React DOM elements\n* Allows you to escape or skip HTML (try toggling the checkboxes above)\n## HTML block below'
    const labelWidth = 75
    return (
      <div className="template-edit-panel">
        <div className="template-panel-top">
          <a onClick={() => {history.goBack()}}><LeftOutlined/>返回</a>
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
                  ({this.state.delTooltip})
                </span>
              ) : null
            }
            <Progress 
              percent={this.state.savePercent} 
              size="small"
              strokeWidth={2}
              format={this.savePercentFormat}></Progress>
          </span>
        </div>
        <div className="template-panel-center">
          {
            <TimeLinePanel gitId="" repoId="" versionList={this.state.versionList}></TimeLinePanel>
          }
          <div className="template-detail">
            <Description label="模板名称" labelWidth={labelWidth}>webapp <Tag color="#87d068">v:1.2.1</Tag> <Tag color="#f50">2020-01-15 12:00:20</Tag></Description>
            <Description label="全局配置" labelWidth={labelWidth} display="flex" className="template-configs">
              <GitConfigPanel store={[]}></GitConfigPanel>
              <Button className="btn-add-config-item">添加配置项</Button>
            </Description>
            <Description label="项目列表" display="flex">
              <Tabs type="editable-card">
                <Tabs.TabPane tab="webapp" key="webapp">
                  <Description label="版本" style={{marginBottom: 5}} display="flex">1.2.9</Description>
                  <GitConfigPanel store={[]}></GitConfigPanel>
                  <Description label="发布方式" display="flex" style={{marginTop: 10}}>
                    <Radio.Group value="git">
                      <Radio value="git">发布到git</Radio>
                      <Radio value="download">下载</Radio>
                    </Radio.Group>
                  </Description>
                </Tabs.TabPane>
                <Tabs.TabPane tab="sdkv" key="sdkv">
                  <Description label="版本">1.2.9</Description>
                  <GitConfigPanel store={[]}></GitConfigPanel>
                </Tabs.TabPane>
              </Tabs>
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
export default TemplateEdit