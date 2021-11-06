import * as React from 'react'
import './styles/commands.less'
import { Input, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { VersionStatus } from '@/models/common'

interface Props {
  tags: string[];
  mode: number;
  onChange ?(tags: string[]): void;
}
interface State {
  tags: string[];
  inputVisible: boolean;
  value: string;
}
class Commands extends React.Component<Props, State> {
  inputRef: React.RefObject<Input>
  constructor (props: Props) {
    super(props)
    this.state = {
      tags: this.props.tags,
      inputVisible: false,
      value: ''
    }
    this.inputRef = React.createRef()
    this.onEnterTag = this.onEnterTag.bind(this)
    this.onShowInput = this.onShowInput.bind(this)
    this.onInput = this.onInput.bind(this)
    this.onBlurInput = this.onBlurInput.bind(this)
  }
  static getDerivedStateFromProps(props:Props, state: State) {
    if (props.tags !== state.tags) {
      return {
        tags: props.tags
      }
    }
    return null
  }
  onEnterTag () {
    this.setState({
      value: this.state.value.trim()
    })
    let tags = this.state.tags
    if (this.state.value) {
      tags = (this.state.tags || []).concat([this.state.value])
    }
    this.setState({
      tags,
      value: ''
    })
    if (this.props.onChange) {
      this.props.onChange(tags)
    }
  }
  onBlurInput () {
    this.setState({
      inputVisible: false
    })
  }
  onInput (e: { target: { value: string } }) {
    this.setState({
      value: e.target.value
    })
  }
  onShowInput () {
    if (this.props.mode !== VersionStatus.normal) return
    this.setState({
      inputVisible: true
    }, () => {
      this.inputRef.current?.focus()
    })
  }
  onDel (i: number) {
    let tags = this.state.tags
    tags.splice(i, 1)
    this.setState({
      tags
    })
    if (this.props.onChange) {
      this.props.onChange(tags)
    }
  }
  render () {
    return (
      <div className="commands">
        {
          this.state.tags?.map((tag, i) => {
            return (
              <Tag key={`${tag}_${i}`} color="blue" closable onClose={this.onDel.bind(this, i)}>{tag}</Tag>
            )
          })
        }
        {(() => {
          if (this.state.inputVisible) {
            return (
              <Input 
                ref={this.inputRef}
                type="text" 
                size="small" 
                value={this.state.value} 
                onBlur={this.onEnterTag}
                onChange={this.onInput}
                onBlurCapture={this.onBlurInput}
                onPressEnter={this.onEnterTag}></Input>
            )
          } else {
            return (
              this.props.mode === VersionStatus.normal &&
              <Tag onClick={this.onShowInput} 
                style={{ background: '#fff', borderStyle: 'dashed' }}>
                <PlusOutlined /> New Tag
              </Tag>
            )
          }
        })()}
      </div>
    )
  }
}
export default Commands