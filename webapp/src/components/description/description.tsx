import * as React from 'react'
import './description.less'
interface Props {
  label: string,
  labelWidth?: number,
  display?: string,
  className?: string
}
class Description extends React.Component<Props> {
  constructor (props: Props) {
    super(props)
  }
  render () {
    const className = `description ${this.props.className || ''}`
    return (
      <span className={className} style={{display: this.props.display || 'inline'}}>
        <label style={{width: this.props.labelWidth || 'auto'}}>{this.props.label}:</label><span>{this.props.children}</span>
      </span>
    )
  }
}
export default Description