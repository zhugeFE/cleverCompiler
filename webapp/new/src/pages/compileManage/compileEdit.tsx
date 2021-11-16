/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:55:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-16 18:10:00
 */
import { ConnectState } from '@/models/connect'
import { Button, Checkbox, Form, FormInstance, message, Modal, Radio, Select, Spin, Tabs } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect, CurrentUser, Dispatch, IRouteComponentProps, ProjectCompileGitParams, ProjectCompileParams } from 'umi'
import SocketIO from "socket.io-client"
import styles from "./styles/compileEdit.less"
import util from '@/utils/utils'
import CompileResult from "./compileResult"
import DownloadService from "@/services/download"
import { CheckCircleFilled, ClockCircleFilled, CloseCircleFilled, ToolFilled } from '@ant-design/icons'


const socket = SocketIO('http://localhost:3000/', {transports:["websocket"]})

interface Props extends IRouteComponentProps<{
  id: string;
}>{
  currentUser: CurrentUser | null;
  dispatch: Dispatch;
}
interface States {
  publicType: number;
  projectId: string;
  compileGit: string[];
  checkboxOptions: string[];
  compileResult: {
    title: string;
    subTitle: string;
    fileaddr: string;
    successGitNames: string[];
  } | null;
  description: string;
  projectList: ProjectCompileParams[] | null;
  compileLog: {};
  compileStatus: {};
  GitMap: {};
  showResult: boolean;
}

class CompileEdit extends React.Component<Props, States> {

  boxBottom: React.RefObject<HTMLDivElement> = React.createRef()
  constructor(prop: Props){
    super(prop)
    this.state = {
      publicType: 0,
      projectId: "",
      compileGit: [],
      projectList: null,
      GitMap:{},
      compileResult: null,
      description: "",
      checkboxOptions: [],
      compileLog: {},
      compileStatus: {},
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
    this.returnSpin = this.returnSpin.bind(this)
    this.reCompile = this.reCompile.bind(this)
    this.onPack = this.onPack.bind(this)
  }
  
  initSocket () {
    const compileLog =  util.clone(this.state.compileLog)
    const compileStatus = util.clone(this.state.compileStatus)
    socket.on("compileMessage", (data) => {
      if (!compileLog[data.gitName]) {
        compileLog[data.gitName] = []
      }
      compileLog[data.gitName].push({message: data.message.toString()})
      this.setState({
        compileLog
      })
    })
    socket.on("compileStatus", (data) => {
      console.log(data)
      compileStatus[data.gitName]= data.message.toString()
      this.setState({
        compileStatus
      })
    })
    socket.on("result", (data) =>{
      console.log(data)
      var title = ""
      var subTitle = ""
      if(data.result == 'success'){
        title = `编译成功！`
      }else{
        title = `编译失败`
        // subTitle = `编译成功项：${data.successGitNames.toString()}`
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

  scrollToBottom () {
    this.boxBottom.current?.scrollIntoView({ behavior: "smooth" })
  }

  componentDidMount () {
    const id: string = this.props.location.query.id as string

    this.initSocket()
    this.getProjectInfo()
    this.getCurrentUser()
    this.scrollToBottom()

  }

  
  getProjectInfo() {
    this.props.dispatch({
      type: "project/getCompileParams",
      callback: (data: ProjectCompileParams[]) => {
 
        this.setState({
          projectList: data
        })
        if (this.props.location.query.id) {
          this.selectProject(this.props.location.query.id as string)
        }
       
      }
    })
  }

  getCurrentUser () {
    this.props.dispatch({
      type: "user/fetchCurrent"
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
      const res = DownloadService.downloadFile(this.state.compileResult.fileaddr)
      console.log(res)
    }
  }

  onRadioChange (e: any) {
    this.setState({
      publicType: e.target.value
    })
  }

  selectProject (value: string) {
    console.log(value)
    let publicType = 0
    let gitList: ProjectCompileGitParams[] = []

    this.state.projectList?.forEach( project => {
      if (project.id == value) {
        publicType = project.publicType
        gitList = project.gitList
      }
    })
    
    const GitMap = {}
    
    if (gitList.length) {
      gitList.map(item => {
        GitMap[item.name] = item.id
      })
      this.setState({
        projectId: value,
        publicType,
        GitMap,
        checkboxOptions: gitList?.map( item => item.name)
      })
    }
    
  }

  onCheckBoxChange (checkedValues: CheckboxValueType[]) {
    const compileStatus = {}
    for ( const key of checkedValues) {
      compileStatus[key as string] = 'waiting'
    }
    this.setState({
      compileGit: checkedValues as string[],
      compileStatus
    })
  }

  onClickCompile () {
    const {compileGit,  description, projectId, publicType} = this.state
    if (!compileGit.length) {
      message.warning("未选择编译git")
      return
    }

    if (!description || !projectId) {
      message.warning("信息描述不完整")
      return
    }
    console.log(compileGit)
    const data = {
      userId: this.props.currentUser?.id,
      projectId,
      publicType,
      description,
      gitIds: [...compileGit.map(item => this.state.GitMap[item])]
    }

    socket.emit("startCompile", data)
    
  }

  reCompile (id: string) {
    const {compileGit,  description, projectId, publicType} = this.state
    if (!compileGit.length) {
      message.warning("未选择编译git")
      return
    }

    if (!description || !projectId) {
      message.warning("信息描述不完整")
      return
    }
    const data = {
      userId: this.props.currentUser?.id,
      projectId,
      publicType,
      description,
      gitIds: [id]
    }
    socket.emit("startCompile", data)
  }


  TextAreaChange (e: any) {
    this.setState({
      description: e.target.value
    })
  }

  returnSpin (status: string, gitId:string): JSX.Element {
    if (status === 'executing') {
      return <Spin style={{marginLeft:10, color:"#55efc4", fontSize:24}}></Spin>
    }
    if (status === 'success') {
      return <CheckCircleFilled style={{marginLeft:10, color:"#55efc4", fontSize:24}} />
    }
    if (status === 'fails') {
      return <> 
        <CloseCircleFilled style={{marginLeft:10, color:"#f40", fontSize:24}}/>
        <Button type="primary" onClick={ () => this.reCompile(gitId)}> 重新编译 </Button>
      </> 
    }
    return <ClockCircleFilled style={{marginLeft:10, color:"#ffeaa7", fontSize:24}}/>
  }

  onPack () {

    const data = {
      // compileId
      // publicType,
      gitIds: [...this.state.compileGit.map(item => this.state.GitMap[item])]
    }

    socket.emit("pack", data)
  }
  render() {
    const publicType = [
      {
        id: 0,
        text: "发布到git"
      },
      {
        id: 1,
        text: "下载"
      },
      {
        id: 3,
        text: "自动"
      }
    ]

    if (!this.state.projectList?.length) {
      return <Spin>正在路上</Spin>
    }
    
    return (
      <div ref={this.boxBottom}>
        <Form
          labelCol={{span:4}}
          wrapperCol={{span:16}}
        >
          <Form.Item 
            label="配置名称"
          >
             <Select onChange={this.selectProject} value={this.state.projectId}> 
                {
                  this.state.projectList?.map( item => {
                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  })
                }
              </Select>
          </Form.Item>

          {
            this.state.projectId && (
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
                  <Checkbox.Group options={this.state.checkboxOptions}  onChange={this.onCheckBoxChange} />
                </Form.Item>

                <Form.Item label="描述">
                  <TextArea rows={6} onChange={this.TextAreaChange}></TextArea>
                </Form.Item>

                <Form.Item label="编译结果" className={styles.tabsForm}>
                  <Tabs tabPosition="left">
                    {
                      this.state.compileGit.map( item => {
                        return (
                          <Tabs.TabPane tab={
                            <span>
                              {item}
                              {
                                this.returnSpin(this.state.compileStatus[item], this.state.GitMap[item])
                              } 
                              
                            </span>} 
                            key={item} >
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
                <Button type="primary" onClick={this.onPack}>打包下载</Button>
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


export default connect( ( {user}: ConnectState) => {
  return {
    currentUser: user.currentUser,
  }
})(withRouter(CompileEdit))