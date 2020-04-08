import * as React from 'react';
import './styles/fileEditor.less'

interface Props {
  content: string;
}
interface State {}
class GitFileEditor extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <div className="git-file-editor">{this.props.content}</div>
    )
  }
}

export default GitFileEditor