import * as React from 'react'
import './timeLine.less'
import { Timeline, Tag } from 'antd'
import TimelineItem from 'antd/lib/timeline/TimelineItem'

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
        <Timeline mode="alternate">
          <TimelineItem><Tag color="#2db7f5">1.0.0</Tag></TimelineItem>
          <TimelineItem>1.1.0</TimelineItem>
          <TimelineItem>1.1.1</TimelineItem>
          <TimelineItem>1.2.0</TimelineItem>
        </Timeline>
      </div>
    )
  }
}
export default TimeLinePanel