/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-20 16:05:14
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-18 16:49:56
 */
/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-11 20:16:18
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-20 15:57:37
 */
import { Form, Input, Modal } from 'antd';
import React from 'react';
import { Dispatch } from '@/.umi/core/umiExports';
import { connect } from 'dva';
import util from '@/utils/utils';
import { ConfigInstance, UpdateConfigParam } from '@/models/template';
import TextArea from 'antd/lib/input/TextArea';

interface FormData {
  path: string;
  value: string;
}

interface Props {
  fileContent: string;
  config: ConfigInstance;
  onCancel(): void;
  dispatch: Dispatch;
}

interface States {
  form: FormData;
}

class EditTemplateConfig extends React.Component<Props, States> {

  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        path: this.props.config.filePath,
        value:this.props.config.value
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
    const data = util.clone(this.props.config)
      this.props.dispatch({
        type: 'template/updateConfig',
        payload: {
          id: data.id,
          defaultValue: this.state.form.value,
          isHidden: data.isHidden,
          globalConfigId: data.globalConfigId,
        } as UpdateConfigParam,
        callback: () => {
          this.props.onCancel()
        }
      });
  }

  onChangeForm(chanedValue: any, values: FormData) {
    const form = util.clone(values);
    this.setState({
      form,
    });
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
            <Form.Item label="文件位置" name="path">
              <Input disabled></Input>
            </Form.Item>
            <Form.Item label="内容">
              <TextArea 
                rows={10}
                value={this.props.fileContent}></TextArea>
            </Form.Item>
            <Form.Item label="默认值" name="value">
              <Input></Input>
            </Form.Item>
          </Form>  
      </Modal>
    );
  }
}

export default connect()(EditTemplateConfig);
