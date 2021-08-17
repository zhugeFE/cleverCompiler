/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-11 20:16:18
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-11 22:01:03
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-10 18:48:36
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-11 16:50:20
 */
import { Form, Input, Modal } from "antd"
import React from "react"
import { Dispatch,  } from '@/.umi/core/umiExports'
import { connect } from 'dva'
import util from "@/utils/utils"
import { AddComConfigParams, ComConfig } from "@/models/template"

interface FormData {
  name: string;
  desc: string;
  value: string;
}

interface Props {
  templateId:string;
  templateVersionId: string;
  onCancel():void;
  afterAdd(config:ComConfig): void; 
  dispatch: Dispatch
}

interface States {
  form: FormData;
}

class AddTemplateGlobalConfig extends React.Component<Props , States> {
  constructor (props: Props){
    super(props)
    this.state = {
      form: {
        name:"",
        desc:"",
        value: ""
      },
    }
    this.onCancel = this.onCancel.bind(this)
    this.onCommit = this.onCommit.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
  }


  onCancel () {
    if(this.props.onCancel)this.props.onCancel()
  }

  onCommit () {
    const data: AddComConfigParams = {
      name: this.state.form.name,
      desc: this.state.form.desc,
      defaultValue: this.state.form.value,
      templateId: this.props.templateId,
      templateVersionId: this.props.templateVersionId
    }
    this.props.dispatch({
      type:"template/addComConfig",
      payload:data,
      callback:(config: ComConfig)=>{
        if(this.props.afterAdd){this.props.afterAdd(config)}
      }
    })
  }

  onChangeForm (chanedValue: any, values: FormData) {
    const form = util.clone(values)
    this.setState({
      form
    })
  }


  render () {
    return (
      <Modal
        title="添加全局配置"
        closable={false}
        visible={true}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={this.state.form}
          layout="horizontal"
          onValuesChange={this.onChangeForm} 
        >
          <Form.Item label="名称" name="name">
            <Input></Input>
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input></Input>
          </Form.Item>
          <Form.Item label="默认值" name="value">
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default connect()(AddTemplateGlobalConfig)