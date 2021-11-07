/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-07 22:27:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-08 01:47:46
 */

import { Form, FormInstance, Input, Modal } from 'antd';
import React from 'react';
import { Dispatch } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import { TemplateConfig } from '@/models/template';
import TextArea from 'antd/lib/input/TextArea';
import { EditMode } from '@/models/common';

interface FormData {
  filePath: string;
  reg: string;
  global: boolean;
  ignoreCase: boolean;
  description: string;
  targetValue: string;
}

interface TextConfig {
  filePath: string;
  reg: string;
  description: string;
  targetValue: string;
}

interface Props {
  mode: EditMode;
  config: TemplateConfig;
  onSubmit (data: TextConfig): void;
  onCancel(): void;
  dispatch: Dispatch;
}

interface States {
  form: FormData;
  displayContent: string;
  fileContent: string;
  reg?: RegExp;
}

class UpdateTextConfig extends React.Component<Props, States> {
  updateTextConfigForm: React.RefObject<FormInstance> = React.createRef()
  constructor(props: Props) {
    super(props);
    this.state = {
      fileContent: '',
      form: {
        filePath: props.config.filePath,
        description: props.config.description,
        targetValue: props.config.targetValue,
        reg: JSON.parse(props.config.reg)['source'],
        global: JSON.parse(props.config.reg)['global'],
        ignoreCase: JSON.parse(props.config.reg)['ignoreCase']
      },
      displayContent: ''
    };
    this.onCancel = this.onCancel.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount () {
  }


  onCommit() {
    this.updateTextConfigForm.current?.validateFields()
    .then((form: FormData) => {
      if (!this.props.onSubmit) return
      const reg = this.state.reg
      this.props.onSubmit({
        filePath: form.filePath,
        reg: JSON.stringify({
          source: reg!.source,
          global: reg!.global,
          ignoreCase: reg!.ignoreCase
        }),
        description: form.description,
        targetValue: form.targetValue,
      })
    })
    .catch((err) => {
      console.error('表单验证失败', err)
    })
  }

  onChange (changedValues: FormData, formData: FormData) {
    let reg = null
    
    try {
      reg =  new RegExp(formData.reg || '', `${formData.global ? 'g' : ''}${formData.ignoreCase ? 'i' : ''}`)
      this.setState({
        form: formData,
        reg
      })
    }
    catch (e) {
      console.log(e)
    }
    this.onReset()
    
  }

  onReplace () {
    this.setState({
      displayContent: this.state.displayContent.replace(this.state.reg!, this.state.form.targetValue || '')
    })
  }
  onReset () {
    this.setState({
      displayContent: this.state.fileContent
    })
  }

  onCancel() {
    if (this.props.onCancel) this.props.onCancel();
  }

  render() {
    return (
      <Modal
        title="修改配置"
        centered
        closable={false}
        visible={true}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}>
          <Form
            ref={this.updateTextConfigForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={this.state.form}
            layout="horizontal"
            onValuesChange={this.onChange}>
            <Form.Item 
              label="文件位置" 
              rules={[{ required: true, message: '请输入文件位置!' }]}
              name="filePath">
              <Input disabled={this.props.mode != EditMode.create}></Input>
            </Form.Item>
            <Form.Item 
              label="描述" 
              rules={[{ required: true, message: '请输入配置描述!' }]}
              name="description">
              <TextArea rows={4}></TextArea>
            </Form.Item>
            <Form.Item 
              label="默认值" 
              rules={[{ required: true, message: '请输入配置值!' }]}
              name="targetValue">
              <Input></Input>
            </Form.Item>
          </Form>
      </Modal>
    );
  }
}

export default connect()(UpdateTextConfig);
