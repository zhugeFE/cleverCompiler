/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:19
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-26 16:36:14
 */
import { Customer } from '@/models/customer';
import { Button, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React from 'react'
import { withRouter } from 'react-router-dom';
import { Dispatch, IRouteComponentProps } from 'umi';
import { connect } from 'dva';
import styles from "./styles/customerList.less"
import { ConnectState } from '@/models/connect';
import UpdateCustomer from "./updateCustomer";

export interface Props extends IRouteComponentProps{
  customerList: Customer[] | null ;
  dispatch: Dispatch;
}
interface States {
  showUpdateCustomer: boolean;
  currentUpdateData: Customer | null;
}

class CustomerList extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      showUpdateCustomer: false,
      currentUpdateData: null
    }
    this.onClickAddCustomer = this.onClickAddCustomer.bind(this)
    this.hideUpdateCustomer = this.hideUpdateCustomer.bind(this)
  }

  componentDidMount () {
    this.props.dispatch({
      type: "customer/getCustomerList"
    })

    setTimeout(() => {
      console.log(this.props.customerList)
    }, 0);
  }

  //客户编辑
  onClickEdit(data: Customer, type: string){
    switch (type) {
      case "edit": {
        this.setState({
          showUpdateCustomer: true,
          currentUpdateData: data
        })
        break
      }
      case "info": {
        console.log("info")
        console.log(data)
      }
    }
    
  }

  //新建客户
  onClickAddCustomer () {
    this.props.history.push("/compile/customer/edit/addCustomer")
  }

  //隐藏编辑客户
  hideUpdateCustomer () {
    this.setState({
      showUpdateCustomer: false
    })
  }

  render() {
    const columns: ColumnProps<Customer>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        fixed: 'left',
        width: 250,
        render(text: string, record: Customer) {
          return <div> {text || '-' || record.name} </div>;
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 280,
        render(text: string, record: Customer) {
          return <div> {text || '-' || record.description} </div>;
        },
      },
      {
        title: '项目',
        dataIndex: 'prjectId',
        width: 150,
        render(text: string, record: Customer) {
          return <div> {text || '-' || record.projectId} </div>;
        },
      },
      {
        title: '创建者',
        width: 150,
        dataIndex: 'creatorName',
        render(text: string, record: Customer) {
          return <div> {text || '-' || record.creatorName} </div>;
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        width: 80,
        fixed: 'right',
        render: (text, record: Customer) => {
          return (
            <div>
              <a  onClick={this.onClickEdit.bind(this, record, "edit")}>
                编辑
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
      <div className={styles.customerPanel}>
        {
          this.state.showUpdateCustomer && (
            <UpdateCustomer
              customerInfo={this.state.currentUpdateData}
              onCancel={this.hideUpdateCustomer}
            ></UpdateCustomer>
          )
        }
        <div className={styles.customerTopTool}> 
          <Button type="primary" size="large" onClick={this.onClickAddCustomer}>新建客户</Button>
        </div>
        <Table
            rowKey="id"
            columns={columns}
            dataSource={this.props.customerList ? this.props.customerList : []}
            pagination={{
              pageSize: 5,
              showTotal(totle: number) {
                return `总记录数${totle}`;
              },
            }}
          ></Table>
      </div>
    )
  }
}


export default connect( ( {customer}: ConnectState) => {
  return {
    customerList: customer.customerList
  }
})(withRouter(CustomerList))