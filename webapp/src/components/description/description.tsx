import * as React from 'react'
import './description.less'
interface Props {
  label: string,
  display?: string
}
class Description extends React.Component<Props> {
  constructor (props: Props) {
    super(props)
  }
  render () {
    return (
      <span className="description" style={{display: this.props.display || 'inline'}}>
        <label>{this.props.label}:</label><span>{this.props.children}</span>
      </span>
    )
  }
}
export default Description