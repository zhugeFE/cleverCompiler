/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:19
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-30 14:40:32
 */
import type { ConnectState } from '@/models/connect';
import type { ProjectInstance } from '@/models/project';
import util from '@/utils/utils';
import { Button, Form, Input, Table } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import React from 'react';
import type { CurrentUser } from '@/models/user';
import { withRouter } from 'react-router-dom';
import type { Dispatch, IRouteComponentProps } from 'umi';
import styles from "./styles/projectList.less";

interface Props extends IRouteComponentProps{
  currentUser: CurrentUser | null;
  projectList: ProjectInstance[] | null;
  dispatch: Dispatch;
}

interface States {
  form: {
    projectName: string;
    compileType: string;
  },
  searchVaild: boolean;
  selectedRowKeys: string[];
}

class ProjectList extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      form: {
        projectName: "",
        compileType: ""
      },
      searchVaild: true,
      selectedRowKeys: []
    }
    this.onCreateProject = this.onCreateProject.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onClickCompileLog = this.onClickCompileLog.bind(this)
  }

  componentDidMount () {
    this.getProjectList()
  }

  getProjectList () {
    this.props.dispatch({
      type: "project/getProjectList",
    })
  }
  
  onClickEdit (project: ProjectInstance) {
    this.props.history.push(`/compile/project/edit/${project.id}`)
  }

  onClickCompile (project: ProjectInstance) {
    this.props.history.push(`/compile/compileEdit?id=${project.id}`)
  }

  onClickUpdateEntry (project: ProjectInstance){
    this.props.history.push(`/manage/template/updateInfo/${project.templateId}?vid=${project.templateVersion}&source=${project.id}`)
  }

  onCreateProject () {
    this.props.history.push("/compile/project/edit/addProject?mode=add")
  }

  onClickCompileLog (project: ProjectInstance) {
    // 编译日志/compile/projec/{id}/log
    this.props.history.push(`/compile/project/${project.id}/log`)
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
      try {
        return new RegExp(formData.projectName , 'i').test(item.name) && new RegExp(formData.compileType, 'i').test(compileType[item.compileType])
      }
      catch (err) {
        
      }
    }) 
    const columns: ColumnProps<ProjectInstance>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        fixed: 'left',
        ellipsis:true,
        render(text: string, record: ProjectInstance) {
          return text || '-' || record.name
        },
      },
      {
        title: '编译类型',
        dataIndex: 'compileType',
        render(text: string) {
          return compileType[Number(text)] || '-' 
        },
      },
      {
        title: '上次编译时间',
        dataIndex: 'lastCompileTime',
        ellipsis: true,
        render(text: string) {
          return text ? util.dateTimeFormat(new Date(text)) : '-'
        },
      },
      {
        title: '上次编译结果',
        ellipsis: true,
        dataIndex: 'lastCompileResult',
        render(text: string, record: ProjectInstance) {
          return text || '-' || record.lastCompileResult
        },
      },
      {
        title: '上次编译人',
        ellipsis: true,
        dataIndex: 'compileUser',
        render(text: string, record: ProjectInstance) {
          return text || '-' || record.lastCompileUser
        },
      },
      {
        title: '创建时间',
        ellipsis: true,
        dataIndex: 'createTime',
        render(text: string) {
          return util.dateTimeFormat(new Date(text)) || '-'
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        width: "40%",
        fixed: 'right',
        render: (text, record: ProjectInstance) => {
          return (
            <div>
              <Button style={{marginRight: 5}} onClick={this.onClickCompile.bind(this, record)}>
                编译
              </Button>
              <Button 
                type="ghost"
                style={{marginRight: 5}}
                onClick={this.onClickUpdateEntry.bind(this, record)}>升级</Button>
              <Button 
                type="primary" 
                style={{marginRight: 5}}
                onClick={this.onClickCompileLog.bind(this, record)}>编译记录</Button>
              <Button 
                type="primary" 
                style={{marginRight: 5}}
                onClick={this.onClickEdit.bind(this, record)}>{this.props.currentUser?.id == record.creatorId ? "编辑" : "查看"}</Button>
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
              <Input autoComplete="off"/>
            </Form.Item>
            <Form.Item label="编译类型" name="compileType">
              <Input autoComplete="off"/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.onCreateProject}>新建项目</Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={showList}
          pagination={{
            showTotal(totle: number) {
              return `总记录数${totle}`;
            },
          }}
        />
      </div>
    )
  }
}


export default connect( ( { project, user }: ConnectState) => {
  return {
    projectList: project.projectList,
    currentUser: user.currentUser,
  }
})(withRouter(ProjectList))