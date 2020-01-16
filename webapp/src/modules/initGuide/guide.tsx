import * as React from 'react'
import {Form, Button, Input, Checkbox} from 'antd'
import './guide.less'
import history from '../../utils/history'
interface ValidateCallback {
  (err: Error, values: any): void
}
interface FormProps {
  form: {
    getFieldDecorator: Function,
    validateFields (callback: ValidateCallback): void
  }
}
class InitForm extends React.Component<FormProps, any>{
  constructor (props: FormProps) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }
  state: {
    form: {
      token: '',
      account: '',
      userName: ''
    }
  }
  onSubmit (e: React.FormEvent) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      console.log('>>>>>', err, values)
    })
    history.replace('/')
  }
  render () {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 18 },
      }
    }
    return (
      <div className="init-guide">
        <Form {...formItemLayout} onSubmit={this.onSubmit}>
          <div className="form-line">
          git绑定信息
          </div>
          <Form.Item label="git token">
            {getFieldDecorator('token', {
              rules: [{ required: true, message: '请输入git token' }],
            })(
              <Input placeholder="token"/>,
            )}
          </Form.Item>
          <Form.Item label="ssh token">
            {getFieldDecorator('sshToken', {
              rules: [{required: true, message: '请输入ssh token'}]
            })(
              <Input.TextArea rows={4}></Input.TextArea>
            )}
          </Form.Item>
          <Form.Item label="git account">
            {getFieldDecorator('account', {
              rules: [{ required: true, message: '请输入git账户名' }],
            })(
              <Input placeholder="account"/>,
            )}
          </Form.Item>
          <div className="form-line">
          管理员信息
          </div>
          <Form.Item label="管理员邮箱">
            {getFieldDecorator('email', {
              rules: [{required: true, message: '请输入管理员邮箱'}]
            })(
              <Input placeholder="邮箱"/>
            )}
          </Form.Item>
          <Form.Item label="密码">
            {getFieldDecorator('password', {
              rules: [{required: true, message: '请输入管理员密码!'}]
            })(
              <Input placeholder="密码" type="password"/>
            )}
          </Form.Item>
          <Form.Item label="确认密码">
            {getFieldDecorator('rePassword', {
              rules: [{required: true, message: '请确认管理员密码!'}]
            })(
              <Input placeholder="确认密码" type="password"/>
            )}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="btn-submit">
            保存
          </Button>
        </Form>
      </div>
    )
  }
}
const GuidForm = Form.create()(InitForm)
class InitGuide extends React.Component {
  render () {
    return (
      <GuidForm></GuidForm>
    )
  }
}

export default InitGuide