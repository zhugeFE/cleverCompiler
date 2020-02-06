import * as React from 'react'
import './timeLine.less'
import { Timeline, Tag, Icon, Button } from 'antd'
import TimelineItem from 'antd/lib/timeline/TimelineItem'
import Search from 'antd/lib/input/Search'
import { Version } from '../../types/common.d';

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
        <Search
          className="version-search"
          size="small"
          placeholder="search version"
          onSearch={value => console.log(value)}
        />
        <Timeline mode="alternate">
          <TimelineItem dot={
            <a onClick={this.props.onAddVersion}><Icon type="plus"></Icon></a>
          }></TimelineItem>
          {
            this.props.versionList.map(version => {
              if (version === this.state.currentVersion) {
                return (
                  <TimelineItem key={version.id} color={version.disabled ? 'gray' : 'blue'}>
                    <a 
                      className={version.disabled ? 'disabled' : null} 
                      onClick={this.onChooseVersion.bind(this, version)}>
                      <Tag color="blue">{version.version}</Tag>
                    </a>
                  </TimelineItem>
                )
              } else {
                return (
                  <TimelineItem key={version.id} color={version.disabled ? 'gray' : 'blue'}>
                    <a className={version.disabled ? 'disabled' : null} onClick={this.onChooseVersion.bind(this, version)}>{version.version}</a>
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