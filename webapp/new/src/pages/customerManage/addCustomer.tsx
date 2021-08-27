/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-26 14:39:28
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-26 16:19:54
 */
import { Form, Input, message, Modal } from "antd"
import TextArea from "antd/lib/input/TextArea"
import React from "react"
import { connect, Dispatch } from "umi"


interface Props {
  dispatch: Dispatch;
  onCancel(): void;
  afterAdd(): void;
}

interface FormData {
  name: string;
  description: string;
}

interface States {
  form: FormData
}

class AddCustomer extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      form: {
        name: "",
        description: ""
      }
    }
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
  }

  handleOk () {
    const { name , description } = this.state.form
    if ( !name || !description ) {
      message.warn({
        content: "信息未填写完整！",
        duration: 1
      })
      return
    }
    
    this.props.dispatch({
      type: "customer/addCustomer",
      payload: {
        name,
        description
      },
      callback: ()=>{
        this.props.afterAdd()
      }
    })
  }

  handleCancel () {
    this.props.onCancel()
    console.log("取消")
  }

  //表单修改
  onChangeForm (chanedValue: any, values: FormData) {
    this.setState({
      form: values
    })
  }

  render () {
    return (
      <div>
        <Modal 
          title="新建客户" 
          centered
          visible={true} 
          okText="添加"
          cancelText="取消"
          onOk={this.handleOk} 
          onCancel={this.handleCancel}>
            <Form 
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }} 
              initialValues={this.state.form}
              layout="horizontal"
              onValuesChange={this.onChangeForm}>
              <Form.Item 
                label="名称"
                name="name"
                rules={[{ required: true, message: '请输入客户名称!' }]}> 
                <Input/> 
              </Form.Item>
              <Form.Item 
                label="描述" 
                name="description"
                rules={[{ required: true, message: '请输入客户信息描述!' }]}> 
                <TextArea rows={4}/> 
              </Form.Item>
            </Form>
        </Modal>
      </div>
    )
  }
}

export default connect()(AddCustomer)