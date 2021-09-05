/*
 * @Descripttion: 
 * @version: 给i他
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:38
 * @LastEditors: Adxiong
 */
import { ConnectState } from '@/models/connect';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';
import { Button, Col, Input, Radio, Row, Select, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import React from 'react';
import { TemplateInfo, TemplateInstance, TemplateVersion } from "@/models/template"
import { Member, ProjectInfo, CreateProjectParams } from "@/models/project"
import { IRouteComponentProps } from '@umijs/renderer-react';
import { withRouter } from 'react-router';
import { connect } from 'dva';
import styles from './styles/projectEdit.less';
import GlobalConfig from "./projectGlobalConfig";
import ConfigBox from "./projectConfig";

export interface Props extends IRouteComponentProps<{
  id: string;
}>{
  projectInfo: ProjectInfo | null;
  templateList: TemplateInstance[] | null;
  templateInfo: TemplateInfo | null;
  memberList: Member[] | null;
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
      currentTemplateVersionInfo: null
    }
    this.onChangeEdit = this.onChangeEdit.bind(this)
    this.onShareSelectChange = this.onShareSelectChange.bind(this)
    this.onTemplateSelectChange = this.onTemplateSelectChange.bind(this)
    this.onTemplateVersionSelectChange = this.onTemplateVersionSelectChange.bind(this)
    this.onCompileTypeSelectChange = this.onCompileTypeSelectChange.bind(this)
    this.onRadioChange = this.onRadioChange.bind(this)
    this.onChangeActiveKey = this.onChangeActiveKey.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
  }

  async componentDidMount () {
    const id = this.props.match.params.id
    if( id !== 'addProject') {
      this.setState({
        showLoading: true
      })
      this.props.dispatch({
        type: "project/getProjectInfo",
        payload: id
      })
    }
    await this.props.dispatch({
      type:"project/getMemberList"
    })
    await this.props.dispatch({
      type:"template/query"
    })
    if( this.props.projectInfo) {
      this.props.dispatch({
        type: "template/getInfo",
        payload: this.props.projectInfo.templateId,
        callback: ()=>{
          const {projectInfo, templateInfo} = this.props

          const templateVersionId = projectInfo ? projectInfo.templateVersion : " "
          const currentTemplateVersionInfo = templateInfo ? templateInfo.versionList.filter(
            item => item.id === projectInfo?.templateVersion
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
  }

  onChangeEdit (e: any ) {
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

  onShareSelectChange(value: string[]) {
    this.setState({
      shareNumber: value
    })
  } 

  onTemplateSelectChange(value: string) {
    this.setState({
     templateId: value 
    })
    this.props.dispatch({
      type: "template/getInfo",
      payload: value
    })
  }

  onTemplateVersionSelectChange(value: string) {

    if( this.props.templateInfo){
      const current = this.props.templateInfo.versionList.filter( item => {
        if( item.id === value){
          return item
        }
      })[0]

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
      description: this.state.description
    } as CreateProjectParams
    console.log(data)
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
        <Spin className={styles.gitEditLoading} tip="项目配置详情获取中..." size="large"></Spin>
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
        </div>
        
        {
          disableEdit ? 
          (<div className={styles.projectEditContent}>
            <Row className={styles.rowMarginin}>
              <Col span={labelCol}>名称：</Col>
              <Col span={8}> <Input onChange={this.onChangeEdit} data-type="name" value={this.props.projectInfo?.name}></Input></Col>
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
                    defaultValue={this.props.projectInfo?.templateVersion}
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
                    defaultValue={this.props.projectInfo?.compileType || this.state.compileType}
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
                      pubilshType.map( item => 
                        <Radio key={item.value} value={item.value}>{item.text}</Radio>
                      )
                    }
                  </Radio.Group>
                </div>
              </Col>
            </Row>

            <Row className={styles.rowMargin}>
              <Col span={labelCol}>全局配置：</Col>
              <Col span={wrapperCol}>
                <GlobalConfig
                  globalConfigList={this.state.currentTemplateVersionInfo ? this.state.currentTemplateVersionInfo.globalConfigList : null}/>
              </Col>
            </Row>

            <Row className={styles.rowMargin}>
              <Col span={labelCol}>项目配置：</Col>
              <Col span={wrapperCol}>
                  <ConfigBox
                    activeKey={this.state.activeKey}
                    gitList={this.state.currentTemplateVersionInfo ? this.state.currentTemplateVersionInfo.gitList : []}
                    onChangeActiveKey={this.onChangeActiveKey}/>
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
          ) : (
          <div className={styles.projectEditContent}>
            <Row className={styles.rowMarginin}>
              <Col span={labelCol}>名称：</Col>
              <Col span={8}> <Input onChange={this.onChangeEdit} data-type="name" ></Input></Col>
            </Row>

            <Row className={styles.rowMargin}>
              <Col span={labelCol}>模板：</Col>
              <Col span={wrapperCol} className={styles.colFlex}>
                <div>
                  <Select
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
                      pubilshType.map( item => 
                        <Radio key={item.value} value={item.value}>{item.text}</Radio>
                      )
                    }
                  </Radio.Group>
                </div>
              </Col>
            </Row>

            <Row className={styles.rowMargin}>
              <Col span={labelCol}>全局配置：</Col>
              <Col span={wrapperCol}>
                <GlobalConfig
                  globalConfigList={this.state.currentTemplateVersionInfo ? this.state.currentTemplateVersionInfo.globalConfigList : null}/>
              </Col>
            </Row>

            <Row className={styles.rowMargin}>
              <Col span={labelCol}>项目配置：</Col>
              <Col span={wrapperCol}>
                  <ConfigBox
                    activeKey={this.state.activeKey}
                    gitList={this.state.currentTemplateVersionInfo ? this.state.currentTemplateVersionInfo.gitList : []}
                    onChangeActiveKey={this.onChangeActiveKey}/>
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
        
      </div>
    )
  }
}

export default connect( ( { template, project }: ConnectState) => {
  return {
    projectInfo: project.projectInfo,
    memberList: project.memberList,
    templateList: template.templateList,
    templateInfo: template.templateInfo
  }
})(withRouter(ProjectEdit))


