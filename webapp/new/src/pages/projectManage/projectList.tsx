/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:19
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-19 15:06:26
 */
import { ConnectState } from '@/models/connect';
import { ProjectInstance } from '@/models/project';
import util from '@/utils/utils';
import { Button, Form, Input, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Dispatch, IRouteComponentProps } from 'umi';
import styles from "./styles/projectList.less";

interface Props extends IRouteComponentProps<{
  
}>{
  projectList: ProjectInstance[] | null;
  dispatch: Dispatch;
}
interface States {
  form: {
    projectName: string;
    compileType: string;
  },
  searchVaild: boolean;
}

class ProjectList extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      form: {
        projectName: "",
        compileType: ""
      },
      searchVaild: true
    }
    this.onClickAddProject = this.onClickAddProject.bind(this)
    this.navigationToEdit = this.navigationToEdit.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  componentDidMount () {
    this.props.dispatch({
      type: "project/getProjectList"
    })
  }

  componentWillReceiveProps(props:any){
    console.log(props)
  }

  onClickAddProject () {
    this.props.history.push("/compile/project/edit/addProject?mode=add")
  }

  navigationToEdit (id:string) {
    this.props.history.push(`/compile/edit?id=${id}`)
  }
  //项目编辑
  onClickEdit(data: ProjectInstance, type: string){
    switch (type) {
      case "edit": {
        // console.log(data)
        this.navigationToEdit(data.id)
        break
      }
      case "info": {
        // console.log(`compile/edit/${data.id}`)
        this.props.history.push(`/compile/project/edit/${data.id}?mode=info`)
        // console.log(data)
      }
    }
    
  }

  onSearch (changedValues: any , values: any) {
    // 防抖处理 300ms
    if ( !this.state.searchVaild ) {
      return 
    } 
    this.setState({
      searchVaild: false
    })
    setTimeout(() => {
      this.setState({
        searchVaild: true,
        form: {
          ...this.state.form,
          ...values
        }
      })
    }, 300)
  }

  render() {

    const compileType = ['私有部署','常规迭代','发布测试']
    const formData = this.state.form
    const showList = this.props.projectList?.filter(item => {
      return new RegExp(formData.projectName , 'i').test(item.name) && new RegExp(formData.compileType, 'i').test(compileType[item.compileType])
    }) 
    const columns: ColumnProps<ProjectInstance>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        fixed: 'left',
        ellipsis:true,
        width: 100,
        render(text: string, record: ProjectInstance) {
          return <div> {text || '-' || record.name} </div>;
        },
      },
      {
        title: '编译类型',
        dataIndex: 'compileType',
        width: 100,
        render(text: string) {
          return <div> {compileType[Number(text)] || '-' } </div>;
        },
      },
      {
        title: '上次编译时间',
        dataIndex: 'lastCompileTime',
        width: 150,
        render(text: string, record: ProjectInstance) {
          return <div> { util.dateTimeFormat(new Date(text)) || '-'} </div>;
        },
      },
      {
        title: '上次编译结果',
        width: 150,
        dataIndex: 'lastCompileResult',
        render(text: string, record: ProjectInstance) {
          return <div> {text || '-' || record.lastCompileResult} </div>;
        },
      },
      {
        title: '上次编译人',
        width: 150,
        dataIndex: 'compileUser',
        render(text: string, record: ProjectInstance) {
          return <div> {text || '-' || record.lastCompileUser} </div>;
        },
      },
      {
        title: '创建时间',
        width: 150,
        dataIndex: 'createTime',
        render(text: string) {
          return <div> {util.dateTimeFormat(new Date(text)) || '-'} </div>;
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        width: 80,
        fixed: 'right',
        render: (text, record: ProjectInstance) => {
          return (
            <div>
              <a  onClick={this.onClickEdit.bind(this, record, "edit")}>
                编译
              </a>
              
              <a style={{marginLeft: "5px"}}  onClick={this.onClickEdit.bind(this, record, "info")}>
                详情
              </a>
            </div>
          );
        },
      },
    ]; 
    return (
      <div className={styles.projectListPanel}>
        <div className={styles.projectTopTool}> 
          <Form layout="inline" onValuesChange={this.onSearch}>
            <Form.Item label="项目名称" name="projectName">
              <Input/>
            </Form.Item>
            <Form.Item label="编译类型" name="compileType">
              <Input/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.onClickAddProject}>新建项目</Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={showList}
          pagination={{
            pageSize: 10,
            showTotal(totle: number) {
              return `总记录数${totle}`;
            },
          }}
        />
      </div>
    )
  }
}


export default connect( ( { project } : ConnectState) => {
  return {
    projectList: project.projectList
  }
})(withRouter(ProjectList))