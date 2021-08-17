/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-09 14:43:28
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-16 14:35:29
 */

import { Form, Input, Modal, Select } from "antd"
import React from "react"
import { Dispatch, TemplateVersion } from '@/.umi/core/umiExports'
import { connect } from 'dva'
import { utils } from "umi";
import util from "@/utils/utils";
import { values } from "lodash";
const {Option} = Select;

const VersionType = [
  {title:"大版本",key:"0"},
  {title:"中版本",key:"1"},
  {title:"小版本",key:"2"}
]

interface FormData {
  option:string;
  desc: string;
}

interface Props {
  version:string;
  title?: string;
  id: string;
  afterAdd? (version: TemplateVersion): void; 
  dispatch: Dispatch
}

interface States {
  version:string;
  show: boolean;
  form: FormData;
}

class CreateTemplateVersion extends React.Component<Props , States> {
  
  constructor (props: Props){
    super(props)
    this.state = {
      show: true,
      version:"",
      form: {
        option: "",
        desc:""
      }
    }
    this.onCancel = this.onCancel.bind(this)
    this.onCommit = this.onCommit.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
  }

  onCancel () {
    this.setState({
      show: false
    })
  }

  onCommit () {
    this.props.dispatch({
      type:"template/addVersion",
      payload:{
        templateId:this.props.id,
        description:this.state.form.desc,
        version:this.state.version
      },
      callback:(version:TemplateVersion)=>{
        this.setState({
          show: false
        })    
        if(this.props.afterAdd){this.props.afterAdd(version)}
      }
    })
  }

  onChangeForm (chanedValue: any, values: FormData) {
    if(chanedValue['option']){
      const str = this.props.version.split(".")
      str[chanedValue['option']] = Number(str[chanedValue['option']])+1+""
      switch(chanedValue['option']){
        case "0":{
          str[1] = "0"
          str[2] = "0"
        }
        case "1":{
          str[2] = "0"
        }
      }
      this.setState({
        version:str.join(".")
      })
    }

    this.setState({
      form: values
    })
  }
  render () {
    return (
      <Modal
        title={this.props.title || "添加版本"}
        closable={false}
        visible={this.state.show}
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
          <Form.Item label="版本类型" name="option">
            <Select>
                {
                  VersionType.map(item=>
                    <Option value={item.key} key={item.key} title={item.title}>{item.title}</Option>
                  )
                }
            </Select>
          </Form.Item>
          <Form.Item label="版本号">
            <Input type="text" value={this.state.version} addonBefore="v" disabled placeholder="x.x.x"/>
          </Form.Item>
          <Form.Item label="版本描述" name="desc">
            <Input placeholder="这个版本主要支持..."/>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default connect()(CreateTemplateVersion)