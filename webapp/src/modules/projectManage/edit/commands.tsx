import * as React from 'react'
import './commands.less'
import { Input, Tag, Icon } from 'antd'

interface Props {
  tags: string[]
}
interface State {
  tags: string[],
  inputVisible: boolean,
  value: string
}
class Commands extends React.Component<Props, State> {
  private inputRef: Input
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      tags: this.props.tags,
      inputVisible: false,
      value: ''
    }
    this.onEnterTag = this.onEnterTag.bind(this)
    this.onShowInput = this.onShowInput.bind(this)
    this.onInput = this.onInput.bind(this)
  }
  onEnterTag () {
    this.setState({
      value: this.state.value.trim()
    })
    let tags = this.state.tags
    if (this.state.value) {
      tags = this.state.tags.concat([this.state.value])
    }
    this.setState({
      tags,
      value: '',
      inputVisible: false
    })
  }
  onInput (e: { target: { value: string } }) {
    this.setState({
      value: e.target.value
    })
  }
  onShowInput () {
    this.setState({
      inputVisible: true
    }, () => {
      this.inputRef.focus()
    })
  }
  onDel (i: number) {
    let tags = this.state.tags
    tags.splice(i, 1)
    this.setState({
      tags
    })
  }
  saveInputRef = (input: Input) => {
    this.inputRef = input
  }
  render () {
    return (
      <div className="commands">
        {
          this.state.tags.map((tag, i) => {
            return (
              <Tag key={`${tag}_${i}`} color="blue" closable onClose={this.onDel.bind(this, i)}>{tag}</Tag>
            )
          })
        }
        {(() => {
          if (this.state.inputVisible) {
            return (
              <Input 
                ref={this.saveInputRef}
                type="text" 
                size="small" 
                value={this.state.value} 
                onBlur={this.onEnterTag}
                onChange={this.onInput}
                onPressEnter={this.onEnterTag}></Input>
            )
          } else {
            return (
              <Tag onClick={this.onShowInput} 
                style={{ background: '#fff', borderStyle: 'dashed' }}>
                <Icon type="plus" /> New Tag
              </Tag>
            )
          }
        })()}
      </div>
    )
  }
}
export default Commands