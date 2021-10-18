/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-09-18 17:41:12
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-26 18:37:26
 */

import { ConnectState } from "@/models/connect";
import { CreateProjectParams, Member, ProjectInfo } from "@/models/project";
import { Button, Col, Input, Radio, Row, Select, Spin } from "antd";
import TextArea from 'antd/lib/input/TextArea';
import React from "react";
import styles from "./styles/tabPaneConfig.less";
import GlobalConfig from "./projectGlobalConfig";
import ConfigBox from "./projectConfig";
import { TemplateInfo, TemplateInstance } from "@/models/template";
import { Customer } from "@/models/customer";
import { connect, Dispatch } from "umi";
import { compileType, publicType } from "@/models/common";



interface Props {
  projectId: string;
  projectInfo: ProjectInfo | null
  templateList: TemplateInstance[] | null;
  templateInfo: TemplateInfo | null;
  memberList: Member[] | null;
  customerList: Customer[] | null;
  dispatch: Dispatch;
}

interface States {
  name: string;
  description: string;
  publicType: number;
  customer: string;
  compileType: number;
  shareNumber: string[];
}

class TabPaneConfig extends React.Component<Props, States> {
  constructor(Props: Props){
    super(Props)
    this.state = {
      name: "",
      description: "",
      publicType: 0,
      compileType: 0,
      customer: "",
      shareNumber: [],
    }
    this.onChangeEdit = this.onChangeEdit.bind(this)
    this.onCustomerSelectChange = this.onCustomerSelectChange.bind(this)
    this.onTemplateSelectChange = this.onTemplateSelectChange.bind(this)
    this.onTemplateVersionSelectChange = this.onTemplateVersionSelectChange.bind(this)
    this.onCompileTypeSelectChange = this.onCompileTypeSelectChange.bind(this)
    this.onRadioChange = this.onRadioChange.bind(this)
    this.onShareSelectChange = this.onShareSelectChange.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
  }


  componentDidMount () {
    //获取项目id 判断id为“addProject” 还是 projectId
    const id =  this.props.projectId
    if ( id != "addProject" ) {
      this.props.dispatch({
        /**获取项目配置 */
        type: "project/getProjectInfo",
        payload: id,
        callback: (data) => {

          this.props.dispatch({
            /**获取项目配置中对应的版本信息 */
            type: "template/getInfo",
            payload: data.templateId,
            callback: (data)=>{
              console.log(data)
            }
          })
        }
      })
    }
    //模版List
    if ( !this.props.templateList ) {
      this.props.dispatch({
        type:"template/query"
      })
    }
    //客户MAP
    this.props.dispatch({
      type: "customer/getCustomerList"
    })

    //成员MAP
    this.props.dispatch({
      type:"project/getMemberList"
    })

    

  }

  onChangeEdit (e: any ) {
    /**
     * 名称 描述 改变 触发 state
     */
    const target = e.target
    switch ( target.dataset.type ) {
      case "name": {
        this.setState({
          name: e.target.value
        })
        break;
      }
      case "description": {
        this.setState({
          description: e.target.value
        })
        break;
      }
    }
  }

  onCustomerSelectChange (value: string) {
    /**
     * 客户选择
     */
     this.setState({
      customer: value
    })
  }

  onTemplateSelectChange (value: string) {
    /**
     * 模版选择
     */
    console.log(value)

    this.props.dispatch({
      type: "template/getInfo",
      payload: value,
      callback: (data) => {
      }
    })
  }
  onTemplateVersionSelectChange (value: string) {
    /**
     * 模版版本选择
     */
    console.log(value)
    this.props.dispatch({
      type: "template/setCurrentVersion",
      payload: value,
      callback: (data) => {
      }
    })
  }

  onCompileTypeSelectChange (value: number) {
    /**
     * 编译类型选择
     */
    console.log('public',value)
    this.setState({
      compileType: value
    })
  }


  onRadioChange (e: any) {
    /**
     * 发布类型选择
     */
    this.setState({
      publicType: e.target.value
    })
  }

  onShareSelectChange (value: string[]) {
    /**
     * 分享成员选择
     */
    this.setState({
      shareNumber: value
    })
  }

  onClickSave () {
    /**
     * 保存修改
     */
     const data = {
      name: this.state.name,
      templateId: this.props.templateInfo?.id,
      templateVersionId: this.props.templateInfo?.currentVersion.id,
      compileType: this.state.compileType,
      publicType: this.state.publicType,
      configList: this.props.templateInfo?.currentVersion.globalConfigList,
      gitList: this.props.templateInfo?.currentVersion.gitList,
      shareNumber: this.state.shareNumber,
      description: this.state.description,
      customer: this.state.customer
    } as CreateProjectParams
    this.props.dispatch({
      type:"project/addProject",
      payload: data,
      callback: ()=>{
      }
    })
  }
  render () {
    if (! this.props.templateInfo) {
      return (
        <Spin className={styles.loading} tip="项目配置详情获取中..." size="large"></Spin>
      )
    }
    
    const { currentVersion } = this.props.templateInfo
    const labelCol = 3 
    const wrapperCol = 20
    return (
      <div className={styles.projectEditContent}>
          <Row className={styles.rowMargin}>
            <Col span={labelCol}>名称：</Col>
            <Col span={wrapperCol} className={styles.colFlex}> 
              <div >
                <Input onChange={this.onChangeEdit} data-type="name" value={this.props.projectInfo?.name}></Input>
              </div>
              <div style={{marginLeft:10}}>
                <span> 客户：</span>
                <Select
                    defaultValue={this.props.projectInfo?.customer}
                    style={{ width: 100 }}
                    onChange={this.onCustomerSelectChange}
                  >
                    {
                      this.props.customerList?.map( item => {
                        return <Select.Option key={item.id} value={item.id}> {item.name} </Select.Option>
                      })
                    }
                  </Select>
              </div>
            </Col>
          </Row>

          <Row className={styles.rowMargin}>
            <Col span={labelCol}>模板：</Col>
            <Col span={wrapperCol} className={styles.colFlex}>
              <div>
                <Select
                  defaultValue={this.props.projectInfo?.templateId}
                  style={{ width: 100 }}
                  onChange={this.onTemplateSelectChange}
                >
                  {
                    this.props.templateList?.map( item => {
                      return <Select.Option key={item.id} value={item.id}> {item.name} </Select.Option>
                    })
                  }
                </Select>
                <Select
                  value={currentVersion.id}
                  style={{width: 100}}
                  onChange={this.onTemplateVersionSelectChange}
                >
                  {
                    this.props.templateInfo?.versionList.map( item => {
                      return <Select.Option key={item.id} value={item.id}> {item.version} </Select.Option>
                    })
                  }
                </Select>
              </div>
              <div>
                <span> 编译类型：</span>
                <Select 
                  defaultValue={this.props.projectInfo?.compileType}
                  style={{width: 120}}
                  onChange={this.onCompileTypeSelectChange}
                >
                  {
                    compileType.map( item => {
                      return <Select.Option key={item.value} value={item.value}> {item.text} </Select.Option>
                    })
                  }
                </Select>
              </div>
              <div>
                <span>发布方式：</span>
                <Radio.Group className={styles.radio} onChange={this.onRadioChange} defaultValue={this.state.publicType}>
                  {
                    publicType.map( item => {
                      return <Radio key={item.value} value={item.value}>{item.text}</Radio>
                    })
                  }
                </Radio.Group>
              </div>
            </Col>
          </Row>

          <Row className={styles.rowMargin}>
            <Col span={labelCol}>全局配置：</Col>
            <Col span={wrapperCol}>
              <GlobalConfig
                globalConfigList={currentVersion.globalConfigList}/>
            </Col>
          </Row>

          <Row className={styles.rowMargin}>
            <Col span={labelCol}>项目配置：</Col>
            <Col span={wrapperCol}>
                <ConfigBox
                  gitList={currentVersion.gitList}/>
            </Col>
          </Row>

          <Row className={styles.rowMargin}>
            <Col span={labelCol}>分享成员：</Col>
            <Col span={wrapperCol}>
              <Select
                mode="multiple"
                allowClear
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
                optionFilterProp="children"
                defaultValue={JSON.parse(this.props.projectInfo!.shareNumber)}
                onChange={this.onShareSelectChange}
                filterOption={(input, option) =>
                  option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {
                  
                  this.props.memberList?.map( item => {
                    return <Select.Option key={item.id} value={item.id}> {item.name} </Select.Option>
                  })
                }
              </Select>
            </Col>
          </Row>

          
          <Row className={styles.rowMargin}>
            <Col span={labelCol}>描述：</Col>
            <Col span={wrapperCol}>
              <TextArea rows={10} datatype="description" onChange={this.onChangeEdit}></TextArea>
            </Col>
          </Row>

          <Row className={styles.rowMargin}>
            <Button type="primary" onClick={this.onClickSave}>保存</Button>
            <Button>取消</Button>
          </Row>
        </div> 
    )
  }
}
export default connect( ( { template, customer, project}: ConnectState) => {
  return {
    templateInfo: template.templateInfo,
    customerList: customer.customerList,
    projectInfo: project.projectInfo,
    memberList: project.memberList,
    templateList: template.templateList 
  }
})(TabPaneConfig)