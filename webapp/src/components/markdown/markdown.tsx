import * as React from 'react'
import * as ReactMarkdown from 'react-markdown'
import { Input, Icon } from 'antd'
import './markdown.less'

interface Props {
  content: string
}
enum Mode {
  preview = 'preview',
  edit = 'edit'
}
interface State {
  content: string,
  mode: Mode
}
class Markdown extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      content: this.props.content,
      mode: Mode.edit
    }
  }
  onTogleMode () {
    this.setState({
      mode: this.state.mode === Mode.preview ? Mode.edit : Mode.preview
    })
  }
  render () {
    return (
      <div className="markdown">
      <span className="markdown-handles">
        <Icon type={this.state.mode === Mode.preview ? 'edit' : 'file-markdown'} 
          onClick={this.onTogleMode.bind(this)}/>
        <Icon type={'fullscreen'}></Icon>
      </span>
      {(() => {
        if (this.state.mode === Mode.edit) {
          return (
            <Input.TextArea 
              className="markdown-editor" 
              autoSize={{maxRows: 30, minRows: 10}}
              value={this.state.content}></Input.TextArea>
          )
        } else {
          return (
            <div className="markdown-preview">
              <ReactMarkdown source={this.state.content}></ReactMarkdown>
            </div>
          )
        }
      })()}
      </div>
    )
  }
}
export default Markdown