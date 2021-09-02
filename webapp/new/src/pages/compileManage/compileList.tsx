/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:49
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-01 12:05:53
 */
import util from '@/utils/utils'
import { Button, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { IRouteComponentProps, ProjectCompile } from 'umi'
import IO from "socket.io-client"

const socket = IO('/socket') // 定义socket

interface Props extends IRouteComponentProps{

}
interface States {

}

class CompileList extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.navigationToEdit = this.navigationToEdit.bind(this)
  }

  componentDidMount () {
    this.socket()
  }

  socket () {
    socket.on('message', (data)=>{
      console.log(data)
    })
  }

  navigationToEdit () {
    this.props.history.push('/compile/edit')
  }
  render() {
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
          return (util.dateTimeFormat(text) || "-")
        }
      },
      {
        title: "编译者",
        dataIndex: "compileUser",
        render(text: string){
          return (text || "-")
        }
      }
    ]
    return (
      <div>
        <Button type="primary" size="large" onClick={this.navigationToEdit}>新建编译</Button>
        <Table
          columns={columns}
        >
          
        </Table>
      </div>
    )
  }
}


export default withRouter(CompileList)