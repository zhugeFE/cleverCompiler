/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:38
 * @LastEditors: Adxiong
 */
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';
import { Button, Col, Input, message, Radio, Row, Select, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import React from 'react';
import { TemplateConfig, TemplateGlobalConfig, TemplateInfo, TemplateInstance, TemplateVersionGit } from "@/models/template"
import { Member, ProjectInfo } from "@/models/project"
import { IRouteComponentProps } from '@umijs/renderer-react';
import { withRouter } from 'react-router';
import { connect } from 'dva';
import { Customer } from "@/models/customer";
import styles from './styles/projectEdit.less';
import { compileType, EditMode, publicType, TypeMode, VersionStatus } from '@/models/common';
import ProjectGlobalConfig from './projectGlobalConfig';
import ProjectConfig from './projectConfig';
import { ConnectState } from '@/models/connect';
import util from '@/utils/utils';
import { CurrentUser } from '@/models/user';

export interface Props extends IRouteComponentProps<{id: string;}>{
  templateList: TemplateInstance[] | null
  customerList: Customer[] | null;
  templateInfo: TemplateInfo | null;
  currentUser: CurrentUser | null;
  dispatch: Dispatch;
}

interface States {
  mode: EditMode;
  name: string;
  description: string;
  shareMember: string[];
  templateId: string;
  templateVersionId: string;
  compileType: number;
  publicType: number;
  gitList:  TemplateVersionGit[] | null;
  globalConfigList: TemplateGlobalConfig[] | null,
  showLoading: boolean;
  customer: string;
  memberList: Member[] | null;
  projectInfo: ProjectInfo | null;
  activeKey: string;
}

class ProjectEdit extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      mode: EditMode.create,
      showLoading: false,
      name: "",
      description: "",
      shareMember: [],
      templateId: "",
      templateVersionId: "",
      compileType: 0,
      publicType: 0,
      gitList: null,
      globalConfigList: null,
      customer: "",
      projectInfo: null,
      memberList: null,
      activeKey: ""
    }
    this.onShareSelectChange = this.onShareSelectChange.bind(this)
    this.onTemplateSelectChange = this.onTemplateSelectChange.bind(this)
    this.onTemplateVersionSelectChange = this.onTemplateVersionSelectChange.bind(this)
    this.onCompileTypeSelectChange = this.onCompileTypeSelectChange.bind(this)
    this.onRadioChange = this.onRadioChange.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
    this.onCustomerSelectChange = this.onCustomerSelectChange.bind(this)
    this.afterUpdateGlobalConfig = this.afterUpdateGlobalConfig.bind(this)
    this.afterUpdateConfig = this.afterUpdateConfig.bind(this)
    this.onChangeActiveKey = this.onChangeActiveKey.bind(this)
    this.onUpdateConfigHidden = this.onUpdateConfigHidden.bind(this)
    this.onUpdateGlobalConfigHidden = this.onUpdateGlobalConfigHidden.bind(this)
  }

  async componentDidMount () {
    const id = this.props.match.params.id
    this.getBaseData()

    if( id !== 'addProject') {
      this.setState({
        showLoading: true,
        mode: EditMode.update
      })
      this.props.dispatch({
        type: "project/getProjectInfo",
        payload: id,
        callback: (data: ProjectInfo) => {
          
          this.setState({
            projectInfo: data,
            name: data.name,
            publicType: data.publicType,
            compileType: data.compileType,
            customer: data.customer,
            description: data.description,
            templateId: data.templateId,
            templateVersionId: data.templateVersion,
            gitList: data.gitList,
            activeKey: data.gitList.length ? data.gitList[0].id : "",
            shareMember: JSON.parse(data.shareMember),
            globalConfigList: data.globalConfigList,
          })
          this.getTemplateInfo(data.templateId)
          
        }
      })
    }
  }


  onChangeActiveKey (activeKey: string) {
    this.setState({
      activeKey
    })
  }

  onUpdateConfigHidden (data: string[]) {
    const gitList = util.clone(this.state.gitList)
    gitList?.map( git => {
      git.configList.map( config => {
        if (data.includes(config.id)) {
          config.visable = Number(!config.visable)
        }
      })
    })
    this.setState({
      gitList
    })
  }

  onUpdateGlobalConfigHidden (data: string[]) {
    const globalConfigList = util.clone(this.state.globalConfigList)
    globalConfigList?.map( config => {
      if (data.includes(config.id)) {
        config.visable = Number(!config.visable)
      }
    })
    this.setState({
      globalConfigList
    })
  }
  async getBaseData () {
    
    await this.props.dispatch({
      type: "customer/getCustomerList",
      callback: (data: Customer[]) => {
      }
    })

    await this.props.dispatch({
      type:"project/getMemberList",
      callback: (data: Member[]) => {
        this.setState({
          memberList: data
        })
      }
    })
    await this.props.dispatch({
      type:"template/uquery"
    })
  }
  
  onCustomerSelectChange (value: string) {
    this.setState({
      customer: value
    })
  }


  onShareSelectChange(value: string[]) {
    this.setState({
      shareMember: value
    })
  } 

  getTemplateInfo (id: string) {
    this.props.dispatch({
      type: "template/getInfo",
      payload: id,
      callback: () => {
        this.setState({
          showLoading: false
        })
      }
    })
  }

  onTemplateSelectChange(id: string) {    
    this.props.dispatch({
      type: "template/getInfo",
      payload: id,
      callback: () => {        
        this.setState({
          templateId: id,
          showLoading: false
        })
        
        for ( const version of this.props.templateInfo!.versionList) {
          if (version.status === VersionStatus.placeOnFile) {
            this.onTemplateVersionSelectChange(version.id)
            return
          }
        }
      }
    })
  }

  onTemplateVersionSelectChange(value: string) {    
    if( this.props.templateInfo){
      const current = this.props.templateInfo.versionList.filter( item =>item.id === value)[0]     
      current.gitList.forEach(git => {
        git.configList.forEach(config => {
          config.visable = Number(!config.isHidden)
        })
      }) 
      current.globalConfigList.forEach( config => {
        config.visable = Number(!config.isHidden)
      })
      this.setState({
        templateVersionId: value,
        gitList: current.gitList,
        activeKey: current.gitList.length ? current.gitList[0].id : "",
        globalConfigList: current.globalConfigList,
        publicType: current.publicType
      })
    }
  }

  onCompileTypeSelectChange (value: number) {
    this.setState({
      compileType: value
    })
  }

  onRadioChange (e: any) {
    this.setState({
      publicType: e.target.value
    })    
  }

  onClickSave () {
    
    if (this.state.mode == EditMode.create) {
      this.createProejct()
    } else {
      this.updateProject(this.props.match.params.id)
    }
  }

  onClickCancel () {
    this.props.history.goBack();
  }

  updateProject (projectId: string) {
    const { description, templateId, publicType, templateVersionId, globalConfigList, gitList, shareMember } = this.state
    
    const form = new FormData()

    // shareMember 是否发生改变
    // description 是否发生改变

    // 全局配置内容
    globalConfigList?.forEach(item => {
      if(item.file) {
        const uid = item.file['file']['uid']
        const originalFilename = item.file['file']['name']
        const newFileName = `${uid}.${originalFilename.split('.')[1]}`
        item.targetValue = JSON.stringify({newFilename: newFileName, originalFilename: originalFilename})
        form.append(newFileName, item.file['file'])
        delete item.file
      }
    })

    // git 内容
    gitList?.forEach (git => {
      git.configList.forEach( config => {
        if (config.file) {
          const uid = config.file['file']['uid']
          const originalFilename = config.file['file']['name']
          const newFileName = `${uid}.${originalFilename.split('.')[1]}`
          config.targetValue = JSON.stringify({newFilename: newFileName , originalFilename: originalFilename})
          form.append(newFileName, config.file['file'])
          delete config.file
        }
      })
    })
    form.append("id", projectId)
    form.append('templateId', templateId)
    form.append('templateVersionId', templateVersionId)
    form.append("gitList", JSON.stringify(gitList))
    form.append("publicType", String(publicType))
    form.append('shareMember', JSON.stringify(shareMember))
    form.append('description', description)
    form.append('globalConfigList', JSON.stringify(globalConfigList))

    this.props.dispatch( {
      type: "project/updateProject",
      payload: form,
      callback: () => {
        this.props.history.goBack();
        message.success("修改成功")
      }
    })
  
  }

  createProejct () {
    const { name, templateId, templateVersionId,compileType, gitList, globalConfigList, publicType, shareMember, description, customer} = this.state
    
    if ( !name || !description || !customer || !templateId || !templateVersionId) {
      message.error("数据填写不完整")
      return
    }
    if ( String(compileType) == "") {
      message.error("编译类型未选择")
    }

    const form = new FormData()

    globalConfigList?.forEach(item => {
      if(item.file) {
        const uid = item.file['file']['uid']
        const originalFilename = item.file['file']['name']
        const newFileName = `${uid}.${originalFilename.split('.')[1]}`
        item.targetValue = JSON.stringify({newFilename: newFileName, originalFilename: originalFilename})
        form.append(newFileName, item.file['file'])
        delete item.file
      }
    })

    gitList?.forEach (git => {
      git.configList.forEach( config => {
        if (config.file) {
          const uid = config.file['file']['uid']
          const originalFilename = config.file['file']['name']
          const newFileName = `${uid}.${originalFilename.split('.')[1]}`
          config.targetValue = JSON.stringify({newFilename: newFileName , originalFilename: originalFilename})
          form.append(newFileName, config.file['file'])
          delete config.file
        }
      })
    })

    form.append('name', name)
    form.append('templateId', templateId)
    form.append('templateVersionId', templateVersionId)
    form.append('compileType', String(compileType))
    form.append('publicType', String(publicType))
    form.append('configList', JSON.stringify(globalConfigList))
    form.append('gitList', JSON.stringify(gitList))
    form.append('shareMember', JSON.stringify(shareMember))
    form.append('description', description)
    form.append('customer', customer)

    this.props.dispatch({
      type:"project/addProject",
      payload: form,
      callback: ()=>{
        this.props.history.goBack();
        message.success("上传成功")
      }
    })
  }

  onChangeEdit (type: string, e: any ) {
    /**
     * 名称 描述 改变 触发 state
     */
    const target = e.target
    switch (type) {
      case "name": {
        this.setState({
          name: target.value
        })
        break;
      }
      case "description": {
        this.setState({
          description: target.value
        })
        break;
      }
    }
  }

  afterUpdateGlobalConfig (config: TemplateGlobalConfig) {
    const globalConfigList = util.clone(this.state.globalConfigList)
    globalConfigList?.forEach( item => {
      if (item.id == config.id) {
        item.targetValue = config.targetValue
        if ( item.type == TypeMode.file) {
          item.file = config.file
        }
      }
    })
    this.setState({
      globalConfigList
    })
  }

  afterUpdateConfig (config: TemplateConfig) {
    const gitList = util.clone(this.state.gitList)
    gitList?.forEach( git => {
      git.configList.forEach( item => {
        if (item.id == config.id) {
          if (item.typeId == TypeMode.text) {
            item.targetValue = config.targetValue
          } else {
            item.file = config.file
            item.targetValue = config.targetValue
          }
        }
      })
    })
    this.setState({
      gitList
    })
  }

  render() {
    
    if (this.state.showLoading ) {
      return (
        <Spin className={styles.loading} tip="项目配置详情获取中..." size="large"></Spin>
      )
    }

    const labelCol = 2
    const wrapperCol = 20
    return (
      <div className={styles.projectEditPanel}>
        <div className={styles.projectPanelTop}>
          <a
            onClick={() => {
              this.props.history.goBack();
            }}>
            <LeftOutlined />
            返回
          </a>
        </div>  
        <div className={styles.projectEditContent}>
          <Row className={styles.rowMargin}>
            <Col span={labelCol}>名称：</Col>
            <Col span={wrapperCol} className={styles.colFlex}> 
              <Input 
                placeholder="请输入名称"
                disabled={this.state.mode == EditMode.update ||  (this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId != this.props.currentUser?.id : false)}
                style={{width: 300}} onChange={(event) => {
                  this.onChangeEdit('name', event)
                }} defaultValue={this.state.name}></Input>
            </Col>
          </Row>

          <Row className={styles.rowMargin}>
            <Col span={labelCol}>客户</Col>
            <Col span={wrapperCol}>
              <Select
                defaultValue={this.state.customer}
                placeholder="请选择"
                style={{ width: 200 }}
                disabled={this.state.mode == EditMode.update || (this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId != this.props.currentUser?.id : false)}
                onChange={this.onCustomerSelectChange}
              >
                {
                  this.props.customerList?.map( item => {
                    return <Select.Option key={item.id} value={item.id}> {item.name} </Select.Option>
                  })
                }
              </Select>
            </Col>
          </Row> 

          <Row className={styles.rowMargin}>
            <Col span={labelCol}>编译类型：</Col>
            <Col span={wrapperCol}>
              <Select 
                defaultValue={this.state.compileType}
                placeholder="请选择"
                style={{width: 200}}
                disabled={this.state.mode == EditMode.update || this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId != this.props.currentUser?.id : false}
                onChange={this.onCompileTypeSelectChange}
              >
                {
                  compileType.map( item => {
                    return <Select.Option key={item.value} value={item.value}> {item.text} </Select.Option>
                  })
                }
              </Select>
            </Col>
          </Row>
          
          <Row className={styles.rowMargin}>
            <Col span={labelCol}>模板：</Col>
            <Col span={wrapperCol} className={styles.colFlex}>
              <Select
                defaultValue={this.state.templateId}
                placeholder="请选择"
                disabled={this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId != this.props.currentUser?.id : false}
                style={{ width: 200 }}
                onChange={this.onTemplateSelectChange}
              >
                {
                  this.props.templateList?.map( item => {
                    return <Select.Option key={item.id} value={item.id}>
                      {item.name}
                      <div className={styles.versionDesc}>{item.description}</div>
                    </Select.Option>
                  })
                }
              </Select>
              {
                this.state.templateVersionId && 
                <Select
                  value={this.state.templateVersionId}
                  disabled={this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId != this.props.currentUser?.id : false}
                  style={{width: 200}}
                  onChange={this.onTemplateVersionSelectChange}
                >
                  {
                    this.props.templateInfo?.versionList.map( item => {
                      if (item.status === VersionStatus.placeOnFile) {
                        return <Select.Option key={item.id} value={item.id}> 
                          {item.version}
                          <div className={styles.versionDesc}>{item.description}</div>
                        </Select.Option>
                      }
                    })
                  }
                </Select>
              }
            </Col>
          </Row>
          <Row className={styles.rowMargin}>
            <Col span={labelCol}>发布方式</Col>
            <Col span={wrapperCol}>
              <Radio.Group
                disabled={this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId != this.props.currentUser?.id : false}
                className={styles.radio} 
                onChange={this.onRadioChange} 
                value={this.state.publicType}>
                {
                  publicType.map( item => {
                    return <Radio key={item.value} value={item.value}>{item.text}</Radio>
                  })
                }
              </Radio.Group>
            </Col>
          </Row>

          <Row className={styles.rowMargin}>
            <Col span={labelCol}>全局配置：</Col>
            <Col span={wrapperCol}>
              <ProjectGlobalConfig   
                disabled={this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId != this.props.currentUser?.id : false}
                globalConfigList={this.state.globalConfigList?.length ? this.state.globalConfigList : []}
                onUpdateConfig={this.afterUpdateGlobalConfig}
                onUpdateConfigHidden={this.onUpdateGlobalConfigHidden}
                />
            </Col>
          </Row>

          <Row className={styles.rowMargin}>
            <Col span={labelCol}>项目配置：</Col>
            <Col span={wrapperCol}>
                <ProjectConfig
                  disabled={this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId != this.props.currentUser?.id : false}
                  onUpdateConfig={this.afterUpdateConfig}
                  globalConfigList={this.state.globalConfigList!}
                  activeKey={this.state.activeKey}
                  gitList={this.state.gitList?.length ? this.state.gitList : []}
                  onUpdateConfigHidden={this.onUpdateConfigHidden}
                  onChangeActiveKey={this.onChangeActiveKey}
                  />
            </Col>
          </Row>

          <Row className={styles.rowMargin}>
            <Col span={labelCol}>分享成员：</Col>
            <Col span={wrapperCol}>
              <Select
                mode="multiple"
                allowClear
                showSearch
                disabled={this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId != this.props.currentUser?.id : false}
                style={{ width: 200 }}
                placeholder="请选择"
                defaultValue={this.state.shareMember.length > 0 ? this.state.shareMember : undefined }
                optionFilterProp="children"
                onChange={this.onShareSelectChange}
                filterOption={(input, option) => option?.props.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {
                  this.state.memberList?.map( item => {
                    return <Select.Option key={item.id} name={item.name} value={item.id}> {item.name} </Select.Option>
                  })
                }
              </Select>
            </Col>
          </Row>

          <Row className={styles.rowMargin}>
            <Col span={labelCol}>描述：</Col>
            <Col span={wrapperCol}>
              <TextArea 
                disabled={this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId != this.props.currentUser?.id : false}
                placeholder="请输入描述内容"
                defaultValue={this.state.description}
                rows={10} onChange={(event) => {
                  this.onChangeEdit('description', event)
                }}></TextArea>
            </Col>
          </Row>
          {
            
            (this.state.projectInfo?.creatorId ? this.state.projectInfo?.creatorId == this.props.currentUser?.id : true )&&
            <Row className={styles.rowMargin}>
              <Button type="primary" onClick={this.onClickSave}>保存</Button>
              <Button style={{marginLeft:5}} onClick={this.onClickCancel}>取消</Button>
            </Row>
          }
        </div> 
      </div>
    )
  }
}

export default connect( ({ customer, template, user} : ConnectState) => {
  return {
    customerList: customer.customerList,
    templateList:template.templateList,
    currentUser: user.currentUser,
    templateInfo: template.templateInfo!
  }
})(withRouter(ProjectEdit))

