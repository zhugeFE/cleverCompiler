import * as React from 'react'
import './timeLine.less'
import { Timeline, Tag, Icon, Button } from 'antd'
import TimelineItem from 'antd/lib/timeline/TimelineItem'
import Search from 'antd/lib/input/Search'

interface Props {

}
interface State {

}
class TimeLinePanel extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
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
            <a><Icon type="plus"></Icon></a>
          }></TimelineItem>
          <TimelineItem><Tag color="#2db7f5">1.2.1</Tag></TimelineItem>
          <TimelineItem color="gray"><a className="disabled">1.1.0</a></TimelineItem>
          <TimelineItem><a>1.0.1</a></TimelineItem>
          <TimelineItem><a>1.0.0</a></TimelineItem>
        </Timeline>
      </div>
    )
  }
}
export default TimeLinePanel