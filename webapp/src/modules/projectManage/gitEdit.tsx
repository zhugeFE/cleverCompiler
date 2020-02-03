import * as React from 'react'

interface Props {

}
interface State {

}
class GitEditPanel extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
  }
  render () {
    return (
      <div className="git-edit-panel">
        git edit panel
      </div>
    )
  }
}
export default GitEditPanel