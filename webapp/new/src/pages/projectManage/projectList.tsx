/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:19
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-26 18:46:22
 */
import { ProjectInstance } from '@/models/project';
import { Button, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouteComponentProps } from 'umi';
import styles from "./styles/projectList.less";

interface Props extends IRouteComponentProps{

}
interface States {
}

class ProjectList extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
    }
    this.onClickAddProject = this.onClickAddProject.bind(this)
  }


  onClickAddProject () {
    this.props.history.push("/compile/project/edit/addProject")
  }

  //项目编辑
  onClickEdit(data: ProjectInstance, type: string){
    switch (type) {
      case "edit": {
        break
      }
      case "info": {
        console.log("info")
        console.log(data)
      }
    }
    
  }

  render() {
    const columns: ColumnProps<ProjectInstance>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        fixed: 'left',
        width: 150,
        render(text: string, record: ProjectInstance) {
          return <div> {text || '-' || record.name} </div>;
        },
      },
      {
        title: '编译类型',
        dataIndex: 'compileType',
        width: 200,
        render(text: string, record: ProjectInstance) {
          return <div> {text || '-' || record.compileType} </div>;
        },
      },
      {
        title: '上次编译时间',
        dataIndex: 'lastCompileTime',
        width: 150,
        render(text: string, record: ProjectInstance) {
          return <div> {text || '-' || record.lastCompileTime} </div>;
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
        dataIndex: 'lastCompileUser',
        render(text: string, record: ProjectInstance) {
          return <div> {text || '-' || record.lastCompileUser} </div>;
        },
      },
      {
        title: '创建时间',
        width: 150,
        dataIndex: 'createTime',
        render(text: string, record: ProjectInstance) {
          return <div> {text || '-' || record.createTime} </div>;
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
                删除
              </a>
              <a href="">
                操作记录
              </a>
            </div>
          );
        },
      },
    ]; 
    return (
      <div className={styles.projectListPanel}>
        <div className={styles.projectTopTool}> 
          <Button type="primary" size="large" onClick={this.onClickAddProject}>新建项目</Button>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          // dataSource={}
          pagination={{
            pageSize: 5,
            showTotal(totle: number) {
              return `总记录数${totle}`;
            },
          }}
        />
      </div>
    )
  }
}


export default connect()(withRouter(ProjectList))