/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-07 19:14:32
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-09 15:57:51
 */
import { InboxOutlined } from '@ant-design/icons';
import { Form, FormInstance, Input, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Dragger from 'antd/lib/upload/Dragger';
import { connect, Dispatch } from 'dva';
import React from 'react';
import configStyles from './styles/projectAddConfig.less'
import styles from './styles/fileConfig.less';
import { TemplateGlobalConfig } from '@/models/template';

interface Props {
  globalConfig: TemplateGlobalConfig;
  onCancel (): void;
  onSubmit(form: submitParams): void;
  dispatch: Dispatch;
}

interface submitParams {
  targetValue: string;
  file: File
}

interface FormData {
  file: File | null,
  description: string;
  name: string;
}

interface State {
  form: FormData
}

class TemplateFileConfig extends React.Component<Props, State> {
  projectFileGlobalForm: React.RefObject<FormInstance> = React.createRef()
  constructor (props: Props) {
    super(props)
    this.state = {
      form: {
        file: null,
        description: props.globalConfig.description,
        name: props.globalConfig.name
      }
    }
    this.onCancel = this.onCancel.bind(this)
    this.onFormChange = this.onFormChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }


  onCancel () {
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  onFormChange (changeValue: string, formData: FormData) {
    this.setState({
      form: formData
    })
  }

  onSubmit () {    
    this.projectFileGlobalForm.current?.validateFields()
    .then(() => {
      if (!this.props.onSubmit) return
      const {form} = this.state
      this.props.onSubmit({
        targetValue: JSON.stringify({originalFilename: form.file!['file'].name, newFilename: ""}),
        file: form.file!
      })
    })
    .catch((err) => {
      console.error('表单验证失败', err)
    })
  }
  
  render () {
    return (
      <Modal
        className={configStyles.gitConfigModal} 
        visible={true}
        title="修改配置"
        width="40%"
        okText="保存" 
        cancelText="取消"
        onCancel={this.onCancel}
        onOk={this.onSubmit}
      >
        <div className={styles.gitFileConfig}>
          <Form
            ref={this.projectFileGlobalForm}
            initialValues={this.state.form}
            layout="inline"
            onValuesChange={this.onFormChange}
          >
            <Form.Item 
              label="名称" 
              name="name" 
              rules={[{ required: true, message: '请输入配置名称!' }]}
              className={styles.long}>
              <Input disabled></Input>
            </Form.Item>
            <Form.Item
              label="描述" 
              name="description" 
              rules={[{ required: true, message: '请输入配置描述!' }]}
              className={styles.long}>
              <TextArea  disabled rows={6}></TextArea>
            </Form.Item>
            <Form.Item 
              label="上传文件" 
              rules={[{ required: true, message: '请上传文件!' }]}
              valuePropName="file" 
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

    )
  }
}


export default connect()(TemplateFileConfig)