import { Table } from 'antd'
import { connect } from 'dva'
import React from 'react'
import styles from './styles/index.less'

interface State {

}

interface Props {

}

class TemplateList extends React.Component<Props, State> {
  constructor (prop: Props) {
    super(prop)
    this.state = {

    }
  }

  render () {
    return (
      <div className={styles.main}>
        <div className={styles.filterPanel}></div>
        <Table className={styles.tablePanel}></Table>
      </div>
    )
  }
}

export default connect()(TemplateList)