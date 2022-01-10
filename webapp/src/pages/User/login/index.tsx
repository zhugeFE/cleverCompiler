import {
  LockOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { FormInstance} from 'antd';
import { Form, Input, Button } from 'antd';
import type { RefObject } from 'react';
import React, { createRef } from 'react';
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
  email?: string;
}
interface State {
  form: FormData;
  isLogin: boolean;
}

class Login extends React.Component<LoginProps, State> {
  formRef: RefObject<FormInstance>
  username = createRef()
  timer?: NodeJS.Timeout
  constructor(props: LoginProps) {
    super(props)

    this.formRef = createRef<FormInstance>()
    this.state = {
      form: {
        username: '',
        password: ''
      },
      isLogin: true
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.changeMode = this.changeMode.bind(this)
    this.login = this.login.bind(this)
    this.checkName = this.checkName.bind(this)
  }

  onSubmit(data: FormData) {
    if (data.email){
      this.props.dispatch({
        type: 'user/regist',
        payload: data,
        callback: () => {
        }
      })
    } else {
      this.login(data)
    }
  }

  checkName (name: string) {
    if( !name ) return
    if (this.timer) {
      clearTimeout(this.timer)
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    return new Promise( (resolve, reject) => {
      this.timer = setTimeout( ()=> {
        this.props.dispatch({
          type: 'user/checkName',
          payload: name,
          callback: (res) => {
            if (res.result) {            
              resolve("用户名可用")
            } else {
              reject({
                message: "用户名重复,请换一个"
              })
            }
          }
        })
      },500)
    })
    
    
  }
  login(data: FormData){
    this.props.dispatch({
      type: 'user/login',
      payload: data
    })
  }

  changeMode () {
    this.setState({
      isLogin: !this.state.isLogin
    })
  }

  render () {
    return (
      
      this.state.isLogin ? (
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
            Or <Button type='text' style={{color: "#1890ff"}} onClick={this.changeMode}>register now!</Button>
        </Form>
      ) : (
        <Form 
          className={styles.loginForm}
          labelCol={{ span: 0 }} 
          wrapperCol={{ span: 24 }} 
          onFinish={this.onSubmit} 
          size="large" ref={this.formRef}>
          <Form.Item               
            name="username" rules={[
              { required: true, message: 'Please input your username!' },
              {
                validateTrigger: ['onChange'],
                validator: async (_: any, value: string) => {
                  return this.checkName(value) 
                }
              }
            ]}>
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
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="email"
              placeholder="email"/>
          </Form.Item>
          <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
              register now
          </Button>
          Or <Button type='text' style={{color: "#1890ff"}}  onClick={this.changeMode}>login now!</Button>
        </Form>
      )
      
    )
  }
}

export default connect()(Login);
