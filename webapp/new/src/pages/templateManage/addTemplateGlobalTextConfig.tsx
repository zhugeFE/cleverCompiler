/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-11 20:16:18
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-18 10:45:38
 */
import { Form, FormInstance, Input, Modal } from 'antd';
import React from 'react';
import { Dispatch } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import util from '@/utils/utils';
import { TemplateGlobalConfig } from '@/models/template';
import { LeftOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { EditMode } from '@/models/common';

interface FormData {
  name: string;
  description: string;
  targetValue: string;
}

interface Props {
  templateId: string;
  templateVersionId: string;
  mode: EditMode;
  globalConfig?: TemplateGlobalConfig;
  onSubmit (data: FormData): void;
  onCancel(): void;
  onBack?(): void;
  dispatch: Dispatch;
}

interface States {
  form: FormData;
}

class AddTemplateGlobalTextConfig extends React.Component<Props, States> {
  templateTextForm: React.RefObject<FormInstance> = React.createRef()
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        name: this.props.globalConfig?.name ? this.props.globalConfig.name : "",
        description: this.props.globalConfig?.description ? this.props.globalConfig.description : "",
        targetValue:this.props.globalConfig?.targetValue ? this.props.globalConfig.targetValue : "",
      },
    };
    this.onCancel = this.onCancel.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onChangeForm = this.onChangeForm.bind(this);
  }

  onCancel() {
    if (this.props.onCancel) this.props.onCancel();
  }

  onCommit() {
    const { name, description, targetValue } = this.state.form
    this.templateTextForm.current?.validateFields()
    .then((form) => {
      if (!this.props.onSubmit) return
      this.props.onSubmit({
        name: name,
        description: description,
        targetValue: targetValue,
      })
    })
    .catch((err) => {
      console.error('表单验证失败', err)
    })
  }

  onChangeForm(chanedValue: any, values: FormData) {
    const form = util.clone(values);
    this.setState({
      form,
    });
  }

  onBack() {
    if (this.props.onBack) {
      this.props.onBack();
    }
  }

  render() {
    return (
      <Modal
        title={
          this.props.mode ===  EditMode.create? (
            <a onClick={this.onBack}>
            <LeftOutlined style={{ marginRight: '5px' }} />
            切换类型
          </a>
          ) : "修改配置"
        }
        centered
        closable={false}
        visible={true}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}>
          <Form
            ref={this.templateTextForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={this.state.form}
            layout="horizontal"
            onValuesChange={this.onChangeForm}>
            <Form.Item 
              label="名称" 
              rules={[{ required: true, message: '请输入配置名称!' }]}
              name="name">
              <Input autoComplete="off" disabled={this.props.mode != EditMode.create}></Input>
            </Form.Item>
            <Form.Item 
              label="描述" 
              rules={[{ required: true, message: '请输入配置描述!' }]}
              name="description">
              <TextArea rows={4}></TextArea>
            </Form.Item>
            <Form.Item 
              label="默认值" 
              rules={[{ required: true, message: '请输入配置值!' }]}
              name="targetValue">
              <Input autoComplete="off"></Input>
            </Form.Item>
          </Form>
      </Modal>
    );
  }
}

export default connect()(AddTemplateGlobalTextConfig);
