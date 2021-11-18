import * as React from 'react'
import { Timeline, Tag, Input, Form } from 'antd'
import TimelineItem from 'antd/lib/timeline/TimelineItem'
import { PlusOutlined } from '@ant-design/icons'
import * as _ from 'lodash';
import { Version, VersionStatus } from '@/models/common'
import CreateGitVersion from './createGitVersion'
import styles from './styles/timeline.less'

interface Props {
  gitId: string;
  repoId: string;
  versionList: Version[];
  currentVersion: Version;
  onChange?: (version: Version) => void;
  afterAdd? (version: Version): void;
}
interface State {
  showCreate: boolean;
  filter: string;
}
class TimeLinePanel extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      showCreate: false,
      filter: ''
    }
    this.toAddVersion = this.toAddVersion.bind(this)
    this.onHideAddVersion = this.onHideAddVersion.bind(this)
    this.onChooseVersion = this.onChooseVersion.bind(this)
    this.afterAdd = this.afterAdd.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }
  // static getDerivedStateFromProps(props:Props, state: State) {
  //   const version = props.versionList.find(item => item.id === state.currentVersion?.id)
  //   if (!_.isEqual(version, state.currentVersion)) {
  //     return {
  //       currentVersion: version || state.currentVersion
  //     }
  //   }
  //   return null
  // }
  onChooseVersion (version: Version) {
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
  onHideAddVersion () {
    this.setState({
      showCreate: false
    })
  }
  afterAdd (version: Version) {
    this.onHideAddVersion()
    if (this.props.afterAdd) this.props.afterAdd(version)
  }
  render () {
    return (
      <div className={styles.timeLinePanel}>
        {
          this.state.showCreate ? (
            <CreateGitVersion 
              mode='add'
              gitId={this.props.gitId} 
              repoId={this.props.repoId}
              versionList={this.props.versionList}
              onCancel={this.onHideAddVersion}
              afterAdd={this.afterAdd}></CreateGitVersion>
          ) : null
        }
        <Form layout="inline" onValuesChange={this.onFilter} wrapperCol={{span: 24}}>
          <Form.Item name="search">
            <Input.Search
              autoComplete="off"
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
              try {
                return new RegExp(this.state.filter).test(version.name!)
              }
              catch (err) {
                
              }
            }).map(version => {
              if (version === this.props.currentVersion) {
                return (
                  <TimelineItem key={version.id} color={version.status === VersionStatus.deprecated ? 'gray' : 'blue'}>
                    <a 
                      className={version.status === VersionStatus.deprecated ? styles.disabled : null} 
                      onClick={this.onChooseVersion.bind(this, version)}>
                      <Tag color="blue">{version.name}</Tag>
                    </a>
                  </TimelineItem>
                )
              } else {
                return (
                  <TimelineItem key={version.id} color={version.status === VersionStatus.deprecated ? 'gray' : 'blue'}>
                    <a className={version.status === VersionStatus.deprecated ? styles.disabled : null} onClick={this.onChooseVersion.bind(this, version)}>{version.name}</a>
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