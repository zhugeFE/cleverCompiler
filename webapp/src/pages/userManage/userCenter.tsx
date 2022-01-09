/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-01-09 23:23:08
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-10 00:32:39
 */

import React  from "react";
import type { User } from "@/modles/user";
import type { ConnectState } from '@/models/connect';
import styles from "./styles/usercenter.less"
import { Button, Form, Input, Table } from 'antd';
import type { ColumnProps } from "antd/lib/table";
import type {Dispatch } from 'dva';
import { connect } from 'dva';



interface Props {
  userList: User[];
  dispatch: Dispatch
}
interface State {

}

class UserManage extends React.Component<Props,State> {
  constructor(props: Props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount(): void {
      this.getUserList()
  }
  getUserList () {
    this.props.dispatch({
      type: "user/query"
    })
  }
  render() {
    const columns: ColumnProps<User>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        fixed: 'left',
        ellipsis:true,
        render(text: string, record: User) {
          return text || '-' || record.name
        },
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        render(text: string) {
          return text || '-' 
        },
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        ellipsis: true,
        render(text: string) {
          return text || '-'
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        width: "40%",
        fixed: 'right',
        render: (text, record: User) => {
          return (
            <div />
          );
        },
      },
    ]; 
    return (
      <div className="UserPage" >
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
          dataSource={this.props.userList}
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

export default connect( ({user}: ConnectState)  => {
  return {
    userList: user.userList
  }
})(UserManage)
