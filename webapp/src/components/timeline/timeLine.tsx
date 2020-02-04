import * as React from 'react'
import './timeLine.less'

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
      <div className="time-line-panel">time line panel</div>
    )
  }
}
export default TimeLinePanel