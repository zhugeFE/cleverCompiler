/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-07 22:27:54
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-23 11:11:45
 */


import { Form, FormInstance, Input, Modal } from 'antd';
import React from 'react';
import { Dispatch } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import { TemplateConfig } from '@/models/template';
import TextArea from 'antd/lib/input/TextArea';
import Dragger from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import style from "./styles/updateFileConfig.less"
interface FormData {
  file: File | null;
  filePath: string;
  description: string;
}

interface submitParams {
  targetValue: string;
  file: File;
}

interface Props {
  config: TemplateConfig;
  onSubmit (data: submitParams): void;
  onCancel(): void;
  dispatch: Dispatch;
}

interface States {
  form: FormData;
}

class UpdateTextConfig extends React.Component<Props, States> {
  projectFileConfigForm: React.RefObject<FormInstance> = React.createRef()
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
    if (!this.state.form.file) return
    this.projectFileConfigForm.current?.validateFields()
    .then((form: FormData) => {
      if (!this.props.onSubmit) return
      console.log(form)
      this.props.onSubmit({
        targetValue: JSON.stringify({originalFilename: form.file!['file'].name, newFilename: ""}),
        file: form.file!
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
        width="40%"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}>
        <div className={style.updateFileConfig}>
          <Form
            ref={this.projectFileConfigForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={this.state.form}
            layout="horizontal"
            onValuesChange={this.onChange}>
            <Form.Item 
              label="文件位置" 
              rules={[{ required: true, message: '请输入配置名称!' }]}
              name="filePath">
              <Input disabled></Input>
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
        </div>
      </Modal>
    );
  }
}

export default connect()(UpdateTextConfig);
