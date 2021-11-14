import {
  LockOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Form, Input, FormInstance, Button } from 'antd';
import React, { createRef, RefObject } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';

import styles from './index.less';

export type LoginProps = {
  dispatch: Dispatch;
  submitting?: boolean;
};
interface FormData {
  username: string;
  password: string;
}
interface State {
  form: FormData;
}

class Login extends React.Component<LoginProps, State> {
  formRef: RefObject<FormInstance>

  constructor(props: LoginProps) {
    super(props)

    this.formRef = createRef<FormInstance>()
    this.state = {
      form: {
        username: '',
        password: ''
      }
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(data: FormData) {
    this.props.dispatch({
      type: 'user/login',
      payload: data
    })
  }

  render () {
    return (
      <Form 
        className={styles.loginForm}
        labelCol={{ span: 0 }} 
        wrapperCol={{ span: 24 }} 
        onFinish={this.onSubmit} 
        size="large" ref={this.formRef}>
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
            autoFocus
            placeholder="Username"/>
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
            type="password"
            placeholder="Password"/>
        </Form.Item>
        <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
            Log in
          </Button>
          Or <a href="">register now!</a>
      </Form>
    )
  }
}

export default connect()(Login);
