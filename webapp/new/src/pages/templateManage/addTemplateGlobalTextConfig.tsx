/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-11 20:16:18
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-18 18:31:36
 */
import { Form, Input, Modal } from 'antd';
import React from 'react';
import { Dispatch } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import util from '@/utils/utils';
import { CreateTemplateGlobalConfigParams, TemplateGlobalConfig } from '@/models/template';
import { LeftOutlined } from '@ant-design/icons';

interface FormData {
  name: string;
  desc: string;
  value: string;
}

interface Props {
  templateId: string;
  templateVersionId: string;
  onCancel(): void;
  onBack(): void;
  afterAdd(config: TemplateGlobalConfig): void;
  dispatch: Dispatch;
}

interface States {
  form: FormData;
}

class AddTemplateGlobalTextConfig extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        name: '',
        desc: '',
        value: '',
      },
    };
    this.onCancel = this.onCancel.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onChangeForm = this.onChangeForm.bind(this);
  }

  onCancel() {
    if (this.props.onCancel) this.props.onCancel();
  }

  onCommit() {
    const data: CreateTemplateGlobalConfigParams = {
      name: this.state.form.name,
      desc: this.state.form.desc,
      defaultValue: this.state.form.value,
      templateId: this.props.templateId,
      templateVersionId: this.props.templateVersionId,
    };
    this.props.dispatch({
      type: 'template/addComConfig',
      payload: data,
      callback: (config: TemplateGlobalConfig) => {
        if (this.props.afterAdd) {
          this.props.afterAdd(config);
        }
      },
    });
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
          <a onClick={this.onBack}>
            <LeftOutlined style={{ marginRight: '5px' }} />
            切换类型
          </a>
        }
        closable={false}
        visible={true}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={this.state.form}
          layout="horizontal"
          onValuesChange={this.onChangeForm}
        >
          <Form.Item label="名称" name="name">
            <Input></Input>
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input></Input>
          </Form.Item>
          <Form.Item label="默认值" name="value">
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default connect()(AddTemplateGlobalTextConfig);
