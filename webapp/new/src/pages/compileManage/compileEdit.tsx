/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:55:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-30 13:46:14
 */
import { Button, Form, Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'

interface Props {

}
interface States {

}

class CompileEdit extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
  }
  render() {
    return (
      <div>  
        <Form
          labelCol={{span:4}}
          wrapperCol={{span:16}}
        >
          <Form.Item 
            label="配置名称"
          >
            <Input></Input>
          </Form.Item>

          <Form.Item 
            label="发布方式"
          ></Form.Item>

          <Form.Item label="要编译的项目">

          </Form.Item>

          <Form.Item label="描述">
            <TextArea rows={6}></TextArea>
          </Form.Item>
        </Form>
        <Button type="primary">编译</Button>
        
      </div>
    )
  }
}


export default CompileEdit