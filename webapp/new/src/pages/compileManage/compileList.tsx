/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:49
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-13 00:56:20
 */
import { ConnectState } from '@/models/connect'
import util from '@/utils/utils'
import { Button, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { connect, Dispatch } from 'dva'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { IRouteComponentProps, Member, ProjectCompile } from 'umi'

interface Props extends IRouteComponentProps<{

}>{
  memberList: Member[] | null;
  compileList: ProjectCompile[];
  dispatch: Dispatch;
}
interface States {

}

class CompileList extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.navigationToEdit = this.navigationToEdit.bind(this)
  }

  async componentDidMount () {
    await this.props.dispatch({
      type: "compile/getCompileList"
    })
    await this.props.dispatch({
      type:"project/getMemberList"
    })
  }


  navigationToEdit () {
    this.props.history.push('/compile/edit')
  }
  render() {

    const UserMap = {}

    this.props.memberList?.map( item => {
      UserMap[item.id] = item.name
    })

    const columns : ColumnProps<ProjectCompile>[] =[
      {
        title: '名称',
        dataIndex: 'name',
        ellipsis: true,
        width: 100,
        render(text: string) {
          return text
        }
      },
      {
        title: '描述',
        dataIndex: "description",
        ellipsis: true,
        render(text: string) {
          return (text || "-")
        }
      },
      {
        title: '编译状态',
        dataIndex: "compileResult",
        render(text: string){
          return (text || "-")
        }
      },
      {
        title: '编译时间',
        dataIndex: "compileTime",
        render(text: Date){
          return (util.dateTimeFormat(new Date(text)) || "-")
        }
      },
      {
        title: "编译者",
        dataIndex: "compileUser",
        render(text: string){
          return ( UserMap[text] || "-")
        }
      }
    ]
    console.log(this.props.compileList)
    return (
      <div>
        <Button type="primary" size="large" onClick={this.navigationToEdit}>新建编译</Button>
        <Table
          columns={columns}
          dataSource={this.props.compileList}
          rowKey="id"
          pagination={{pageSize: 5, showTotal(totle: number) {
            return (
              `总记录数${totle}`
            )
          }}}
        >
          
        </Table>
      </div>
    )
  }
}


export default connect( ({compile, project}:ConnectState) => {
  return {
    memberList: project.memberList,
    compileList: compile.compileList || []
  }
})(withRouter(CompileList))