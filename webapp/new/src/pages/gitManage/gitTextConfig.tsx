import * as React from 'react';
import { Modal, Form, Input, Checkbox, Button, message, Tooltip } from 'antd';
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
  formPending: boolean;
}
class GitTextConfig extends React.Component<Props, State> {
  form: React.RefObject<FormInstance> = React.createRef();
  constructor (props: Props) {
    super(props)
    this.state = {
      filePath: props.configInfo?.filePath || "",
      fileContent: '',
      formPending: false,
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
    this.onContinue = this.onContinue.bind(this)
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
    } catch(err) {}
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
  async onSubmit () {
    if (!this.state.filePath) {
      message.error('请选择目标文件')
      return;
    }
    const form = await this.form.current?.validateFields()
    if (!this.props.onSubmit) return
    this.setState({
      formPending: true
    })
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
    this.setState({
      formPending: false
    })
  }
  onCancel () {
    if (this.props.onCancel) this.props.onCancel()
  }
  onBack () {
    if (this.props.onBack) this.props.onBack()
  }
  async onContinue () {
    await this.onSubmit()
    this.form.current?.resetFields()
  }
  render () {
    return (
      <Modal 
        className={configStyles.gitConfigModal} 
        visible={true} 
        title={<a onClick={this.onBack}><LeftOutlined style={{marginRight: '5px'}}/>切换类型</a>} 
        width="60%" 
        footer={
          <>
          <Button onClick={this.onCancel}>取消</Button>
          <Button loading={this.state.formPending} type="primary" onClick={this.onSubmit}>保存</Button>
          {/* <Tooltip title="保存当前配置，并继续添加下一个配置">
            <Button loading={this.state.formPending} type="primary" onClick={this.onContinue}>继续添加</Button>
          </Tooltip> */}
          </>
        }>
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
              <Input autoComplete="off"></Input>
            </Form.Item>
            <Form.Item valuePropName="checked" name="global">
              <Checkbox>全局</Checkbox>
            </Form.Item>
            <Form.Item valuePropName="checked" name="ignoreCase">
              <Checkbox>忽略大小写</Checkbox>
            </Form.Item>
            <div className={styles.formDivider}/>
            <Form.Item label="替换为" name="targetValue" className={styles.long}>
              <Input autoComplete="off"></Input>
            </Form.Item>
            <div className={styles.formDivider}/>
            <Form.Item label="配置描述" name="description" className={styles.long}
              rules={[{
                required: true,
                message: '描述信息不能为空'
              }]}>
              <Input autoComplete="off"></Input>
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