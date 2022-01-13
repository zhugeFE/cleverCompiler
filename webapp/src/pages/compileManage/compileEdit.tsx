/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:55:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-13 17:05:29
 */
import type { ConnectState } from '@/models/connect'
import { Button, Checkbox, Form, message, Radio, Select, Spin, Tabs, Tooltip } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'
import { withRouter } from 'react-router-dom'
import type { CurrentUser, Dispatch, IRouteComponentProps, ProjectCompileGitParams, ProjectCompileParams } from 'umi';
import { connect } from 'umi'
import SocketIO from "socket.io-client"
import styles from "./styles/compileEdit.less"
import util from '@/utils/utils'
import { CheckCircleFilled, ClockCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { download } from '@/utils/download'
import { publicType } from '@/models/common'
import { wsserver } from '../../../config/proxy'

const socket = SocketIO(wsserver.ws, {transports:["websocket"]})

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
  compileResult: string[];
  compileId: string;
  description: string;
  projectList: ProjectCompileParams[] | null;
  compileLog: {};
  compileStatus: {};
  GitMap: {};
  showResult: boolean;
  downloadAddr: string;
}

class CompileEdit extends React.Component<Props, States> {

  compileLogRef: React.RefObject<HTMLDivElement> = React.createRef()
  compileTagRef: React.RefObject<HTMLDivElement> = React.createRef()

  constructor(prop: Props){
    super(prop)
    this.state = {
      publicType: 0,
      projectId: "",
      compileGit: [],
      projectList: null,
      GitMap:{},
      compileId: "",
      compileResult: [],
      description: "",
      checkboxOptions: [],
      compileLog: {},
      compileStatus: {},
      showResult: false,
      downloadAddr: ""
    }
    this.onRadioChange = this.onRadioChange.bind(this)
    this.selectProject = this.selectProject.bind(this)
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this)
    this.onClickCompile = this.onClickCompile.bind(this)
    this.TextAreaChange = this.TextAreaChange.bind(this)
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
      compileStatus[data.gitName]= data.message.toString()
      this.setState({
        compileStatus
      })
    })
    socket.on("compileInfo", (data) => {
      this.setState({
        compileId: data.message.toString()
      })
    })
    socket.on("download", (data) => {
      this.setState({
        downloadAddr: data.message.toString()
      })
    })
    socket.on("result", (data) =>{
      const compileResult = util.clone(this.state.compileResult)
      compileResult.push(data.message.toString())
      this.setState({
        compileResult,
      })
    })
  }

  scrollToCompileView () {
    this.compileLogRef.current?.scrollTo(0,this.compileLogRef.current.scrollHeight)
  }

  scrollToCompileTagView () {
    this.compileTagRef.current?.scroll(0, this.compileTagRef.current.scrollHeight)
  }

  componentDidUpdate () {
    this.scrollToCompileView()
    this.scrollToCompileTagView()
  }

  componentDidMount () {
    const id: string = this.props.location.query.id as string
    this.initSocket()
    this.getProjectInfo()
    this.getCurrentUser()
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
  onRadioChange (e: any) {
    this.setState({
      publicType: e.target.value
    })
  }

  selectProject (value: string) {
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
        description: "",
        compileLog: [],
        compileStatus:[],
        compileGit:[],
        compileResult: [],
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

  onDownLoad () {
    let name
    this.state.projectList?.forEach(item => {
      if (item.id == this.state.projectId) {
        name = item.name
      }
    })
    if (name) {
      download(this.state.downloadAddr, name)
    }
  }

  TextAreaChange (e: any) {
    this.setState({
      description: e.target.value
    })
  }

  returnSpin (status: string, gitId: string): JSX.Element {
    if (status === 'executing') {
      return <Spin style={{marginLeft:10, color:"#55efc4", fontSize:24}} />
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
      userId: this.props.currentUser?.id,
      projectId: this.state.projectId,
      compileId: this.state.compileId,
      publicType: this.state.publicType,
      gitIds: [...this.state.compileGit.map(item => this.state.GitMap[item])]
    }

    socket.emit("pack", data)
  }
  render() {
    if (!this.state.projectList) {
      return <Spin>正在路上</Spin>
    }
    
    return (
      <div className={styles.compileEditPanel}>
        <Form
          labelCol={{span:4}}
          wrapperCol={{span:16}}
        >
          <Form.Item 
            label="配置名称"
          >
             <Select onChange={this.selectProject} value={this.state.projectId} showSearch> 
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
                        return <Radio key={item.value} value={item.value}>{item.text}</Radio>
                      })
                    }
                  </Radio.Group>

                </Form.Item>

                <Form.Item label="要编译的项目">
                  <Checkbox.Group value={this.state.compileGit} options={this.state.checkboxOptions}  onChange={this.onCheckBoxChange} />
                </Form.Item>

                <Form.Item label="描述">
                  <TextArea rows={5} value={this.state.description} onChange={this.TextAreaChange} />
                </Form.Item>

                <Form.Item label="编译结果" className={styles.tabsForm}>
                 {
                  !this.state.compileGit.length ? (
                    <div className={styles.tarResult}>暂未开始编译</div>) : 
                    <Tabs tabPosition="left">
                      {
                        this.state.compileGit.map( item => {
                          return (
                            <Tabs.TabPane 
                              tab={
                                <span>
                                  {item}
                                  {
                                    this.returnSpin(this.state.compileStatus[item], this.state.GitMap[item])
                                  } 
                                </span>} 
                              key={item} 
                              >
                              <div ref={this.compileLogRef}  className={styles.tabpaneContent}>
                                {
                                  this.state.compileLog[item] ?
                                  this.state.compileLog[item].map((item: { message: string}, index: number) => <p key={index}>{item.message}</p>)
                                  : `${item} 等待编译`
                                }
                              </div>
                            </Tabs.TabPane>
                          )
                        })
                      }
                    </Tabs>
                 }
                </Form.Item>
                <Form.Item label="打包结果 || 发布结果">
                  <div className={styles.tarResult} ref={this.compileTagRef}>
                    {
                      this.state.compileResult.length ?
                      this.state.compileResult.map((item,index) => <p key={index}>{item}</p>)
                      : "暂未开始打包或发布"
                    }
                  </div>
                </Form.Item>
                <Form.Item label="操作">
                  <Button type="primary" style={{marginRight:10}} onClick={this.onClickCompile}>编译</Button>
                  {/* <Button type="primary"  style={{marginRight:10}} onClick={this.onPack}>打包</Button> */}
                  {
                    this.state.downloadAddr && 
                    <Tooltip title={`${location.host}/api/download?filePath=${this.state.downloadAddr}`}>
                      <Button    
                        onClick={ () => this.onDownLoad()}
                      >
                        下载
                      </Button> 
                    </Tooltip>
                    
                  }

                </Form.Item>
              </>
            )
          }
        </Form>        
      </div>
    )
  }
}


export default connect( ( {user}: ConnectState) => {
  return {
    currentUser: user.currentUser,
  }
})(withRouter(CompileEdit))