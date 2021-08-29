/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-27 16:21:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-27 16:50:48
 */
import { Form, Input, Modal } from 'antd';
import React from 'react';
import { Dispatch } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import util from '@/utils/utils';
import { TemplateGlobalConfig } from '@/models/template';

interface FormData {
  name: string;
  description: string;
  value: string;
}

interface Props {
  globalConfig?: TemplateGlobalConfig;
  onCancel(): void;
  onBack?(): void;
  dispatch: Dispatch;
}

interface States {
  form: FormData;
}

class ProjectGlobalConfig extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        name: this.props.globalConfig?.name ? this.props.globalConfig.name : "",
        description: this.props.globalConfig?.description ? this.props.globalConfig.description : "",
        value:this.props.globalConfig?.defaultValue ? this.props.globalConfig.defaultValue : "",
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
    const data = util.clone(this.props.globalConfig)
    data!.defaultValue = this.state.form.value
    data!.description = this.state.form.description
    this.props.dispatch({
      type: 'template/updateComConfig',
      payload: data,
      callback: ()=>{
        if(this.props.onCancel) this.props.onCancel()
      }
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
        title="修改配置"
        centered
        closable={false}
        visible={true}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}>
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={this.state.form}
            layout="horizontal"
            onValuesChange={this.onChangeForm}>
            <Form.Item label="名称" name="name">
              <Input disabled></Input>
            </Form.Item>
            <Form.Item label="描述" name="description">
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

export default connect()(ProjectGlobalConfig);