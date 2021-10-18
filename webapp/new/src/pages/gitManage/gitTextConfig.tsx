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

interface FormData {
  filePath?: string;
  reg?: string;
  value?: string;
  desc?: string;
  global?: boolean;
  ignoreCase?: boolean;
}
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
interface Props {
  dispatch: Dispatch;
  gitId: string;
  versionId: string;
  onCancel (): void;
  onSubmit (data: TextConfigParam): void;
  onBack (): void;
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
      filePath: '',
      fileContent: '',
      formData: {},
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
      displayContent: this.state.displayContent.replace(this.state.reg!, this.state.formData.value || '')
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
    .then(() => {
      if (!this.props.onSubmit) return
      const reg = this.state.reg
      this.props.onSubmit({
        filePath: this.state.filePath,
        reg: {
          source: reg!.source,
          global: reg!.global,
          ignoreCase: reg!.ignoreCase
        },
        value: this.state.formData.value!,
        desc: this.state.formData.desc!
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
        width="90%" 
        okText="保存" 
        cancelText="取消"
        onCancel={this.onCancel}
        onOk={this.onSubmit}>
        <FileTree 
          onSelect={this.onSelectFile} 
          versionId={this.props.versionId}
          gitId={this.props.gitId}></FileTree>
        <div className={[configStyles.gitCmLeftPanel, styles.gitTextConfig].join(' ')}>
          <Form ref={this.form}
            layout="inline"
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
            <Form.Item label="替换为" name="value" className={styles.long}>
              <Input></Input>
            </Form.Item>
            <div className={styles.formDivider}/>
            <Form.Item label="配置描述" name="desc" className={styles.long}
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