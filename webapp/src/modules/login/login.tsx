import * as React from 'react'
import { Form, Input, Button, Checkbox, message, Layout } from 'antd';
import './login.less'
import ajax from '../../utils/ajax'
import apis from '../../store/api'
import { userActions } from '../../store/actionTypes';
import { Dispatch } from 'redux';
import { connect } from 'react-redux'
import history from '../../utils/history'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form';
interface LoginProps {
  login (param: any): void
}
interface FormData {
  username: string;
  password: string;
}
class NormalLoginForm extends React.Component<LoginProps, any> {
  formRef: React.RefObject<FormInstance>;
  constructor (props: LoginProps) {
    super(props)
    this.formRef = React.createRef()
    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit(data: FormData) {
    this.props.login(data)
  }

  render() {
    return (
      <Form 
        className="login-form" 
        labelCol={{ span: 0 }} 
        wrapperCol={{ span: 24 }} 
        onFinish={this.onSubmit} 
        size="large" ref={this.formRef}>
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
            placeholder="Username"/>
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
            type="password"
            placeholder="Password"/>
        </Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
      </Form>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (data: FormData) => {
      ajax({
        url: apis.user.login,
        method: 'POST',
        data
      }).then(res => {
        dispatch({
          type: userActions.UPDATE_CURRENT,
          value: res.data
        })
        history.replace('/')
      }).catch(err => {
        message.error('用户名或密码错误')
        console.error('登录失败', err)
      })
    }
  }
}
export default connect(
  null,
  mapDispatchToProps
)(NormalLoginForm)