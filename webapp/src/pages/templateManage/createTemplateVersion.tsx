/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-09 14:43:28
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-14 17:45:44
 */

import { Form, FormInstance, Input, message, Modal, Select } from 'antd';
import React from 'react';
import { Dispatch, TemplateVersion } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import TextArea from 'antd/lib/input/TextArea';
import { VersionType } from '@/models/common'
const { Option } = Select;


interface FormData {
  name: string;
  description: string;
  versionDescription: string;
  version: string;
  option: string;
}

interface Props {
  mode: string;
  title?: string;
  templateId?: string;
  versionList?: TemplateVersion[];
  onCancel?(): void;
  afterAdd?(): void;
  dispatch: Dispatch;
}

interface States {
  version: string;
  show: boolean;
  form: FormData;
}

class CreateTemplateVersion extends React.Component<Props, States> {
  createTemplateForm: React.RefObject<FormInstance> = React.createRef();
  constructor(props: Props) {
    super(props);
    this.state = {
      show: true,
      version: '',
      form: {
        option: '',
        name: '',
        version: '',
        description: "",
        versionDescription: ""
      },
    };
    this.onCancel = this.onCancel.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onChangeForm = this.onChangeForm.bind(this);
  }

  onCancel() {
    if(this.props.onCancel){this.props.onCancel()}
  }

  onCommit() {
    this.createTemplateForm.current?.validateFields()
    .then( (form: FormData) => {
      const data = {
        templateId: this.props.templateId || "",
        name: form.name,
        description: form.description,
        version: this.props.mode == 'init' ? '1.0.0' : form.version,
        versionDescription: form.versionDescription
      }
      this.props.dispatch({
        type: 'template/addVersion',
        payload: data,
        callback: (res: boolean) => {
          if (res) {
            message.success({
              content: "创建版本成功",
              duration: 0.5
            })
            this.setState({
              show: false
            })
            if (this.props.afterAdd) this.props.afterAdd()

          } else {
            message.success({
              content: "创建版本失败",
              duration: 0.5
            })
          }
        }
      })
    })
  }

  onChangeForm(chanedValue: any, values: FormData) {
    if (chanedValue['option']) {
      const str = this.props.versionList![0].version!.split('.');
      str[chanedValue['option']] = Number(str[chanedValue['option']]) + 1 + '';
      switch (chanedValue['option']) {
        case '0': {
          str[1] = '0';
          str[2] = '0';
        }
        case '1': {
          str[2] = '0';
        }
      }
      this.createTemplateForm.current?.setFieldsValue({version: str.join('.')})
      // this.setState({
      //   version: str.join('.'),
      // });
    }
    this.setState({
      form: values,
    });
  }
  render() {
    return (
      <Modal
        title={this.props.mode === 'init' ? "创建模版" : "新建版本"}
        closable={false}
        centered
        visible={this.state.show}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}>
        <Form
          ref={this.createTemplateForm}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={this.state.form}
          layout="horizontal"
          onValuesChange={this.onChangeForm}>
          {
            this.props.mode == 'init' && (
              <>
                <Form.Item
                  label="名称"
                  name="name"
                  rules={[{ required: true, message: '请输入模板名称!' }]}
                >
                  <Input autoComplete="off"></Input>
                </Form.Item>
                <Form.Item
                  label="描述"
                  name="description"
                  rules={[{ required: true, message: '请输入模板描述!' }]}
                >
                  <TextArea rows={3}/>
                </Form.Item> 
              </>
            )
          }
          {
            this.props.mode !== 'init' && (
              <Form.Item 
                rules={[{ required: true, message: '请选择版本类型!' }]}
                label="版本类型" 
                name="option">
                <Select>
                  {VersionType.map((item) => (
                    <Option value={item.key} key={item.key} title={item.title}>
                      {item.title}
                    </Option>
                  ))}
                </Select>              
              </Form.Item>
            )
          }
          <Form.Item 
            name="version"
            label="版本号">
            {
              this.props.mode == 'init' ? <Input addonBefore="v" placeholder="1.0.0" disabled/>
              :
              <Input
                type="text"
                value={this.state.version}
                addonBefore="v"
                disabled
                placeholder="x.x.x"
              />
            }
          </Form.Item>
          <Form.Item 
            rules={[{ required: true, message: '请输入版本描述!' }]}
            label="版本描述"
            name="versionDescription">
            <TextArea rows={4}></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default connect()(CreateTemplateVersion);
