/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:49
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-30 13:45:50
 */
import { Button } from 'antd'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { IRouteComponentProps } from 'umi'

interface Props extends IRouteComponentProps{

}
interface States {

}

class CompileList extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.navigationToEdit = this.navigationToEdit.bind(this)
  }

  navigationToEdit () {
    this.props.history.push('/compile/edit')
  }
  render() {
    return (
      <div>
        <Button type="primary" size="large" onClick={this.navigationToEdit}>新建编译</Button>
        <h2>sdfdf</h2>
      </div>

    )
  }
}


export default withRouter(CompileList)