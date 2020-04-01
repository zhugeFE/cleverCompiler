import * as React from 'react'
import './timeLine.less'
import { Timeline, Tag, Button, Input } from 'antd'
import TimelineItem from 'antd/lib/timeline/TimelineItem'
import { PlusOutlined } from '@ant-design/icons'
import { Version, VersionStatus } from '../../store/state/common';

interface Props {
  onAddVersion: () => void,
  versionList: Version[],
  onChange?: (version: Version) => void
}
interface State {
  currentVersion: Version
}
class TimeLinePanel extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      currentVersion: this.props.versionList[0]
    }
  }
  onChooseVersion (version: Version) {
    this.setState({
      currentVersion: version
    })
    if (this.props.onChange) this.props.onChange(version)
  }
  render () {
    return (
      <div className="time-line-panel">
        <Input.Search
          className="version-search"
          size="small"
          placeholder="x.x.x"/>
        <Timeline mode="alternate">
          <TimelineItem dot={
            <a onClick={this.props.onAddVersion}><PlusOutlined/></a>
          }></TimelineItem>
          {
            this.props.versionList.map(version => {
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