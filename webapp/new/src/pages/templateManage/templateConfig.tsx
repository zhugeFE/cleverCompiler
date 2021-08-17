/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-09 17:29:16
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-17 18:37:22
 */
import * as React from 'react'
import styles from './styles/templateConfig.less'
import { Select, Table, Tabs } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { connect } from 'dva'
import { Dispatch } from '@/.umi/plugin-dva/connect'
import {  ConfigInstance, TemplateConfig, TemplateGlobalConfig, TemplateVersion, TemplateVersionGit, UpdateConfigParam } from '@/models/template'
import util from '@/utils/utils'
const { TabPane } = Tabs;
const { Option } = Select

const initialPanes = [
  { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
];


export interface ConfigPanelProps {
  comConfig: TemplateGlobalConfig[] | null;
  gitList: TemplateVersionGit[] | null;
  afterChangeConfig?(data: ConfigInstance): void;
  afterDelVersion? (data: any):void;
  dispatch: Dispatch;
}
interface State {
  activeKey: string
  comConfigDict: {};
  columns: ColumnProps<ConfigInstance>[]
}
class GitConfigPanel extends React.Component<ConfigPanelProps, State> {
   constructor (props: ConfigPanelProps) {
    super(props)
    const that = this
    this.state = {
      comConfigDict:{},
      activeKey: props.gitList?[0].id! ,
      columns: [ 
        // {title: '名称', dataIndex: 'name' , fixed: 'left'},
        {title: '文件位置', width:150,ellipsis:true, dataIndex: 'filePath',fixed: 'left'},
        {title: '默认值', width:300 , ellipsis:true, render(record: ConfigInstance){
          return(
            <div style={{display:'flex',justifyContent:'space-between'}}>
              {record.value || record.sourceValue}
              <Select 
                defaultValue={that.state.comConfigDict[record.globalConfigId]}
                style={{width:'100px'}} 
                onChange={that.onChangeConfig.bind(that,record,"globalConfig")}>
                {
                  that.props.comConfig!.map(item=>
                    <Option 
                    
                    value={item.id} 
                    key={item.id} 
                    title={item.name}
                    >{item.name}</Option>
                  )
                }
              </Select>
            </div>
          )
        }},
        {title: '描述', width:100 , dataIndex: 'description'},
        {title: '类型', width:60, dataIndex: 'typeId', render (value){
          if(value === 0 ) return <span>文本</span>
          if(value === 1 ) return <span>文件替换</span>
          if(value === 2 ) return <span>json</span>
        }},
        {title: '匹配规则', width:200, ellipsis:true, dataIndex: 'reg', render (value) {
          if (!value) return <span>-</span>
          const val = JSON.parse(value)
          const reg = new RegExp(val.source, `${val.global ? 'g' : ''}${val.ignoreCase ? 'i' : ''}`)
          return (
            <span>{reg.toString()}</span>
          )
        }},
        {title: '操作', fixed:"right", render (value: any, record: ConfigInstance) {
          return (
            <div>
              <a onClick={that.onConfigEdit.bind(that,record.id)}>编辑</a>
              <a style={{marginLeft:"5px",color:record.isHidden?"rgba(0,0,0,0,.5)":""}} onClick={that.onChangeConfig.bind(that, record,'hidden')}>{record.isHidden?"启用":"隐藏"}</a>
            </div>
          )
        }}
      ]
    }
    this.onChange = this.onChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.remove = this.remove.bind(this);
  }

  
  onChange (activeKey: string) {
    if(this.props.onChange){
      this.props.onChange(activeKey)
    }
  }

  componentWillMount(){
    var data = {}
    this.props.comConfig?.map(item=>{data[item.id] = item.name})
    
    this.setState({
      comConfigDict: data
    })
    setTimeout(()=>{
      console.log(this.state.comConfigDict)
    },0)
  }

  onEdit (targetKey:any, action:any) {
    this[action](targetKey);
  }

  add = () => {
    if(this.props.onClick){this.props.onClick()}
  }

  remove(targetKey: string){
    this.props.dispatch({
      type:"template/delVersionGit",
      payload:targetKey,
      callback:(data: TemplateVersion)=>{
        if(this.props.afterDelVersion)this.props.afterDelVersion({...data , id: targetKey})
      }
    })
  }
  onChangeConfig(config: ConfigInstance , type: string, value: any,){
    console.log(type)
    const data = util.clone(config)
    switch (type){
      case "globalConfig": {
        data.globalConfigId = value;
        break;
      }
      case "hidden": {
        data.isHidden = Number(!data.isHidden)
      }
    }
    this.props.dispatch({
      type: "template/updateConfig",
      payload: {
        id: data.id,
        defaultValue: data.value,
        isHidden: data.isHidden,
        globalConfigId: data.globalConfigId
      } as UpdateConfigParam,
      callback: () => {
        if(this.props.afterChangeConfig){this.props.afterChangeConfig(data)}
      }
    })
  }

  onConfigEdit (id: string) {
    console.log(id)
  }

  render () {
    const { columns} = this.state
    const gitList = this.props.gitList
    return (
      
      <div className={styles.templateConfigPanel}>
        {
          this.props.currentVersioinGit ?(
            <Tabs
              type="editable-card"
              onChange={this.onChange}
              activeKey={this.props.currentVersioinGit.id}
              onEdit={this.onEdit}
            >
              {gitList!.map(item => (
                <TabPane tab={item.name} key={item.id}>
                  <Table
                    columns={columns}
                    dataSource={item.configList}
                    pagination={{pageSize: 3, showTotal(totle: number) {
                      return (
                        `总记录数${totle}`
                      )
                    }}}
                  >

                  </Table>
                </TabPane>
              ))}
            </Tabs>
          ):(
            <Tabs
              type="editable-card"
              onChange={this.onChange}
              activeKey={initialPanes[0].key}
              onEdit={this.onEdit}
            >
              {initialPanes.map(item => (
                <TabPane tab={item.title} key={item.key}>
                  <Table
                    columns={columns}
                  >
                  </Table>
                </TabPane>
              ))}
            </Tabs>
          )
        }
        
      </div>
    )
  }
}
export default connect()(GitConfigPanel)