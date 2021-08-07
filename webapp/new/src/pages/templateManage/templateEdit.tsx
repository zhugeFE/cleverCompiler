/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-04 15:09:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-04 16:13:48
 */

import { connect } from 'dva'
import React from 'react'
import styles from './styles/templateList.less'



interface State {

}

interface Props {

}

class TemplateEdit extends React.Component<Props, State> {
  constructor (prop: Props) {
    super(prop)
    this.state = {

    }
  }



  render () {

    return (
      <div className={styles.main}>
        33
      </div>
    )
  }
}

export default connect()(TemplateEdit)