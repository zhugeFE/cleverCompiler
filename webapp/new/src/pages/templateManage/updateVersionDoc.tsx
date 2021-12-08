/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-24 14:23:33
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-08 19:42:28
 */

import { LeftOutlined, PlusOutlined, MinusOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { IRouteComponentProps } from "@umijs/renderer-react";
import { Drawer, Modal, Select, Tabs } from "antd";
import React from "react";
import { connect, Dispatch } from "umi";
import style from "./styles/updateVersion.less";
import {TemplateVersionGitUpdateInfo, TemplateVersionUpdateInfo, updateTag} from "@/models/template";
import util from "@/utils/utils";
import * as ReactMarkdown from 'react-markdown'

interface Props extends IRouteComponentProps <{
  id: string;
}>{
  dispatch: Dispatch
}

interface State {
  updateInfo: TemplateVersionUpdateInfo[] | null;
  leftGitList: TemplateVersionGitUpdateInfo[];
  rightGitList: TemplateVersionGitUpdateInfo[];
  currentGit: TemplateVersionGitUpdateInfo | null;
}


class UpdateVersionDoc extends React.Component <Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      updateInfo: null,
      leftGitList: [],
      rightGitList: [],
      currentGit: null
    }
    this.onLeftSelect = this.onLeftSelect.bind(this)
    this.onRightSelect = this.onRightSelect.bind(this)
    this.onCloseDrawer = this.onCloseDrawer.bind(this)
  }

  componentDidMount () {
    this.getVersionUpdateInfo(this.props.match.params.id)
  }

  onLeftSelect (value: string) {
    this.setState({
      leftGitList: this.queryGetlistByGitId(value)
    })
  }
  queryGetlistByGitId (value: string): TemplateVersionGitUpdateInfo[]  {
    let gitList: TemplateVersionGitUpdateInfo[] = []
    const data =  util.clone(this.state.updateInfo)
    if (!data) return []    
    for (const item of data) {
      if (item.id == value) {
        gitList =  item.gitInfo
        break
      }
    }
    return gitList
  }
  onRightSelect (value: string) {
    const data = this.queryGetlistByGitId(value)
    
    const leftGitNameList = this.state.leftGitList.map(item => item.name)
    data.map( (right,index) => {
      if (!leftGitNameList.includes(right.name)){
        const git = data.splice(index,1)[0]
        git['tag'] = updateTag.add
        git['updateDoc'] += "# 此git为新增\n" 
        data.push(git)
      } else {
        this.state.leftGitList.map(left => {
          const leftVersion = Number(left.version.split(".").join(""))
          const rightVersion = Number(right.version.split(".").join(""))
  
          if ( left.name == right.name && leftVersion == rightVersion) {
            right['tag'] = updateTag.normal
          }
          if (left.name == right.name && leftVersion < rightVersion) {
            
            right['tag'] = updateTag.up
            let flag = 0
            for( const version of right.historyVersion) {              
              if (version.version == right.version){
                flag = 0
              }
              if (flag) {                
                right['updateDoc'] = `${right['updateDoc']}\n${version['updateDoc']}` 
                right['buildDoc'] = `${right['buildDoc']}\n${version['buildDoc']}`
              }
              if (version.version == left.version){
                flag = 1
              }
            }
            
          }
          if (left.name == right.name && leftVersion > rightVersion) {
            right['tag'] = updateTag.down
          }
        })
      }
    })
    if (data.length < this.state.leftGitList.length) {
      const rightGitNameList = data.map(item => item.name)
      this.state.leftGitList.map((left,index) => {
        if (!rightGitNameList.includes(left.name)) {
          data.splice(index,0,{
            name: left.name,
            version: left.version,
            description: left.description,
            updateDoc: "# 此git已移除\n" + left.updateDoc,
            publishTime: left.publishTime,
            buildDoc: "# 此git 已移除\n" + left.buildDoc,
            gitSourceBranchId: left.gitSourceBranchId,
            historyVersion: left.historyVersion,
            branchName: left.branchName,
            tag: updateTag.del
          })
        }
      })
    }
    this.setState({
      rightGitList: data
    })
  }
  getVersionUpdateInfo (id: string) {
    this.props.dispatch({
      type: "template/getVersionUpdateInfo",
      payload: id,
      callback: (data: TemplateVersionUpdateInfo[]) => {        
        let gitList: TemplateVersionGitUpdateInfo[] = []
        for (const item of data) {
          if (item.id == this.props.location.query.vid) {
            gitList =  item.gitInfo
            break
          }
        }
        this.setState({
          updateInfo: data,
          leftGitList: gitList
        })
      }
    })
  }
  // checkGitItem (git: TemplateVersionGitUpdateInfo) {
  //   Modal.info({
  //     title: `${git.name}-${git.branchName}-${git.version} 更新信息`,
  //     content:(
  //       <div>
  //         <p>{`更新时间：${new Date(git.publishTime).toLocaleDateString()}`}</p>
  //         <ReactMarkdown children={git.updateDoc}></ReactMarkdown>
  //       </div>
  //     ),
  //     onOk(){}
  //   })
  // }
  onOpenDrawer (git: TemplateVersionGitUpdateInfo) {
    this.setState({
      currentGit: git
    })
  }
  onCloseDrawer () {
    this.setState({
      currentGit: null
    })
  }
  render () {
    return (
      <div className={style.updateVersionPanel}>
        <div className={style.goback}>
          <a onClick={() => {this.props.history.goBack()}}><LeftOutlined/>返回</a>
        </div>
        <div className={style.container}>
          <div className={style.content}>
            <div className={style.selectBox}>
              <Select 
                size="large"
                defaultValue={this.props.location.query.vid as string}
                onChange={this.onLeftSelect}
                style={{width:"100%"}}
                >
                {
                  this.state.updateInfo?.map( item => {
                    return (
                      <Select.Option value={item.id} key={item.id}>
                        {item.name}-{item.version}
                        <div className={style.versionDesc}>{item.description}</div>
                      </Select.Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className={style.gitList}>
              {
                this.state.leftGitList.map((git,index) => {
                  return (
                    <div
                      onClick={()=>this.onOpenDrawer(git)}
                      key={git.gitSourceBranchId} 
                      className={style.gitItem}>
                      <span>【{index}】 {git.name} - {git.branchName} - {git.version}</span>
                    </div>
                  )
                })
              }

            </div>
          </div>
          <div className={style.content}>
            <div className={style.selectBox}>
              <Select 
                size="large"
                placeholder="请选择需要对比的版本"
                onChange={this.onRightSelect}
                style={{width:"100%"}}
                >
                {
                  this.state.updateInfo?.map( item => {
                    return (
                      <Select.Option value={item.id} key={item.id} >
                        {item.name}-{item.version}
                        <div className={style.versionDesc}>{item.description}</div>
                      </Select.Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className={style.gitList}>
              {
                this.state.rightGitList.map((git,index)=> {
                  return (
                    <div
                      onClick={()=>this.onOpenDrawer(git)} 
                      key={git.gitSourceBranchId}
                      className={style.gitItem}>
                      <span>【{index}】 {git.name} - {git.branchName} - {git.version}</span>
                      {
                        git.tag == updateTag.up && <ArrowUpOutlined style={{color:"green",fontSize:"24px"}}/>
                      }
                      {
                        git.tag == updateTag.down && <ArrowDownOutlined style={{color:"red",fontSize:"24px"}}/>
                      }
                      {
                        git.tag == updateTag.add && <PlusOutlined style={{color:"green",fontSize:"24px"}}/>
                      }
                      {
                        git.tag == updateTag.del && <MinusOutlined style={{color:"red",fontSize:"24px"}}/>
                      }
                    </div>   
                  )
                })
              }
            </div>
          </div>
        </div>
        <Drawer
          title="模版更新对比"
          placement="right"
          width="35%"
          closable={false}
          onClose={this.onCloseDrawer}
          visible={!!this.state.currentGit}
        >
         {
           this.state.currentGit && <p>{`更新时间：${new Date(this.state.currentGit.publishTime).toLocaleDateString()}`}</p>
         }
          <Tabs>
              <Tabs.TabPane tab="更新文档" tabKey="0" key="0">
                {
                  this.state.currentGit && (
                    <div>
                      <ReactMarkdown children={this.state.currentGit.updateDoc}></ReactMarkdown>
                    </div>
                  )
                }
              </Tabs.TabPane>
              <Tabs.TabPane tab="部署文档" tabKey="1" key="1">
                {
                  this.state.currentGit && (
                    <div>
                      <ReactMarkdown children={this.state.currentGit.buildDoc}></ReactMarkdown>
                    </div>
                  )
                }
              </Tabs.TabPane>
          </Tabs>
         
        </Drawer>
      </div>
    )
  }
}

export default connect()(UpdateVersionDoc)