import * as React from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd'
import { FormProps } from '../../types/antd'
import './login.less'
import ajax from '../../utils/ajax'
import apis from '../../store/api'
interface LoginProps {
  form: FormProps
}
class NormalLoginForm extends React.Component<LoginProps, any> {
  constructor (props: LoginProps) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit(e: React.FormEvent) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      ajax({
        url: apis.user.login,
        method: 'POST',
        data: {
          username: values.username,
          password: values.password
        }
      }).then(res => {
        console.log('login result:', res)
      }).catch(err => {
        message.error('用户名或密码错误')
        console.error('登录失败', err)
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.onSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm)

export default WrappedNormalLoginForm