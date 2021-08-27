/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-26 16:06:04
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-26 16:59:30
 */
import { Form, Input, Modal } from "antd"
import TextArea from "antd/lib/input/TextArea"
import { connect } from "dva"
import React from "react"
import { Dispatch } from "umi"
import { Customer } from "@/models/customer"
import util from "@/utils/utils"

interface Props {
  customerInfo: Customer | null;
  onCancel(): void;
  dispatch: Dispatch
}

interface FormData {
  name: string;
  description: string;
}

interface States {
  form: FormData;
}

class UpdateCustomer extends React.Component <Props, States> {
  constructor(prop: Props) {
    super(prop)
    this.state = {  
      form: {
        name: prop.customerInfo!.name ,
        description: prop.customerInfo!.description
      }
    }
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
  }

  handleOk () {
    const { customerInfo } = this.props
    const data: Customer = {
      id: customerInfo!.id,
      name: customerInfo!.name,
      description: this.state.form.description,
      projectId: customerInfo!.projectId,
      creatorId: customerInfo!.creatorId
    }

    this.props.dispatch({
      type: "customer/updateCustomer",
      payload: data,
      callback: () => {
        this.props.onCancel()
      }
    })
  }

  handleCancel () {
    this.props.onCancel()
  }

  onChangeForm (chanedValue: any, values: FormData) {
    this.setState({
      form: values
    })
  }


  render () {
    return (
      <div>
        <Modal
          title="修改配置"
          centered
          visible={true} 
          okText="修改"
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
            >
              <Input disabled/>
            </Form.Item>
            
            <Form.Item
              label="描述"
              name="description"
            >
              <TextArea rows={4}/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}


export default connect()(UpdateCustomer)