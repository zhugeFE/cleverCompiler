import * as React from 'react'
import { Modal, Form, Input, Radio } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import * as _ from 'lodash';

interface FormData {
  source: string;
  version: string;
  value: string;
}
interface Props {
  form: WrappedFormUtils<FormData>
}
interface States {
  show: boolean;
  form: FormData
}

class CreateVersion extends React.Component<Props, States> {
  constructor (props: Props) {
    super(props)
    this.state = {
      show: true,
      form: {
        version: '',
        source: 'branch',
        value: ''
      }
    }
    this.onCommit = this.onCommit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
  }
  componentDidMount () {
    this.props.form.setFieldsValue(this.state.form)
  }
  onChangeForm () {
    const form = this.props.form.getFieldsValue() as FormData
    this.setState({
      form
    })
  }
  onCommit () {
    console.log('保存')
  }
  onCancel () {
    console.log('取消')
    this.setState({
      show: false
    })
  }
  render () {
    let { getFieldDecorator } = this.props.form
    return (
      <Modal
        title="添加版本"
        closable={false}
        visible={this.state.show}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}>
        <Form 
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }} 
          layout="horizontal"
          onChange={this.onChangeForm}>
          <Form.Item label="版本号">
          {
            getFieldDecorator('version')(
              <Input addonBefore="v" placeholder="x.x.x"/>
            )
          }
          </Form.Item>
          <Form.Item label="来源">
          {
            getFieldDecorator('source')(
              <Radio.Group>
                <Radio.Button value="branch">branch</Radio.Button>
                <Radio.Button value="tag">tag</Radio.Button>
                <Radio.Button value="commit">commit</Radio.Button>
              </Radio.Group>
            )
          }
          </Form.Item>
          {
            this.state.form.source ? (
              <Form.Item label={this.state.form.source}>
              {
                getFieldDecorator('value')(
                  (() => {
                    switch (this.state.form.source) {
                      case 'branch':
                        return (
                          <Input placeholder="branch"/>
                        )
                      case 'tag':
                        return (
                          <Input placeholder="tag"/>
                        )
                      case 'commit':
                        return (
                          <Input placeholder="commit"/>
                        )
                    }
                  })()
                )
              }
              </Form.Item>
            ) : ''
          }
        </Form>
      </Modal>
    )
  }
}
export default Form.create()(CreateVersion)