/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-01-09 23:23:08
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-11 15:41:07
 */

import React  from "react";
import type { User } from "@/modles/user";
import type { ConnectState } from '@/models/connect';
import styles from "./styles/userCenter.less"
import { Form, Input, Table } from 'antd';
import type { ColumnProps } from "antd/lib/table";
import type {Dispatch } from 'dva';
import { connect } from 'dva';



interface Props {
  userList: User[];
  dispatch: Dispatch
}
interface State {
  form: {
    userName: string;
    email: string;
  },
  searchVaild: boolean;
  selectedRowKeys: string[];
}

class UserManage extends React.Component<Props,State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      form: {
        userName: "",
        email: ""
      },
      searchVaild: true,
      selectedRowKeys: []
    }
    this.onSearch = this.onSearch.bind(this)
  }
  componentDidMount(): void {
      this.getUserList()
  }
  getUserList () {
    this.props.dispatch({
      type: "user/query"
    })
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
    const formData = this.state.form
    const showList = this.props.userList?.filter(item => {
      try {
        return new RegExp(formData.userName , 'i').test(item.name) && new RegExp(formData.email, 'i').test(item.email)
      }
      catch (err) {
        
      }
    }) 
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
      }
    ]; 
    return (
      <div className="UserPage" >
        <div className={styles.userTopTool}> 
          <Form layout="inline" onValuesChange={this.onSearch}>
            <Form.Item label="用户名称" name="userName">
              <Input autoComplete="off"/>
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              <Input autoComplete="off"/>
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

export default connect( ({user}: ConnectState)  => {
  return {
    userList: user.userList
  }
})(UserManage)
