/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:49:01
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-08 19:42:54
 */
import { LeftOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect, Dispatch, IRouteComponentProps } from 'umi';
import styles from './styles/customerEdit.less'
import AddCustomer from "./addCustomer"
import { ConnectState } from '@/models/connect';

interface Props extends IRouteComponentProps<{
  id: string;
}>{
  dispatch: Dispatch
}
interface States {
  showAddCustomer: boolean;
  savePercent: number;
}

class CustomerEdit extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      savePercent: 100,
      showAddCustomer: false
    }
    this.onHideAddCustomer = this.onHideAddCustomer.bind(this)
    this.afterAddCustomer = this.afterAddCustomer.bind(this)
  }

  componentDidMount () {
    const id = this.props.match.params.id
    if( id === 'addCustomer') {
      this.setState({
        showAddCustomer: true
      })
    }
  }

  //隐藏添加客户
  onHideAddCustomer () {
    this.setState ({
      showAddCustomer: false
    })
    this.props.history.goBack()
  }

  //客户添加之后
  afterAddCustomer () {
    this.onHideAddCustomer()
  }

  render() {
    return (
      <div className={styles.customerEidtPanel}>
        {
          this.state.showAddCustomer && (
            <AddCustomer
              onCancel={this.onHideAddCustomer}
              afterAdd={this.afterAddCustomer}
            />
          )
        }      
        <div className={styles.customerPanelTop}>
          <a
            onClick={() => {
              this.props.history.goBack();
            }}>
            <LeftOutlined />
            返回
          </a>
          <span>
            {
              this.state.savePercent !== 100 && <Progress
                percent={this.state.savePercent}
                size="small"
                strokeWidth={2}
                format={(percent) => (percent === 100 ? 'saved' : 'saving')}
              ></Progress>
            }

          </span>
        </div>
      </div>
    )
  }
}


export default connect( ({customer}: ConnectState) => {
  return {
    customerList : customer.customerList
  }
} )(withRouter(CustomerEdit))