/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:19
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-25 15:50:37
 */
import { Customer } from '@/models/compile';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React from 'react'
import { withRouter } from 'react-router-dom';
import { Dispatch, IRouteComponentProps } from 'umi';
import { connect } from 'dva';

export interface Props extends IRouteComponentProps{
  customerList: Customer[];
  dispatch: Dispatch;
}
interface States {

}

class CustomerList extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
  }

  //客户编辑
  onClickEdit(data: Customer){
    console.log(data)
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
              <a  onClick={this.onClickEdit.bind(this, record)}>
                编辑
              </a>
            </div>
          );
        },
      },
    ];
    return (
      <div>
        <Table
            rowKey="id"
            columns={columns}
            dataSource={this.props.customerList}
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


export default connect()(withRouter(CustomerList))