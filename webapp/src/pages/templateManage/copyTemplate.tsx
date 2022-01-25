/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-08 15:43:20
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-25 20:11:49
 */
import type { TemplateInstance } from "@/models/template";
import util from "@/utils/utils";
import type { FormInstance} from "antd";
import { Form, Input, message, Modal, Select, Spin } from "antd";
import type { Dispatch } from "dva";
import { connect } from "dva";
import React from "react";

interface Props {
  templateInfo: TemplateInstance;
  afterCopyTemplate: (template: TemplateInstance) => void;
  onCancel: () => void;
  dispatch: Dispatch;
}

export interface VersionInfo {
  id: string;
  version: string;
}

interface State {
  versionList:  VersionInfo[] | null;
  form: FormData
}

interface FormData {
  sourceName: string;
  name: string;
  templateVersionId: string;
}


class CopyTemplate extends React.Component <Props, State> {
  copyTemplateForm: React.RefObject<FormInstance> = React.createRef()
  constructor (props: Props) {
    super(props)
    this.state = {
      versionList: null,
      form: {
        sourceName: props.templateInfo.name,
        name: "",
        templateVersionId: "",
      }
    }
    this.onClickOk = this.onClickOk.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
  }

  componentDidMount () {
    this.getVersionList(this.props.templateInfo.id)
  }

  getVersionList (id: string) {
    this.props.dispatch ({
      type: "template/getTemplateVersionInfo",
      payload: id,
      callback: (versionList: VersionInfo[]) => {
        const form = util.clone(this.state.form)
        form.templateVersionId = versionList.length ? versionList[0].id : ""
        this.setState({
          versionList,
          form
        })
      }
    })
  }

  onClickOk () {
    if (!this.state.form.templateVersionId){
      message.error("请填写数据后再来找我！")
      return
    }
    this.copyTemplateForm.current?.validateFields()
    .then( (form: FormData) => {
      this.props.dispatch({
        type: "template/copyTemplate",
        payload: {
          templateId: this.props.templateInfo.id, 
          name: form.name,
          templateVersionId: form.templateVersionId
        },
        callback: (data: TemplateInstance) => {
          this.props.afterCopyTemplate(data)
        }
      })
    })
    .catch ( err => {
      throw(err)
    })
  }

  onCancel () {
    this.props.onCancel()
  }
  
  onChangeForm (changedValues: any, values: FormData) {
    this.setState({
      form: values
    })
  }

  render () {
    return (
      <Modal
        title="拷贝模版"
        visible={true}
        okText="发布"
        cancelText="取消"
        onOk={this.onClickOk}
        onCancel={this.onCancel}
        >
          {
            this.state.versionList == null ? <Spin>数据正在赶来中。。。。</Spin> :(
              <Form
                ref={this.copyTemplateForm}
                initialValues={this.state.form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                onValuesChange={this.onChangeForm}
              >
                <Form.Item label="源模版名称" name="sourceName">
                  <Input disabled />
                </Form.Item>
                <Form.Item 
                  rules={[{ required: true, message: '请填写模版名称!' }]}
                  label="新模版名称" 
                  name="name">
                  <Input autoComplete="off" />
                </Form.Item>
                <Form.Item 
                  label="源版本" 
                  name="templateVersionId"
                  rules={[{ required: true, message: '请选择版本!' }]}
                >
                  <Select>
                    {
                      this.state.versionList.map( version => <Select.Option key={version.id} value={version.id}>{version.version}</Select.Option>)
                    }
                  </Select>
                </Form.Item>
              </Form>
            ) 
          }
      </Modal>
    )
  }
}


export default connect()(CopyTemplate)