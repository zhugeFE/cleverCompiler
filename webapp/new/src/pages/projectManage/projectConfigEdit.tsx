/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-27 16:57:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-27 17:15:41
 */
import { ConfigInstance } from "@/models/template";
import util from "@/utils/utils";
import { Form, Input, Modal } from "antd";
import { connect } from "dva";
import React from "react"
import { Dispatch } from "umi";

interface FormData {
  path: string;
  value: string;
}

interface Props {
  config: ConfigInstance;
  onCancel(): void;
  dispatch: Dispatch;
}

interface States {
  form: FormData;
}


class ProjectConfigEdit extends React.Component <Props, States> {
  constructor(prop: Props){
    super(prop)
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
      // this.props.dispatch({
      //   type: 'template/updateConfig',
      //   payload: {
      //     id: data.id,
      //     defaultValue: this.state.form.value,
      //     isHidden: data.isHidden,
      //     globalConfigId: data.globalConfigId,
      //   } as UpdateConfigParam,
      //   callback: () => {
      //     this.props.onCancel()
      //   }
      // });
  }

  onChangeForm(chanedValue: any, values: FormData) {
    const form = util.clone(values);
    this.setState({
      form,
    });
  }
  
  render () {
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
            <Form.Item label="默认值" name="value">
              <Input></Input>
            </Form.Item>
          </Form>  
      </Modal>
    )
  }
}


export default connect()(ProjectConfigEdit)