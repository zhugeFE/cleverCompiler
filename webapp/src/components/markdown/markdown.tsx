/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-07 11:08:56
 */
import * as React from 'react'
import * as ReactMarkdown from 'react-markdown'
import { Input } from 'antd'
import './markdown.less'
import { EditOutlined, FileMarkdownOutlined, FullscreenOutlined } from '@ant-design/icons'

interface Props {
  content: string;
  DisabledEdit?: boolean;
  key: string;
  onChange?: (content: string) => void;
}
enum Mode {
  preview = 'preview',
  edit = 'edit'
}
interface State {
  mode: Mode
}
class Markdown extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      mode: Mode.preview
    }
    this.onChange = this.onChange.bind(this)
  }
  componentDidUpdate(pre: Props) {
    if (pre.key != this.props.key) {
      this.setState({
        mode: Mode.preview
      })
    }
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
              defaultValue={this.props.content} onChange={this.onChange} />
          )
        } else {
          return (
            <div className="markdown-preview">
              <ReactMarkdown children={this.props.content} />
            </div>
          )
        }
      })()}
      </div>
    )
  }
}
export default Markdown