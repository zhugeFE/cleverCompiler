/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:55:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-15 16:21:23
 */
import { ConnectState } from '@/models/connect'
import { Button, Checkbox, Form, message, Modal, Radio, Select, Tabs } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect, CurrentUser, Dispatch, IRouteComponentProps, ProjectInfo, ProjectInstance } from 'umi'
import SocketIO from "socket.io-client"
import styles from "./styles/compileEdit.less"
import util from '@/utils/utils'
import CompileResult from "./compileResult"
import DownloadService from "@/services/download"


const socket = SocketIO('http://localhost:3000/', {transports:["websocket"]})

interface Props extends IRouteComponentProps<{
  id: string;
}>{
  projectInfo: ProjectInfo | null ;
  projectList: ProjectInstance[] | null;
  currentUser: CurrentUser | null;
  dispatch: Dispatch;
}
interface States {
  publicType: number;
  projectId: string;
  compileGit: string[];
  compileResult: {
    title: string;
    subTitle: string;
    fileaddr: string;
    successGitNames: string[];
  } | null;
  description: string;
  GitMap: {};
  compileLog: {};
  showResult: boolean;
}

class CompileEdit extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      publicType: 0,
      projectId: "",
      compileGit: [],
      compileResult: null,
      description: "",
      GitMap: {},
      compileLog: {},
      showResult: false,
    }
    this.onRadioChange = this.onRadioChange.bind(this)
    this.selectProject = this.selectProject.bind(this)
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this)
    this.onClickCompile = this.onClickCompile.bind(this)
    this.TextAreaChange = this.TextAreaChange.bind(this)
    this.onCancelShowResult = this.onCancelShowResult.bind(this)
    this.onDownload = this.onDownload.bind(this)
    this.showResult = this.showResult.bind(this)
  }
  
  initSocket () {
    const compileLog =  util.clone(this.state.compileLog)
    socket.on("compileMessage", (data) => {
      if (!compileLog[data.gitName]) {
        compileLog[data.gitName] = []
      }
      compileLog[data.gitName].push({message: data.message.toString()})
      this.setState({
        compileLog
      })
    })
    socket.on("result", (data) =>{
      console.log(data)
      var title = ""
      var subTitle = ""
      if(this.state.compileGit.length == data.successGitNames.length){
        title = `全部编译成功！`
      }else{
        title = `${data.successGitNames.length} / ${this.state.compileGit.length} 编程成功`
        subTitle = `编译成功项：${data.successGitNames.toString()}`
      }
      var compileRes = {
        title,
        subTitle,
        fileaddr: data.fileaddr,
        successGitNames: data.successGitNames
      }
      this.setState({
        compileResult: compileRes,
        showResult: true
      })
    })
  }

  componentDidMount () {
    const id: string = this.props.location.query.id as string

    this.initSocket()
    if( !this.props.currentUser) {
      this.props.dispatch({
        type: "user/fetchCurrent"
      })
    }
    this.props.dispatch({
      type: "project/getProjectList"
    })
    
  }

  onCancelShowResult () {
    this.setState({
      showResult: false
    })
  }

  showResult () {
    this.setState({
      showResult: true
    })
  }

  onDownload () {
    if( this.state.compileResult){
      const res = DownloadService.getDownloadFilePath(this.state.compileResult.fileaddr)
      console.log(res)
    }
  }

  onRadioChange (e: any) {
    this.setState({
      publicType: e.target.value
    })
  }

  selectProject (value: string) {
    this.setState({
      projectId: value
    })
    this.props.dispatch({
      type: "project/getProjectInfo",
      payload: value
    })
  }

  onCheckBoxChange (checkedValues: CheckboxValueType[]) {
    this.setState({
      compileGit: checkedValues as string[]
    })
  }

  onClickCompile () {
    const {compileGit, description, projectId, publicType} = this.state
    if (!compileGit.length) {
      message.warning("未选择编译git")
      return
    }

    if (!description || !projectId) {
      message.warning("信息描述不完整")
      return
    }

    const GitMap = {}
    this.props.projectInfo?.gitList.map( item => {
      GitMap[item.name] = item.id
    })
    const data = {
      userId: this.props.currentUser?.id,
      projectId,
      publicType,
      description,
      gitIds: [...compileGit.map(item => GitMap[item])]
    }

    socket.emit("startCompile", data)
    
  }


  TextAreaChange (e: any) {
    this.setState({
      description: e.target.value
    })
  }
  render() {
    const publicType = [
      {
        id: 0,
        text: "发布到云端"
      },
      {
        id: 1,
        text: "打包下载"
      },
      {
        id: 2,
        text: "分别下载"
      },
      {
        id: 3,
        text: "自动"
      }
    ]
    const checkboxOptions: string[] = []
    if (this.props.projectInfo) {
      this.props.projectInfo.gitList.map( item => {
        checkboxOptions.push(item.name)
      })
    }
    
    return (
      <div>
        <Form
          labelCol={{span:4}}
          wrapperCol={{span:16}}
        >
          <Form.Item 
            label="配置名称"
          >
             <Select onChange={this.selectProject}> 
                {
                  this.props.projectList?.map( item => {
                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  })
                }
              </Select>
          </Form.Item>

          {
            this.props.projectInfo && (
              <>
                <Form.Item 
                  label="发布方式"
                >
                  <Radio.Group onChange={this.onRadioChange} defaultValue={this.state.publicType}>
                    {
                      publicType.map( item => {
                        return <Radio key={item.id} value={item.id}>{item.text}</Radio>
                      })
                    }
                  </Radio.Group>

                </Form.Item>

                <Form.Item label="要编译的项目">
                  <Checkbox.Group options={checkboxOptions}  onChange={this.onCheckBoxChange} />
                </Form.Item>

                <Form.Item label="描述">
                  <TextArea rows={6} onChange={this.TextAreaChange}></TextArea>
                </Form.Item>

                <Form.Item label="编译结果" className={styles.tabsForm}>
                  <Tabs tabPosition="left">
                    {
                      this.state.compileGit.map( item => {
                        return (
                          <Tabs.TabPane tab={item} key={item}>
                            <div className={styles.tabpane_content}>
                              {
                                this.state.compileLog[item] ?
                                this.state.compileLog[item].map((item: { message: string}, index: number) => <p key={index}>{item.message}</p>)
                                : `content ${item}`
                              }
                            </div>
                          </Tabs.TabPane>
                        )
                      })
                    }
                  </Tabs>
                </Form.Item>
                <Button type="primary" onClick={this.onClickCompile}>编译</Button>
                {
                  this.state.compileResult&&
                  <Button type="primary" onClick={this.showResult}>编译结果</Button>
                }
              </>
            )
          }
        </Form>

        <Modal 
          title="编译结果"
          visible={this.state.showResult}
          onCancel={this.onCancelShowResult}
          onOk = {this.onDownload}
          okText="下载"
          cancelText="取消"
        >
          {
            this.state.compileResult && 
            <CompileResult 
              resultData = {this.state.compileResult}
            ></CompileResult>
          }
        </Modal>

        
        
      </div>
    )
  }
}


export default connect( ( {user, project}: ConnectState) => {
  return {
    currentUser: user.currentUser,
    projectList: project.projectList,
    projectInfo: project.projectInfo,
  }
})(withRouter(CompileEdit))