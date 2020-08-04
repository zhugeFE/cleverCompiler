import * as React from "react";
import { Modal, Input } from "antd";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";

interface Prop {}
interface FormData {
  name: string;
  desc: string;
}
interface State {
  form: FormData;
}
class CreateTemplate extends React.Component<Prop, State> {
  constructor (props: Prop, state: State) {
    super(props, state)
    this.state = {
      form: {
        name: '',
        desc: ''
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

  }
  render () {
    return (
      <Modal 
        title="新建模板"
        visible={true}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }} 
          layout="horizontal"
          onValuesChange={this.onChangeForm}>
          <FormItem label="名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="模板名称，如「私有部署标准版」"></Input>
          </FormItem>
          <FormItem label="简介" name="desc">
            <TextArea rows={5}></TextArea>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default CreateTemplate