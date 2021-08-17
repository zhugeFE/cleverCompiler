/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-09 21:22:00
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-16 14:45:41
 */
import * as React from 'react'
import { Timeline, Tag, Input, Form } from 'antd'
import TimelineItem from 'antd/lib/timeline/TimelineItem'
import { PlusOutlined } from '@ant-design/icons'
import * as _ from 'lodash';
import { TemplateVersion } from "@/models/template"
import CreateTemplateVersion from './createTemplateVersion'
import styles from './styles/timeline.less'

interface Props {
  id: string;
  versionList: TemplateVersion[];
  onChange?: (version: TemplateVersion) => void;
  afterAdd? (version: TemplateVersion): void;
}
interface State {
  currentVersion: TemplateVersion | null;
  showCreate: boolean;
  filter: string;
}
class TimeLinePanel extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      currentVersion: this.props.versionList?this.props.versionList[0]:null ,
      showCreate: false,
      filter: ''
    }
    this.toAddVersion = this.toAddVersion.bind(this)
    this.onChooseVersion = this.onChooseVersion.bind(this)
    this.afterAdd = this.afterAdd.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }
  // static getDerivedStateFromProps(props:Props, state: State) {
  //   const version = props.versionList.find(item => item.currentVersionContent?.id === state.currentVersion?.currentVersionContent?.id)
  //   if (!_.isEqual(version, state.currentVersion)) {
  //     return {
  //       currentVersion: version || state.currentVersion
  //     }
  //   }
  //   return null
  // }
  onChooseVersion (version: TemplateVersion) {
    this.setState({
      currentVersion: version
    })
    if (this.props.onChange) this.props.onChange(version)
  }
  onFilter (changedValues: {
    search: string;
  }) {
    this.setState({
      filter: changedValues.search
    })
  }
  toAddVersion () {
    this.setState({
      showCreate: true
    })
  }
  afterAdd (version: TemplateVersion) {
    // this.setState({
    //   currentVersion: version,
    //   showCreate: false
    // })
    if (this.props.afterAdd) this.props.afterAdd(version)
  }
  render () {
    return (
      <div className={styles.timeLinePanel}>
        {
          this.state.showCreate ? (
            <CreateTemplateVersion 
              version={this.props.versionList[0].version}
              id={this.props.id} 
              afterAdd={this.afterAdd}></CreateTemplateVersion>
          ) : null
        }
        <Form layout="inline" onValuesChange={this.onFilter} wrapperCol={{span: 24}}>
          <Form.Item name="search">
            <Input.Search
              className={styles.versionSearch}
              size="middle"
              placeholder="x.x.x"/>
          </Form.Item>
        </Form>
        <Timeline mode="alternate">
          <TimelineItem dot={
            <a onClick={this.toAddVersion}><PlusOutlined/></a>
          }></TimelineItem>
          {
            this.props.versionList.filter(version => {
              return new RegExp(this.state.filter).test(version.version)
            }).map(version => {
              if (version === this.state.currentVersion) {
                return (
                  <TimelineItem key={version.id || "i"} color={version.status === 0 ? 'gray' : 'blue'}>
                    <a 
                      className={version.status === 0 ? styles.disabled : null} 
                      onClick={this.onChooseVersion.bind(this, version)}>
                      <Tag color="blue" title={version.description}>{version.version}</Tag>
                    </a>
                  </TimelineItem>
                )
              } else {
                return (
                  <TimelineItem key={version.id} color={version.status === 0 ? 'gray' : 'blue'}>
                    <a title={version.description} className={version.status === 0 ? styles.disabled : null} onClick={this.onChooseVersion.bind(this, version)}>{version.version}</a>
                  </TimelineItem>
                )
              }
            })
          }
        </Timeline>
      </div>
    )
  }
}
export default TimeLinePanel