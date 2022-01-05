/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-06 08:50:33
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-05 19:23:25
 */
import { EditMode } from '@/models/common';
import type { GitConfig } from '@/models/git';
import { InboxOutlined, LeftOutlined } from '@ant-design/icons';
import type { FormInstance} from 'antd';
import { Button, Form, Input, message, Modal, Tooltip } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Dragger from 'antd/lib/upload/Dragger';
import type { Dispatch } from 'dva';
import { connect } from 'dva';
import React from 'react';
import FileTree from "./fileTree";
import configStyles from './styles/gitAddConfig.less'
import styles from './styles/fileConfig.less';

interface Props {
  mode: EditMode
  gitId: string;
  gitVersionId: string;
  configInfo?: GitConfig;
  onBack?: () => void;
  onCancel: () => void;
  onSubmit: (form: FormData, isContinue: boolean) => void;
  dispatch: Dispatch;
}

interface FormData {
  file: File | null,
  description: string;
  filePath: string;
}

interface State {
  form: FormData;
  formPending: boolean;

}




class GitFileConfig extends React.Component<Props, State> {
  gitFileForm: React.RefObject<FormInstance> = React.createRef()
  constructor (props: Props) {
    super(props)
    this.state = {
      formPending: false,
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
    this.onContinue = this.onContinue.bind(this)
    this.resetFields = this.resetFields.bind(this)
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
  async onSubmit (e: any, isContinue: boolean) {
    if (!this.state.form.filePath) {
      message.error('请选择目标文件')
      return;
    }

    if (!this.state.form.file) {
      message.error('请选择上传文件')
      return;
    }
    const form = await this.gitFileForm.current?.validateFields()
    if (!this.props.onSubmit) return
    this.setState({
      formPending: true
    })
    this.props.onSubmit({
      filePath: form.filePath,
      file: form.file,
      description: form.description
    },isContinue)
    this.setState({
      formPending: false
    })
  }
  async onContinue () {
    await this.onSubmit( null, true)
    this.resetFields()
  }
  
  resetFields () {
    const form = this.gitFileForm.current
    form?.setFieldsValue({description:''})
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
        width="40%"
        footer={
          <>
            <Button onClick={this.onCancel}>取消</Button>
            <Button loading={this.state.formPending} type="primary" onClick={()=>this.onSubmit(this, false)}>保存</Button>
            <Tooltip title="保存当前配置，并继续添加下一个配置">
              <Button loading={this.state.formPending} type="primary" onClick={this.onContinue}>继续添加</Button>
            </Tooltip>
            </>
        }
      >
        <FileTree
          gitId={this.props.gitId}
          defauleSelect={this.props.configInfo?.filePath}
          versionId={this.props.gitVersionId}
          onSelect={this.onSelectFile}
         />
        <div className={styles.gitFileConfig}>
          <Form
            ref={this.gitFileForm}
            initialValues={this.state.form}
            layout="inline"
            onValuesChange={this.onFormChange}
          >
            <Form.Item required label="目标文件" name="filePath" className={styles.long}>
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item required label="描述" name="description" className={styles.long}>
              <TextArea rows={6} />
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