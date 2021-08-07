/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-05 09:58:53
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-06 19:04:20
 */
import * as React from "react";
import { Modal, Form, Input, message} from 'antd';
import { TemplateCreateParam, Template } from "@/models/template";
import { connect } from 'dva';
import { Dispatch } from '@/.umi/plugin-dva/connect';

interface FormData {
  name: string;
  description: string;
}

interface Props {
  showAddModal : boolean;
  dispatch:Dispatch;
  onCommit? (): void;
  onCancel? (): void;
}

interface States {
  show: boolean;
  form: FormData;
}

class CreateTemplate extends React.Component<Props ,States> {
  constructor (props : Props){
    super(props)
    this.state = {
      form: {
        name: "",
        description: "",
      }
    } as States
    this.onCommit = this.onCommit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
  }

  onCommit () {
    const {name , description } = this.state.form
    if (!name) {
      message.error("名称未填写！",1)
    }
    const data:TemplateCreateParam = {
      name,
      description
    }
    
    this.props.dispatch({
      type: 'template/createTemplate',
      payload: data,
      callback: (template:Template) => {
        if (this.props.onCommit) this.props.onCommit()
      }
    })
  }

  onCancel () {
    if (this.props.onCancel) this.props.onCancel()
  }

  onChangeForm (changeValue: any , values: FormData) {
    this.setState({
      form: values
    })
  }

  render () {
    const show = this.props.showAddModal
    return (
      <Modal 
        title="新建模板" 
        visible={show}  
        okText="保存"
        cancelText="取消"
        onOk={this.onCommit} 
        onCancel={this.onCancel}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          initialValues={this.state.form}
          layout="horizontal"
          onValuesChange={this.onChangeForm}
        >
          <Form.Item
            className="item"
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入模板名称!' }]}
          >
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item
            className="item"
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入模板描述!' }]}
          >
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
export default connect()(CreateTemplate)