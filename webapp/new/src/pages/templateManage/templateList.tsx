/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-06 19:09:50
 */
import { Table , Button} from 'antd'
import { connect } from 'dva'
import React from 'react'
import styles from './styles/templateList.less'
import { ColumnProps } from "antd/lib/table"
import CreateTemplate from "./createTemplate"
import { TemplateInstance } from '@/models/template';
import { Dispatch, IRouteComponentProps } from "umi"
import { ConnectState } from '@/models/connect'
import { withRouter } from 'react-router'

interface State {
  form: {
    name: string,
  },
  showAddModal : boolean
}

export interface TemplateListProps extends IRouteComponentProps{
  templateList: TemplateInstance[];
  dispatch: Dispatch;
}


class TemplateList extends React.Component<TemplateListProps, State> {
  constructor (prop: TemplateListProps) {
    super(prop)
    this.state = {
      form: {
        name: ""
      },
      showAddModal : false
    }
    this.onClickAdd = this.onClickAdd.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onCommit = this.onCommit.bind(this)
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'template/query'
    })
  }


  onClickAdd () {
    this.setState({
      showAddModal : true
    })
  }

  onCancel () {
    this.setState({
      showAddModal : false
    })
  }

  onCommit () {
    this.setState({
      showAddModal : false
    })
    this.props.dispatch({
      type: 'template/query'
    })
  }



  render () {
    const columns:ColumnProps<TemplateInstance>[] = [
      {
        title:"名称",
        dataIndex:"name",
        fixed:"left",
        width:300,
        render (text:string , record:TemplateInstance){
          return (
            <div> { text ||  "-" || record.name }</div>
          )
        }
      },
      {
        title:"最新版本号",
        dataIndex:"version",
        render(text:string){
          return(
            text || "-"
          )
        }
      },
      {
        title:"更新时间",
        dataIndex:"time",
        render(text:string){
          return(
            text || "-"
          )
        }
      },
      {
        title:"使用文档",
        dataIndex:"readmeDoc",
        render(text:string){
          return(
            <a>{text || "-"}</a>
          )
        }
      },
      {
        title:"部署文档",
        dataIndex:"buildDoc",
        render(text:string){
          return(
            <a>{text || "-"}</a>
          )
        }
      },
      {
        title:"操作",
        dataIndex:"handle",
        fixed:"right",
        render:()=>{
          return(
            <div>
              <a style={{marginRight:5}}>编辑</a>
              <a >禁用</a>
            </div>
          ) 
        }
      }
    ]
    // const formData = this.state.form
    // const showList = this.props.templateList.filter(item => {
    //   return new RegExp(formData.name, 'i').test(item.name)
    // })
    return (
      <div className={styles.main}>
        
        <div>
          <div className={styles.topButtons}>
            <Button type="primary" onClick={this.onClickAdd}>新建模板</Button>
          </div>
          <Table className={styles.tablePanel}
            rowKey="id"
            columns={columns} 
            dataSource={this.props.templateList}
            pagination={{pageSize: 5, showTotal(totle: number) {
              return (
                `总记录数${totle}`
              )
            }}}
          ></Table>
        </div>
        {
          this.state.showAddModal ? (
            <CreateTemplate showAddModal={this.state.showAddModal} onCancel={this.onCancel} onCommit={this.onCommit}></CreateTemplate>
          ) :null
        }
      </div>
    )
  }
}

export default connect(({template}: ConnectState) => {
  return {
    templateList: template.templateList
  }
})(withRouter(TemplateList))