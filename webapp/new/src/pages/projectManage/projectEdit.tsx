/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:38
 * @LastEditors: Adxiong
 */
import { ConnectState } from '@/models/connect';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';
import { Button, Col, Input, Radio, Row, Select, Spin, Tabs } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import React from 'react';
import { TemplateInfo, TemplateInstance, TemplateVersion } from "@/models/template"
import { Member, ProjectInfo, CreateProjectParams } from "@/models/project"
import { IRouteComponentProps } from '@umijs/renderer-react';
import { withRouter } from 'react-router';
import { connect } from 'dva';
import { Customer } from "@/models/customer";
import styles from './styles/projectEdit.less';
import TabPaneConfig from "./tabPaneConfig";
import TabPaneCompile from "./tabPaneCompile";

export interface Props extends IRouteComponentProps<{
  id: string;
}>{
  projectInfo: ProjectInfo | null;
  templateList: TemplateInstance[] | null;
  templateInfo: TemplateInfo | null;
  memberList: Member[] | null;
  customerList: Customer[] | null;
  dispatch: Dispatch;
}


interface States {
  activeKey: string;
  name: string;
  description: string;
  shareNumber: string[];
  templateId: string;
  templateVersionId: string;
  compileType: number;
  publicType: number;
  currentTemplateVersionInfo: TemplateVersion | null;
  showLoading: boolean;
  customer: string;
}

class ProjectEdit extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      showLoading: false,
      activeKey: "",
      name: "",
      description: "",
      shareNumber: [],
      templateId: "",
      templateVersionId: "",
      compileType: 0,
      publicType: 0,
      currentTemplateVersionInfo: null,
      customer: ""
    }
    this.onShareSelectChange = this.onShareSelectChange.bind(this)
    this.onTemplateSelectChange = this.onTemplateSelectChange.bind(this)
    this.onTemplateVersionSelectChange = this.onTemplateVersionSelectChange.bind(this)
    this.onCompileTypeSelectChange = this.onCompileTypeSelectChange.bind(this)
    this.onRadioChange = this.onRadioChange.bind(this)
    this.onChangeActiveKey = this.onChangeActiveKey.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
    this.onCustomerSelectChange = this.onCustomerSelectChange.bind(this)
  }

  async componentDidMount () {
    const id = this.props.match.params.id
    if( id !== 'addProject') {
      this.setState({
        showLoading: true
      })
      this.props.dispatch({
        type: "project/getProjectInfo",
        payload: id,
        callback: (data) => {
          this.props.dispatch({
            type: "template/getInfo",
            payload: data.templateId,
            callback: ()=>{
              /**
               *  1.获取项目详情 ， 客户MAP， 成员MAP
               *  2.获取模版列表，
               */
              const {projectInfo, templateInfo} = this.props
    
              const templateVersionId = projectInfo ? projectInfo.templateVersion : " "
              const currentTemplateVersionInfo = templateInfo ? templateInfo.versionList.filter(
                item => item.id === templateVersionId
              )[0] : null
    
              const activeKey = (currentTemplateVersionInfo && currentTemplateVersionInfo.gitList.length > 0) ? currentTemplateVersionInfo.gitList[0].id : "0"
              this.setState({
                  templateVersionId ,
                  currentTemplateVersionInfo,
                  activeKey,
                  showLoading: false
                })
              }
            }
          )
        }
      })
    }

    //客户MAP
    await this.props.dispatch({
      type: "customer/getCustomerList"
    })

    //成员MAP
    await this.props.dispatch({
      type:"project/getMemberList"
    })

    //模版List
    if ( !this.props.templateList ) {
      await this.props.dispatch({
        type:"template/query"
      })
    }
    
  }
  onCustomerSelectChange (value: string) {
    this.setState({
      customer: value
    })
  }


  onShareSelectChange(value: string[]) {
    this.setState({
      shareNumber: value
    })
  } 

  onTemplateSelectChange(value: string) {
    this.props.dispatch({
      type: "template/getInfo",
      payload: value,
      callback: (data) => {
        this.setState({
          templateId: value,
          templateVersionId: data.currentVersion.id
        })
        console.log(this.state.templateVersionId)
      }
    })
  }

  onTemplateVersionSelectChange(value: string) {

    if( this.props.templateInfo){
      const current = this.props.templateInfo.versionList.filter( item =>item.id === value)[0]

      this.setState({
        templateVersionId: value,
        currentTemplateVersionInfo: current ? current : null ,
        activeKey: current.gitList.length > 0 ? current.gitList[0].id : "0"
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

  onChangeActiveKey (key: string){
    this.setState({
      activeKey: key
    })
  }

  onClickSave () {
    const data = {
      name: this.state.name,
      templateId: this.state.templateId,
      templateVersionId: this.state.templateVersionId,
      compileType: this.state.compileType,
      publicType: this.state.publicType,
      configList: this.state.currentTemplateVersionInfo?.globalConfigList,
      gitList: this.state.currentTemplateVersionInfo?.gitList,
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

  render() {
    const labelCol = 3
    const wrapperCol = 20
    const pubilshType = [
      {
        value: 0,
        text: "发布到git"
      },
      {
        value: 1,
        text: "下载"
      },
      {
        value: 2,
        text: "自动"
      }
    ]
    const compileType = [
      {
        value: 0,
        text: "私有部署"
      },
      {
        value: 1,
        text: "常规迭代"
      },
      {
        value: 2,
        text: "发布测试"
      }
    ]
    // 模式切换
    const disableEdit = this.props.location.query.mode === 'info' && this.props.projectInfo ? true : false;
    
    if (this.state.showLoading) {
      return (
        <Spin className={styles.loading} tip="项目配置详情获取中..." size="large"></Spin>
      )
    }


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
          <Tabs type='card'>
            <Tabs.TabPane tab="配置" key="config">
              <TabPaneConfig projectId={this.props.match.params.id}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="编译记录" key="compile">
              <TabPaneCompile id={this.props.match.params.id}/>
            </Tabs.TabPane>
          </Tabs>
        </div>     
      </div>
    )
  }
}

export default connect( ( {customer, template, project }: ConnectState) => {
  return {
    customerList: customer.customerList,
    projectInfo: project.projectInfo,
    memberList: project.memberList,
    templateList: template.templateList,
    templateInfo: template.templateInfo
  }
})(withRouter(ProjectEdit))


