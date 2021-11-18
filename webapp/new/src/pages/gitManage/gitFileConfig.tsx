/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-06 08:50:33
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-18 10:33:21
 */
import { EditMode } from '@/models/common';
import { GitConfig } from '@/models/git';
import { InboxOutlined, LeftOutlined } from '@ant-design/icons';
import { Form, FormInstance, Input, message, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Dragger from 'antd/lib/upload/Dragger';
import { connect, Dispatch } from 'dva';
import React from 'react';
import FileTree from "./fileTree";
import configStyles from './styles/gitAddConfig.less'
import styles from './styles/fileConfig.less';

interface Props {
  mode: EditMode
  gitId: string;
  gitVersionId: string;
  configInfo?: GitConfig;
  onBack? (): void;
  onCancel (): void;
  onSubmit(form: FormData): void;
  dispatch: Dispatch;
}

interface FormData {
  file: File | null,
  description: string;
  filePath: string;
}

interface State {
  form: FormData
}




class GitFileConfig extends React.Component<Props, State> {
  gitFileForm: React.RefObject<FormInstance> = React.createRef()
  constructor (props: Props) {
    super(props)
    this.state = {
      form: {
        file: null,
        description: props.configInfo?.description || "",
        filePath: props.configInfo?.filePath || ""
      }
    }
    this.onBack = this.onBack.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSelectFile = this.onSelectFile.bind(this)
    this.onFormChange = this.onFormChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onBack () {
    if (this.props.onBack) {
      this.props.onBack()
    }
  }

  onCancel () {
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  onSelectFile (filePath: string) {
    this.gitFileForm.current!.setFieldsValue({filePath})
  }
  onFormChange (changeValue: string, formData: FormData) {
    this.setState({
      form: formData
    })
  }
  onSubmit () {
    if (!this.state.form.filePath) {
      message.error('请选择目标文件')
      return;
    }

    if (!this.state.form.file) {
      message.error('请选择上传文件')
      return;
    }
    this.gitFileForm.current?.validateFields()
    .then(() => {
      if (!this.props.onSubmit) return
      const {form} = this.state
      this.props.onSubmit({
        filePath: form.filePath,
        file: form.file,
        description: form.description
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
        title={
          this.props.mode === EditMode.create &&
          <a onClick={this.onBack}><LeftOutlined style={{marginRight: '5px'}}/>切换类型</a>
        } 
        width="60%"
        okText="保存" 
        cancelText="取消"
        onCancel={this.onCancel}
        onOk={this.onSubmit}
      >
        <FileTree
          gitId={this.props.gitId}
          defauleSelect={this.props.configInfo?.filePath}
          versionId={this.props.gitVersionId}
          onSelect={this.onSelectFile}
        ></FileTree>
        <div className={styles.gitFileConfig}>
          <Form
            ref={this.gitFileForm}
            initialValues={this.state.form}
            layout="inline"
            onValuesChange={this.onFormChange}
          >
            <Form.Item required label="目标文件" name="filePath" className={styles.long}>
              <Input autoComplete="off"></Input>
            </Form.Item>
            <Form.Item required label="描述" name="description" className={styles.long}>
              <TextArea rows={6}></TextArea>
            </Form.Item>
            <Form.Item required label="上传文件" valuePropName="file" name="file">
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


export default connect()(GitFileConfig)