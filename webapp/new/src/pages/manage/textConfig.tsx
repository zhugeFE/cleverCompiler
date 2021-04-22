import * as React from 'react';
import { Modal, Form, Input, Checkbox, Button, FormInstance } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import FileTree from './fileTree'

export interface TextConfigParam {
  filePath: string;
  reg: {
    source: string;
    global: boolean;
    ignoreCase: boolean;
  };
  value: string;
  desc: string;
}

export interface TextConfigProps {
  gitId: string;
  versionId: string;
  onCancel (): void;
  onSubmit (data: TextConfigParam): void;
  onBack (): void;
}

interface FormData {
  filePath?: string;
  reg?: string;
  value?: string;
  desc?: string;
  global?: boolean;
  ignoreCase?: boolean;
}
interface State {
  filePath: string;
  fileContent: string;
  formData: FormData;
  reg: RegExp;
  displayContent: string;
}

class TextConfig extends React.Component<TextConfigProps, State> {
  form: React.RefObject<FormInstance>

  constructor (props: TextConfigProps) {
    super(props)
    this.state = {
      filePath: '',
      fileContent: '',
      formData: {},
      reg: new RegExp(''),
      displayContent: ''
    }
    this.form = React.createRef<FormInstance>()
    this.onSelectFile = this.onSelectFile.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onReplace = this.onReplace.bind(this)
    this.onReset = this.onReset.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onBack = this.onBack.bind(this)
  }

  onSelectFile (filePath: string) {
    
  }
  
  onChange (changedValues: FormData, formData: FormData) {
    this.setState({
      formData,
      reg: new RegExp(formData.reg!, `${formData.global ? 'g' : ''}${formData.ignoreCase ? 'i' : ''}`)
    })
  }
  
  onReplace () {
    this.setState({
      displayContent: this.state.displayContent.replace(this.state.reg, this.state.formData.value!)
    })
  }

  onReset () {
    this.setState({
      displayContent: this.state.fileContent
    })
  }

  onSubmit () {
    // if (!this.state.filePath) {
    //   message.error('请选择目标文件')
    //   return;
    // }
    // {
    //   filePath: this.state.filePath,
    //   reg: {
    //     source: this.state.reg.source,
    //     global: this.state.reg.global,
    //     ignoreCase: this.state.reg.ignoreCase
    //   },
    //   value: this.state.formData.value,
    //   desc: this.state.formData.desc
    // }
  }

  onCancel () {
    if (this.props.onCancel) this.props.onCancel()
  }

  onBack () {
    if (this.props.onBack) this.props.onBack()
  }

  render () {
    const layout = {
      labelCol: { span: 6 }
    }
    return (
      <Modal 
        className="git-config-modal" 
        visible={true} 
        title={<a onClick={this.onBack}><LeftOutlined style={{marginRight: '5px'}}/>切换类型</a>} 
        width="90%" 
        okText="保存" 
        cancelText="取消"
        onCancel={this.onCancel}
        onOk={this.onSubmit}>
        <FileTree 
          onSelect={this.onSelectFile} 
          versionId={this.props.versionId}
          gitId={this.props.gitId}></FileTree>
        <div className="git-cm-left-panel git-text-config">
          <Form ref={this.form}
            layout="inline" {...layout} 
            onValuesChange={this.onChange}>
            <Form.Item name="reg" label="匹配正则" className="long" 
              rules={[{
                required: true,
                message: '匹配规则不能为空'
              }]}>
              <Input></Input>
            </Form.Item>
            <Form.Item valuePropName="checked" name="global">
              <Checkbox>全局</Checkbox>
            </Form.Item>
            <Form.Item valuePropName="checked" name="ignoreCase">
              <Checkbox>忽略大小写</Checkbox>
            </Form.Item>
            <div className="form-divider"></div>
            <Form.Item label="替换为" name="value" className="long">
              <Input></Input>
            </Form.Item>
            <Button type="primary" onClick={this.onReplace}>替换</Button>
            <Button onClick={this.onReset}>还原</Button>
            <div className="form-divider"></div>
            <Form.Item label="配置描述" name="desc" className="long" 
              rules={[{
                required: true,
                message: '描述信息不能为空'
              }]}>
              <Input></Input>
            </Form.Item>
          </Form>
          {/* <GitFileEditor reg={this.state.reg} content={this.state.displayContent}></GitFileEditor> */}
        </div>
      </Modal>
    )
  }
}