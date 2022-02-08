/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-07 22:27:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-25 20:14:21
 */

import type { FormInstance} from 'antd';
import { Checkbox, Form, Input, Modal } from 'antd';
import React from 'react';
import type { Dispatch } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import type { TemplateConfig } from '@/models/template';
import TextArea from 'antd/lib/input/TextArea';
import { EditMode } from '@/models/common';
import FileTree from "../gitManage/fileTree";
import GitFileEditor from '../gitManage/fileEditor';
import styles from './styles/textConfig.less'

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
  gitId: string;
  gitVersionId: string;
  onSubmit: (data: TextConfig) => void;
  onCancel: () => void;
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
        reg: JSON.parse(props.config.reg).source,
        global: JSON.parse(props.config.reg).global,
        ignoreCase: JSON.parse(props.config.reg).ignoreCase
      },
      displayContent: ''
    };
    this.onCancel = this.onCancel.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
  }

  componentDidMount () {
    if (this.props.mode === EditMode.update) {
      this.onSelectFile(this.state.form.filePath)
    }
  }
  onSelectFile (filePath: string) {
    this.props.dispatch({
      type: 'git/getFileContent',
      payload: filePath,
      callback: fileContent => {
        this.setState({
          fileContent,
          displayContent: fileContent
        })
      }
    })
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
  }


  onCancel() {
    if (this.props.onCancel) this.props.onCancel();
  }

  render() {
    return (
      <Modal
        className={styles.templateConfigModal} 
        title="修改配置"
        centered
        width="60%"
        closable={false}
        visible={true}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}>
        <FileTree 
          defauleSelect={this.state.form.filePath}
          onSelect={this.onSelectFile} 
          versionId={this.props.gitVersionId}
          gitId={this.props.gitId} />
    
        <div className={[styles.gitCmLeftPanel,styles.templateTextConfig].join(' ')}>
          <Form
            ref={this.updateTextConfigForm}
            initialValues={this.state.form}
            layout="inline"
            onValuesChange={this.onChange}>
            <Form.Item name="reg" label="匹配正则" className={styles.long}
              rules={[{
                required: true,
                message: '匹配规则不能为空'
              }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item valuePropName="checked" name="global">
              <Checkbox disabled>全局</Checkbox>
            </Form.Item>
            <Form.Item  valuePropName="checked" name="ignoreCase">
              <Checkbox disabled>忽略大小写</Checkbox>
            </Form.Item>
            <div className={styles.formDivider}/>
            <Form.Item 
              label="文件位置" 
              className={styles.long}
              rules={[{ required: true, message: '请输入文件位置!' }]}
              name="filePath">
              <Input autoComplete="off" disabled={this.props.mode != EditMode.create} />
            </Form.Item>
            <div className={styles.formDivider}/>

            <Form.Item 
              label="描述" 
              className={styles.long}
              rules={[{ required: true, message: '请输入配置描述!' }]}
              name="description">
              <TextArea rows={4} disabled />
            </Form.Item>
            <div className={styles.formDivider}/>

            <Form.Item 
              label="替换值" 
              className={styles.long}
              rules={[{ required: true, message: '请输入配置值!' }]}
              name="targetValue">
              <Input autoComplete="off" />
            </Form.Item>
          </Form>
          <GitFileEditor reg={this.state.reg!} content={this.state.displayContent} />
         </div>
      </Modal>
    );
  }
}

export default connect()(UpdateTextConfig);
