/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-05 09:58:53
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-18 18:31:31
 */
import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { TemplateCreateParam, TemplateInfo, TemplateInstance } from '@/models/template';
import { connect } from 'dva';
import { Dispatch } from '@/.umi/plugin-dva/connect';

interface FormData {
  name: string;
  description: string;
  version: string;
  versionDescription: string;
}

interface Props {
  dispatch: Dispatch;
  onCommit?(template: TemplateInfo): void;
  onCancel?(): void;
}

interface States {
  show: boolean;
  form: FormData;
}

class CreateTemplate extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      git: '',
      show: true,
      form: {
        name: '',
        description: '',
        version: '1.0.0',
        versionDescription: '',
      },
    } as States;
    this.onCommit = this.onCommit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeForm = this.onChangeForm.bind(this);
  }

  onCommit() {
    const { name, description, version, versionDescription } = this.state.form;
    if (!name) {
      message.error('名称未填写！', 1);
    }
    const data: TemplateCreateParam = {
      name,
      description,
      version,
      versionDescription,
    };

    this.props.dispatch({
      type: 'template/createTemplate',
      payload: data,
      callback: (template: TemplateInfo) => {
        if (this.props.onCommit) this.props.onCommit(template);
        this.setState({
          show: false,
        });
      },
    });
  }

  onCancel() {
    this.setState({
      show: false,
    });
  }

  onChangeForm(changeValue: any, values: FormData) {
    this.setState({
      form: values,
    });
  }

  render() {
    const show = this.state.show;
    return (
      <Modal
        title="新建模板"
        visible={show}
        okText="保存"
        cancelText="取消"
        onOk={this.onCommit}
        onCancel={this.onCancel}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          initialValues={this.state.form}
          layout="horizontal"
          onValuesChange={this.onChangeForm}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入模板名称!' }]}
          >
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入模板描述!' }]}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item
            label="版本号"
            name="version"
            rules={[{ required: true, message: '请输入版本号!' }]}
          >
            <Input disabled addonBefore="v" placeholder="x.x.x" />
          </Form.Item>

          <Form.Item
            label="版本描述"
            name="versionDescription"
            rules={[{ required: true, message: '请输入版本描述!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default connect()(CreateTemplate);
