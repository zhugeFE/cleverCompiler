/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:19
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-18 17:44:46
 */
import { Customer } from '@/models/customer';
import { Button, Form, Input, Select, Table } from 'antd';
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
  form: {
    customerName: string,
    projectName: string
  },
  searchVaild: boolean
}

class CustomerList extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      showUpdateCustomer: false,
      currentUpdateData: null,
      form: {
        customerName: "",
        projectName: ""
      },
      searchVaild: true
    }
    this.onClickAddCustomer = this.onClickAddCustomer.bind(this)
    this.hideUpdateCustomer = this.hideUpdateCustomer.bind(this)
    this.onSearch = this.onSearch.bind(this)
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
      case "delete": {
        this.props.dispatch({
          type: 'customer/deleteCustomer',
          payload: data.id
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

  // 表单搜索
  onSearch (changedValues: any, values: any) {
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
    const showList = this.props.customerList?.filter(item => {
      return new RegExp(formData.projectName, 'i').test(item.projectId) && new RegExp(formData.customerName, 'i').test(item.name)
    })

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
        title: '联系方式',
        dataIndex: 'tel',
        width: 200,
        render(text: string, record: Customer) {
          return <div>{ text || '-' }</div>
        }
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
        width: 250,
        render(text: string, record: Customer) {
          return <div> {text || '-' || record.projectId} </div>;
        },
      },
      {
        title: '创建者',
        width: 250,
        dataIndex: 'creatorName',
        render(text: string, record: Customer) {
          return <div> {text || '-' || record.creatorName} </div>;
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        fixed: 'right',
        render: (text, record: Customer) => {
          return (
            <div>
              <Button 
                style={{marginRight:5}}
                type="primary" 
                danger 
                onClick={this.onClickEdit.bind(this, record, 'delete')}>
                删除
              </Button>

              <Button 
                style={{marginRight:5}}
                type="primary"  
                onClick={this.onClickEdit.bind(this, record, "edit")}>
                编辑
              </Button>
              
              <Button
                onClick={this.onClickEdit.bind(this, record, "info")}>
                详情
              </Button>
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
          <Form layout="inline" onValuesChange={this.onSearch}>
            <Form.Item label="客户名称" name="customerName">
              <Input/>
            </Form.Item>
            <Form.Item label="项目名称" name="projectName">
              <Input/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.onClickAddCustomer}>新建客户</Button>
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