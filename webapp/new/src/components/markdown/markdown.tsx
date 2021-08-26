/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-24 10:21:52
 */
import * as React from 'react'
import * as ReactMarkdown from 'react-markdown'
import { Input } from 'antd'
import './markdown.less'
import { EditOutlined, FileMarkdownOutlined, FullscreenOutlined } from '@ant-design/icons'

interface Props {
  content: string;
  DisabledEdit?: boolean;
  onChange ?(content: string): void;
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
      content: this.props.content || '# empty content',
      mode: Mode.preview
    }
    this.onChange = this.onChange.bind(this)
  }
  static getDerivedStateFromProps (props: Props, state: State) {
    if (props.content !== state.content) {
      return {
        content: props.content
      }
    }
    return null
  }
  onTogleMode () {
    if( this.props.DisabledEdit ) {
      return
    }
    this.setState({
      mode: this.state.mode === Mode.preview ? Mode.edit : Mode.preview
    })
  }
  onChange (e: {target: {value: string}}) {
    this.setState({
      content: e.target.value
    })
    if (this.props.onChange) {
      this.props.onChange(e.target.value)
    }
  }
  render () {
    return (
      <div className="markdown">
      <span className="markdown-handles">
        {
          !this.props.DisabledEdit && this.state.mode === Mode.preview ? (
            <EditOutlined onClick={this.onTogleMode.bind(this)}/>
          ) : (
            <FileMarkdownOutlined onClick={this.onTogleMode.bind(this)}/>
          )
        }
        <FullscreenOutlined/>
      </span>
      {(() => {
        if (this.state.mode === Mode.edit) {
          return (
            <Input.TextArea 
              className="markdown-editor" 
              autoSize={{maxRows: 30, minRows: 10}}
              value={this.state.content} onChange={this.onChange}></Input.TextArea>
          )
        } else {
          return (
            <div className="markdown-preview">
              <ReactMarkdown children={this.state.content}></ReactMarkdown>
            </div>
          )
        }
      })()}
      </div>
    )
  }
}
export default Markdown