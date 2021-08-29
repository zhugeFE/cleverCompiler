/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-11 20:16:18
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-26 16:03:29
 */
import { Form, Input, message, Modal } from 'antd';
import React from 'react';
import { Dispatch } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import util from '@/utils/utils';
import { CreateTemplateGlobalConfigParams, TemplateGlobalConfig } from '@/models/template';
import { LeftOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';

interface FormData {
  name: string;
  description: string;
  value: string;
}

interface Props {
  templateId: string;
  templateVersionId: string;
  mode: string;
  globalConfig?: TemplateGlobalConfig;
  onCancel(): void;
  onBack?(): void;
  dispatch: Dispatch;
}

interface States {
  form: FormData;
}

class AddTemplateGlobalTextConfig extends React.Component<Props, States> {
  static defaultProps = {
    mode: 'add'
  }
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
    const { name, description, value } = this.state.form

    if( !name || !description || !value){
      message.error('数据未填写完整！', 1);
      return
    }

    if(this.props.mode === "edit"){
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

    if (this.props.mode === "add"){
      const data: CreateTemplateGlobalConfigParams = {
        name: name,
        description: description,
        defaultValue: value,
        templateId: this.props.templateId,
        templateVersionId: this.props.templateVersionId,
      };
      this.props.dispatch({
        type: 'template/addComConfig',
        payload: data,
        callback: () => {
          this.onCancel()
        },
      });
    }
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
          this.props.mode ==="add" ? (
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
          {
            this.props.mode === "add" ? (
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                initialValues={this.state.form}
                layout="horizontal"
                onValuesChange={this.onChangeForm}>
                <Form.Item label="名称" name="name">
                  <Input></Input>
                </Form.Item>
                <Form.Item label="描述" name="description">
                  <TextArea rows={4}></TextArea>
                </Form.Item>
                <Form.Item label="默认值" name="value">
                  <Input></Input>
                </Form.Item>
              </Form>
            ) : (
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
            )
          }
      </Modal>
    );
  }
}

export default connect()(AddTemplateGlobalTextConfig);
