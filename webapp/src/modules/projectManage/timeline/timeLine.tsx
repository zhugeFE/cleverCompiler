import * as React from 'react'
import './timeLine.less'
import { Timeline, Tag, Input } from 'antd'
import TimelineItem from 'antd/lib/timeline/TimelineItem'
import { PlusOutlined } from '@ant-design/icons'
import { Version, VersionStatus } from '../../../store/state/common';
import CreateVersion from '../createVersion'

interface Props {
  gitId: string;
  repoId: string;
  versionList: Version[];
  onChange?: (version: Version) => void;
  afterAdd? (version: Version): void;
}
interface State {
  currentVersion: Version;
  showCreate: boolean;
  filter: string;
}
class TimeLinePanel extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      currentVersion: this.props.versionList[0],
      showCreate: false,
      filter: ''
    }
    this.toAddVersion = this.toAddVersion.bind(this)
    this.onChooseVersion = this.onChooseVersion.bind(this)
    this.afterAdd = this.afterAdd.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }
  onChooseVersion (version: Version) {
    this.setState({
      currentVersion: version
    })
    if (this.props.onChange) this.props.onChange(version)
  }
  onFilter (v: string) {
    this.setState({
      filter: v
    })
  }
  toAddVersion () {
    this.setState({
      showCreate: true
    })
  }
  afterAdd (version: Version) {
    this.setState({
      currentVersion: version,
      showCreate: false
    })
    if (this.props.afterAdd) this.props.afterAdd(version)
  }
  render () {
    return (
      <div className="time-line-panel">
        {
          this.state.showCreate ? (
            <CreateVersion 
              gitId={this.props.gitId} 
              repoId={this.props.repoId}
              onCancel={this.toAddVersion}
              afterAdd={this.afterAdd}></CreateVersion>
          ) : null
        }
        <Input.Search
          className="version-search"
          size="small"
          placeholder="x.x.x"
          onSearch={this.onFilter}/>
        <Timeline mode="alternate">
          <TimelineItem dot={
            <a onClick={this.toAddVersion}><PlusOutlined/></a>
          }></TimelineItem>
          {
            this.props.versionList.filter(version => {
              return new RegExp(this.state.filter).test(version.name)
            }).map(version => {
              if (version === this.state.currentVersion) {
                return (
                  <TimelineItem key={version.id} color={version.status === VersionStatus.deprecated ? 'gray' : 'blue'}>
                    <a 
                      className={version.status === VersionStatus.deprecated ? 'disabled' : null} 
                      onClick={this.onChooseVersion.bind(this, version)}>
                      <Tag color="blue">{version.name}</Tag>
                    </a>
                  </TimelineItem>
                )
              } else {
                return (
                  <TimelineItem key={version.id} color={version.status === VersionStatus.deprecated ? 'gray' : 'blue'}>
                    <a className={version.status === VersionStatus.deprecated ? 'disabled' : null} onClick={this.onChooseVersion.bind(this, version)}>{version.name}</a>
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