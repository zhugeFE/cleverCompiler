import * as React from 'react'
import './styles/commands.less'
import { Input, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { VersionStatus } from '@/models/common'
import util from '@/utils/utils'
import { ConnectState } from '@/models/connect'
import { connect, Dispatch } from 'umi'

interface Props {
  dispatch: Dispatch;
  tags: string[];
  mode: number;
  closeEnable: boolean;
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
  onEnterTag () {
    const value = this.state.value.trim()
    let tags = util.clone(this.state.tags)
    if (value) {
      tags = (tags || []).concat([value])
    }
    this.setState({
      tags,
      value: ''
    }, () => {
      this.onChange()
    })
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
    let tags = util.clone(this.state.tags)
    tags.splice(i, 1)
    this.setState({
      tags
    }, () => {
      this.onChange()
    })
  }
  onChange () {
    this.props.dispatch({
      type: 'git/updateVersion',
      payload: {
        compileOrders: JSON.stringify(this.state.tags)
      }
    })
  }
  render () {
    return (
      <div className="commands">
        {
          this.state.tags?.map((tag, i) => {
            return (
              <Tag key={`${tag}_${i}`} 
                color="blue" 
                closable={this.props.closeEnable} 
                onClose={this.onDel.bind(this, i)}>{tag}</Tag>
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
export default connect(({git}: ConnectState) => {
  const {currentVersion} = git
  return {
    tags: currentVersion!.compileOrders,
    mode: currentVersion!.status,
    closeEnable: currentVersion?.status === VersionStatus.normal
  }
})(Commands)