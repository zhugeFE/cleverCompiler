/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-07 22:27:54
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-08 11:36:49
 */


import { Form, FormInstance, Input, Modal } from 'antd';
import React from 'react';
import { Dispatch } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import { TemplateConfig } from '@/models/template';
import TextArea from 'antd/lib/input/TextArea';
import { EditMode } from '@/models/common';
import Dragger from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';

interface FormData {
  file: File | null;
  filePath: string;
  description: string;
}


interface Props {
  mode: EditMode;
  config: TemplateConfig;
  onSubmit (data: FormData): void;
  onCancel(): void;
  dispatch: Dispatch;
}

interface States {
  form: FormData;
}

class UpdateTextConfig extends React.Component<Props, States> {
  updateFileConfigForm: React.RefObject<FormInstance> = React.createRef()
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        file: null,
        filePath: props.config.filePath,
        description: props.config.description,
      },
    };
    this.onCancel = this.onCancel.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount () {
  }


  onCommit() {
    this.updateFileConfigForm.current?.validateFields()
    .then((form: FormData) => {
      if (!this.props.onSubmit) return
      this.props.onSubmit({
        filePath: form.filePath,
        file: form.file,
        description: form.description,
      })
    })
    .catch((err) => {
      console.error('表单验证失败', err)
    })
  }

  onChange (changedValues: FormData, formData: FormData) {
    this.setState({
      form: formData
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
            ref={this.updateFileConfigForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={this.state.form}
            layout="horizontal"
            onValuesChange={this.onChange}>
            <Form.Item 
              label="文件位置" 
              rules={[{ required: true, message: '请输入配置名称!' }]}
              name="filePath">
              <Input disabled={this.props.mode != EditMode.create}></Input>
            </Form.Item>
            <Form.Item 
              label="描述" 
              rules={[{ required: true, message: '请输入配置描述!' }]}
              name="description">
              <TextArea rows={4} disabled></TextArea>
            </Form.Item>
            <Form.Item 
              label="上传文件" 
              rules={[{ required: true, message: '请上传文件!' }]}
              name="file">
               <Dragger 
                beforeUpload={()=>false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                  band files
                </p>
              </Dragger>
            </Form.Item>
          </Form>
      </Modal>
    );
  }
}

export default connect()(UpdateTextConfig);
