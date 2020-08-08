import * as React from "react";
import { Modal, Input, message } from "antd";
import Form, { FormInstance } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import { Template } from "../../store/state/template";
import ajax from "../../utils/ajax";
import api from "../../store/api";

interface Prop {
  onCreate (temp: Template): void
}
interface FormData {
  name: string;
  description: string;
}
interface State {
  form: FormData;
}
class CreateTemplate extends React.Component<Prop, State> {
  formRef = React.createRef<FormInstance>()
  constructor (props: Prop, state: State) {
    super(props, state)
    this.state = {
      form: {
        name: '',
        description: ''
      }
    }
    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
  }
  onChangeForm (changedValus: any, values: FormData) {
    this.setState({
      form: values
    })
  }
  onCancel () {

  }
  onSubmit () {
    this.formRef.current.validateFields()
    const form = this.state.form
    if (form.description && form.name) {
      ajax({
        url: api.template.add,
        method: 'POST',
        data: form
      })
      .then((temp: Template) => {
        this.props.onCreate(temp)
      })
      .catch(err => {
        message.error({
          content: '创建模板失败'
        })
        console.error('创建模板失败', err)
      })
    }
  }
  render () {
    return (
      <Modal 
        title="新建模板"
        visible={true}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onSubmit}>
        <Form
          ref={this.formRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }} 
          layout="horizontal"
          onValuesChange={this.onChangeForm}>
          <FormItem label="名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="模板名称，如「私有部署标准版」"></Input>
          </FormItem>
          <FormItem label="简介" name="description" rules={[{ required: true, message: '请填写模板简介'}]}>
            <TextArea rows={5}></TextArea>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default CreateTemplate