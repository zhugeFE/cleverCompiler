/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-11 20:16:18
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-25 20:09:51
 */
import type { FormInstance} from 'antd';
import { Form, Input, Modal } from 'antd';
import React from 'react';
import type { Dispatch } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import type { TemplateGlobalConfig } from '@/models/template';
import TextArea from 'antd/lib/input/TextArea';

interface FormData {
  name: string;
  description: string;
  targetValue: string;
}

interface submitParams {
  targetValue: string;
}

interface Props {
  globalConfig: TemplateGlobalConfig;
  onSubmit: (data: submitParams) => void;
  onCancel: () => void;
  dispatch: Dispatch;
}

interface States {
  form: FormData;
}

class TextGlobalConfig extends React.Component<Props, States> {
  projectTextGlobalForm: React.RefObject<FormInstance> = React.createRef()
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        name: this.props.globalConfig.name,
        description: this.props.globalConfig.description,
        targetValue:this.props.globalConfig.targetValue,
      },
    };
    this.onCancel = this.onCancel.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onChangeForm = this.onChangeForm.bind(this);
  }

  onCancel() {
    if (this.props.onCancel) this.props.onCancel();
  }

  onCommit() {
    this.projectTextGlobalForm.current?.validateFields()
    .then((form) => {
      if (!this.props.onSubmit) return
      this.props.onSubmit({
        targetValue: form.targetValue,
      })
    })
    .catch((err) => {
      console.error('表单验证失败', err)
    })
  }

  onChangeForm(chanedValue: any, values: FormData) {
    this.setState({
      form: values
    });
  }


  render() {
    return (
      <Modal
        title= "修改配置"
        centered
        closable={false}
        visible={true}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}>
          <Form
            ref={this.projectTextGlobalForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={this.state.form}
            layout="horizontal"
            onValuesChange={this.onChangeForm}>
            <Form.Item 
              label="名称" 
              rules={[{ required: true, message: '请输入配置名称!' }]}
              name="name">
              <Input disabled />
            </Form.Item>
            <Form.Item 
              label="描述" 
              rules={[{ required: true, message: '请输入配置描述!' }]}
              name="description">
              <TextArea disabled rows={4} />
            </Form.Item>
            <Form.Item 
              label="默认值" 
              rules={[{ required: true, message: '请输入配置值!' }]}
              name="targetValue">
              <Input autoComplete="off" />
            </Form.Item>
          </Form>
      </Modal>
    );
  }
}

export default connect()(TextGlobalConfig);
