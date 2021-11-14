/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:49
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-14 15:32:16
 */
import util from '@/utils/utils'
import { Button, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { connect, Dispatch } from 'dva'
import React from 'react'
import { IRouteComponentProps, Member, ProjectCompile } from 'umi'
import DownloadService from "@/services/download"
import { Customer } from "@/models/customer"
import { LeftOutlined } from '@ant-design/icons'

interface Props extends IRouteComponentProps< {
  id: string;
}> {
  dispatch: Dispatch;
}
interface States {
  tableLoading: boolean;
  memberList: Member[] | null;
  compileList: ProjectCompile[] | null;
}

class Compilelog extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      memberList: null,
      tableLoading: false,
      compileList: null
    }
  }

  async componentDidMount () {
    const id = this.props.match.params.id
    this.setState({
      tableLoading: true
    })
    await this.props.dispatch({
      type:"project/getMemberList",
      callback: (data: Member[]) => {
        this.setState({
          memberList: data
        })
      }
    })
    await this.props.dispatch({
      type: "project/getCompileInfo",
      payload: id,
      callback: (data: ProjectCompile[]) => { 
        this.setState({
          compileList: data,
          tableLoading: false
        })
      }
    })
  }

  async onDownload(pathName: string) {
    const res = await DownloadService.getDownloadFilePath(pathName)as {status: number, data: string[]}
    if(res.data){
      for (const info of res.data) {
        console.log( info)
        const res = await DownloadService.downloadFile(info)
      }
    }
  }

  render() {

    const UserMap = {}

    this.state.memberList?.map( (item: Member) => {
      UserMap[item.id] = item.name
    })

    const columns : ColumnProps<ProjectCompile>[] =[
      {
        title: '名称',
        dataIndex: 'projectName',
        ellipsis: true,
        width: 100,
        render(text: string, record: ProjectCompile) {
          return record.projectName
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
        title: "使用客户",
        dataIndex: "cusName",
        ellipsis:true
      },
      {
        title: '编译状态',
        dataIndex: "compileResult",
        ellipsis: true,
        render(text: string){
          return (text || "-")
        }
      },
      {
        title: '编译时间',
        dataIndex: "compileTime",
        defaultSortOrder: "descend",
        sortDirections: ['ascend', 'descend'],
        sorter: (a, b) => new Date(a.compileTime).getTime() - new Date(b.compileTime).getTime() ,
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
      },{
        title: "下载",
        dataIndex:"file",
        render: (text: string, record: ProjectCompile)=>{
          return(
            <>
              <Button 
                onClick={this.onDownload.bind(this,record.file)}
              >下载文件</Button>
          </>
          )
        }
      }
    ]
    return (
      <div>
        <div 
        // className={styles.projectPanelTop}
        >
          <a
            onClick={() => {
              this.props.history.goBack();
            }}>
            <LeftOutlined />
            返回
          </a>
        </div>  
        <Table
          columns={columns}
          dataSource={this.state.compileList!}
          rowKey="id"
          loading={this.state.tableLoading}
          pagination={{pageSize: 12, showTotal(totle: number) {
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


export default connect()(Compilelog)