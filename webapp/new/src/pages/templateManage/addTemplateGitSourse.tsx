/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-10 18:48:36
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-17 15:31:39
 */
import { Form, Modal, Select } from "antd"
import React from "react"
import { Dispatch,  } from '@/.umi/core/umiExports'
import { connect } from 'dva'
import util from "@/utils/utils"
import { CreateTemplateVersionGitParams, TemplateVersion, TemplateVersionGit } from "@/models/template"
import { GitInfo , GitInstance} from "@/models/git"

const { Option } = Select
interface FormData {
  gitId: string;
  version: string;
}

interface Props {
  id:string;
  version:string;
  gitList:GitInstance[];
  onCancel():void;
  afterAdd(version: TemplateVersionGit): void; 
  dispatch: Dispatch
}

interface States {
  show: boolean;
  form: FormData;
  gitInfo:GitInfo | null;
}

class CreateTemplateVersion extends React.Component<Props , States> {
  constructor (props: Props){
    super(props)
    this.state = {
      gitInfo:null,
      show: true,
      form: {
        gitId:"",
        version: ""
      }
    }
    this.onCancel = this.onCancel.bind(this)
    this.onCommit = this.onCommit.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
  }

  componentDidMount(){
    console.log(this.state.gitInfo)
  }

  onCancel () {
    if(this.props.onCancel)this.props.onCancel()
  }

  onCommit () {
    const data: CreateTemplateVersionGitParams = {
      templateId:this.props.id,
      templateVersionId:this.props.version,
      gitSourceId: this.state.form.gitId,
      gitSourceVersionId: this.state.form.version
    }
    this.props.dispatch({
      type:"template/addVersionGit",
      payload:data,
      callback:(version: TemplateVersionGit)=>{
        if(this.props.afterAdd){this.props.afterAdd(version)}
      }
    })
  }

  async onChangeForm (chanedValue: any, values: FormData) {
    const form = util.clone(values)
    if(Object.keys(chanedValue)[0]=="gitId"){
      await this.getGitInfo(chanedValue.gitId)
    }
    this.setState({
      form
    })
  }
  getGitInfo (id:string) {
    this.props.dispatch({
      type: 'git/getInfo',
      payload: id,
      callback: (info: GitInfo) => {
        this.setState({
          gitInfo: info,
        })
      }
    })
  }


  render () {
    const gitList = this.props.gitList
    const gitInfo = this.state.gitInfo
    return (
      <>
      {
        gitList[0].name ? (
          <Modal
          title="添加Git源"
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
            <Form.Item label="git源" name="gitId">
              <Select>
                {
                  gitList.map(item=>
                    <Option value={item.id} key={item.id} title={item.name}>{item.name}</Option>
                  )
                }
              </Select>
            </Form.Item>
            <Form.Item label="git源版本" name="version">
              <Select>
                {
                  gitInfo?.versionList.map(item=>
                    <Option value={item.id} key={item.id} title={item.name}>{item.name}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        ): null
      }
      </>
    )
  }
}

export default connect()(CreateTemplateVersion)