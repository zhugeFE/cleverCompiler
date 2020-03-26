import * as React from 'react'
import {Form, Button, Input, Checkbox, message} from 'antd'
import './guide.less'
import history from '../../utils/history'
import { FormProps } from '../../types/antd'
import { WrappedFormUtils, ValidationRule } from 'antd/lib/form/Form'
import ajax from '../../utils/ajax'
import api from '../../store/api'
interface Props {
  form: WrappedFormUtils<{
    host: string,
    token: string,
    sshToken: string,
    account: string,
    email: string,
    password: string,
    rePassword: string
  }>
}
class InitForm extends React.Component<Props, any>{
  constructor (props: Props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }
  state: {
    form: null
  }
  onSubmit (e: React.FormEvent) {
    e.preventDefault()
    this.props.form.validateFields((err, props) => {
      if (err) {
        console.error('校验失败', err)
      } else {
        ajax({
          url: api.sys.init,
          method: 'POST',
          data: {
            gitHost: props.host,
            gitToken: props.token,
            gitSsh: props.sshToken,
            gitAccount: props.account,
            email: props.email,
            password: props.password
          }
        }).then(() => {
          history.replace('/login')
        }).catch(err => {
          message.error(err.message)
        })
      }
    })
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
          <Form.Item label="git host">
            {getFieldDecorator('host', {
              rules: [{required: true, message: '请输入git库host'}]
            })(
              <Input placeholder="http://gl.zhugeio.com"/>
            )}
          </Form.Item>
          <Form.Item label="git token">
            {getFieldDecorator('token', {
              rules: [{ required: true, message: '请输入private token' }],
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
              rules: [{
                required: true, 
                message: '请确认管理员密码!',
                validator: (rule: ValidationRule, value: any, callback: any) => {
                  if (!value) {
                    callback(rule)
                  } else if (value !== this.props.form.getFieldValue('password')) {
                    rule.message = '确认密码与密码不一致'
                    callback(rule)
                  } else {
                    callback()
                  }
                }
              }]
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

export default Form.create()(InitForm)