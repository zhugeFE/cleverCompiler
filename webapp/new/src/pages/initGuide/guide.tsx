import * as React from 'react'
import {Form, Button, Input} from 'antd'
import styles from './guide.less'
import { FormInstance, Rule } from 'antd/lib/form'
import { connect, IRouteComponentProps, withRouter } from 'umi';
interface Props extends IRouteComponentProps{
}
interface State {

}
class InitForm extends React.Component<Props, State>{
  formRef: React.RefObject<FormInstance>

  constructor (props: Props) {
    super(props)
    this.state = {}
    this.formRef = React.createRef<FormInstance>()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (values: FormData) {
    // ajax({
    //   url: api.sys.init,
    //   method: 'POST',
    //   data: {
    //     gitHost: values.host,
    //     gitToken: values.token,
    //     gitSsh: values.sshToken,
    //     gitAccount: values.account,
    //     email: values.email,
    //     password: values.password
    //   }
    // }).then(() => {
    //   history.replace('/login')
    // }).catch(err => {
    //   console.log('fjdi')
    //   message.error(err.message)
    // })
  }
  render () {
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 }
      },
      wrapperCol: {
        sm: { span: 18 }
      }
    }
    return (
      <div className="init-guide">
        <Form ref={this.formRef} {...formItemLayout} onFinish={this.onSubmit}>
          <div className="form-line">
          git绑定信息
          </div>
          <Form.Item label="git host" name="host" rules={[{required: true, message: '请输入git库host'}]}>
            <Input placeholder="http://gl.zhugeio.com"/>
          </Form.Item>
          <Form.Item label="git token" name="token" rules={[{ required: true, message: '请输入private token' }]}>
            <Input placeholder="token"/>
          </Form.Item>
          <Form.Item label="ssh token" name="sshToken" rules={[{required: true, message: '请输入ssh token'}]}>
            <Input.TextArea rows={4}></Input.TextArea>
          </Form.Item>
          <Form.Item label="git account" name="account" rules={[{ required: true, message: '请输入git账户名' }]}>
            <Input placeholder="account"/>
          </Form.Item>
          <div className="form-line">
          管理员信息
          </div>
          <Form.Item label="管理员邮箱" name="email" rules={[{required: true, message: '请输入管理员邮箱'}]}>
            <Input placeholder="邮箱"/>
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{required: true, message: '请输入管理员密码!'}]}>
            <Input placeholder="密码" type="password"/>
          </Form.Item>
          <Form.Item label="确认密码" name="rePassword" rules={[{
            required: true, 
            message: '请确认管理员密码!',
            validator: (rule: Rule, value: any) => {
              if (value !== this.formRef.current!.getFieldValue('password')) {
                return Promise.reject('确认密码与密码不一致')
              } else {
                return Promise.resolve()
              }
            }
          }]}>
            <Input placeholder="确认密码" type="password"/>
          </Form.Item>
          <Button type="primary" htmlType="submit" className="btn-submit">
            保存
          </Button>
        </Form>
      </div>
    )
  }
}

export default connect()(withRouter(InitForm))