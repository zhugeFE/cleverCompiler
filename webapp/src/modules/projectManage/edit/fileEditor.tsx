import * as React from 'react';
import './styles/fileEditor.less'

interface Props {
  content: string;
  reg: RegExp;
}
interface State {}
class GitFileEditor extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {}
  }
  render () {
    if (!this.props.content || !this.props.reg) {
      return <div className="git-file-editor">{this.props.content}</div>
    }
    const content = this.props.content
    const reg = this.props.reg
    const matchs = content.match(reg)
    const splitStr = `<<<<You must not guess it's me>>>>`
    const chunks = content.replace(reg, splitStr).split(splitStr)
    return (
      <div className="git-file-editor">
        {chunks.map((item, i) => {
          return (
            <span key={item + i}>{item}{
              matchs && matchs[i] ? <span className="editor-match">{matchs[i]}</span> : null
            }</span>
          )
        })}
        {reg.source !== '(?:)' ? <div className="editor-find-bar">match( {matchs ? matchs.length : 0} )</div> : null}
      </div>
    )
  }
}

export default GitFileEditor