import * as React from 'react';
import { Modal, Form, Input, Checkbox, Button, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import FileTree from './fileTree';
import { FormInstance } from 'antd/lib/form';
import configStyles from './styles/gitAddConfig.less'
import styles from './styles/textConfig.less'
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { connect } from 'dva';
import GitFileEditor from './fileEditor';
import { EditMode } from '@/models/common';
import { GitConfig } from '@/models/git';

interface FormData {
  filePath?: string;
  reg?: string;
  targetValue?: string;
  description?: string;
  global?: boolean;
  ignoreCase?: boolean;
}
export interface TextConfigParam {
  filePath: string;
  reg: string
  targetValue: string;
  description: string;
}
interface Props {
  mode: EditMode;
  gitId: string;
  gitVersionId: string;
  configInfo?: GitConfig;
  onCancel (): void;
  onSubmit (data: TextConfigParam): void;
  onBack? (): void;
  dispatch: Dispatch;
}
interface State {
  filePath: string;
  fileContent: string;
  formData: FormData;
  reg?: RegExp;
  displayContent: string;
}
class GitTextConfig extends React.Component<Props, State> {
  form: React.RefObject<FormInstance> = React.createRef();
  constructor (props: Props) {
    super(props)
    this.state = {
      filePath: props.configInfo?.filePath || "",
      fileContent: '',
      formData: {
        filePath: props.configInfo?.filePath || "",
        description: props.configInfo?.description || "",
        targetValue: props.configInfo?.targetValue || "",
        reg: props.configInfo ? JSON.parse(props.configInfo.reg)['source'] : "",
        global: props.configInfo ? JSON.parse(props.configInfo.reg)['global'] : false,
        ignoreCase: props.configInfo ? JSON.parse(props.configInfo.reg)['ignoreCase'] : false
      },
      displayContent: ''
    }
    this.onSelectFile = this.onSelectFile.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onReplace = this.onReplace.bind(this)
    this.onReset = this.onReset.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onBack = this.onBack.bind(this)
  }

  componentDidMount () {
    if (this.props.mode === EditMode.update) {
      this.onSelectFile(this.state.filePath)
    }
  }
  onSelectFile (filePath: string) {
    this.props.dispatch({
      type: 'git/getFileContent',
      payload: filePath,
      callback: fileContent => {
        this.setState({
          filePath,
          fileContent,
          displayContent: fileContent
        })
      }
    })
  }
  onChange (changedValues: FormData, formData: FormData) {
    let reg = null
    
    try {
      reg =  new RegExp(formData.reg || '', `${formData.global ? 'g' : ''}${formData.ignoreCase ? 'i' : ''}`)
      this.setState({
        formData,
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
      displayContent: this.state.displayContent.replace(this.state.reg!, this.state.formData.targetValue || '')
    })
  }
  onReset () {
    this.setState({
      displayContent: this.state.fileContent
    })
  }
  onSubmit () {
    if (!this.state.filePath) {
      message.error('请选择目标文件')
      return;
    }
    this.form.current?.validateFields()
    .then((form) => {
      if (!this.props.onSubmit) return
      const reg = this.state.reg
      this.props.onSubmit({
        filePath: this.state.filePath,
        reg: JSON.stringify({
          source: reg!.source,
          global: reg!.global,
          ignoreCase: reg!.ignoreCase
        }),
        targetValue: form.targetValue!,
        description: form.description!
      })
    })
    .catch((err) => {
      console.error('表单验证失败', err)
    })
  }
  onCancel () {
    if (this.props.onCancel) this.props.onCancel()
  }
  onBack () {
    if (this.props.onBack) this.props.onBack()
  }
  render () {
    return (
      <Modal 
        className={configStyles.gitConfigModal} 
        visible={true} 
        title={<a onClick={this.onBack}><LeftOutlined style={{marginRight: '5px'}}/>切换类型</a>} 
        width="60%" 
        okText="保存" 
        cancelText="取消"
        onCancel={this.onCancel}
        onOk={this.onSubmit}>
        <FileTree 
          defauleSelect={this.state.filePath}
          onSelect={this.onSelectFile} 
          versionId={this.props.gitVersionId}
          gitId={this.props.gitId}></FileTree>
        <div className={[configStyles.gitCmLeftPanel, styles.gitTextConfig].join(' ')}>
          <Form ref={this.form}
            layout="inline"
            initialValues={this.state.formData}
            onValuesChange={this.onChange}>
            <Form.Item name="reg" label="匹配正则" className={styles.long}
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
            <div className={styles.formDivider}/>
            <Form.Item label="替换为" name="targetValue" className={styles.long}>
              <Input></Input>
            </Form.Item>
            <div className={styles.formDivider}/>
            <Form.Item label="配置描述" name="description" className={styles.long}
              rules={[{
                required: true,
                message: '描述信息不能为空'
              }]}>
              <Input></Input>
            </Form.Item>
            <Button type="primary" onClick={this.onReplace}>替换</Button>
            <Button onClick={this.onReset}>还原</Button>
          </Form>
          <GitFileEditor reg={this.state.reg!} content={this.state.displayContent}></GitFileEditor>
        </div>
      </Modal>
    )
  }
}

export default connect()(GitTextConfig)