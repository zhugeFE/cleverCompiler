/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:49
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-13 17:07:12
 */
import util from '@/utils/utils'
import { Button, Table, Tooltip } from 'antd'
import type { ColumnProps } from 'antd/lib/table'
import type { Dispatch } from 'dva';
import { connect } from 'dva'
import React from 'react'
import type { IRouteComponentProps, Member, ProjectCompile } from 'umi'
import { LeftOutlined } from '@ant-design/icons'
import { download } from '@/utils/download'

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

  render() {

    const UserMap = {}

    this.state.memberList?.map( (item: Member) => {
      UserMap[item.id] = item.name
    })

    const columns: ColumnProps<ProjectCompile>[] =[
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
          return (
            record.file ? 
            <Tooltip title={`${location.host}/api/download?filePath=${record.file}`}>
              <Button onClick={()=>download(record.file, record.projectName)}>下载</Button> 
            </Tooltip> : "-"
          )
        }
      }
    ]
    return (
      <div>
        <div>
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
         />
      </div>
    )
  }
}


export default connect()(Compilelog)