import { ConnectState } from '@/models/connect'
import { GitInstance } from '@/models/git'
import { Button, Form, Input, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { connect } from 'dva'
import React from 'react'
import { withRouter } from 'react-router'
import { Dispatch, IRouteComponentProps } from 'umi'
import styles from './styles/gitList.less'

interface GitListProps extends IRouteComponentProps{
  gitList: GitInstance[];
  dispatch: Dispatch;
}

interface State {
  form: {
    name: string,
    version: string
  };
  searchVaild: boolean;
  selectedRowKeys: string[]
}
class GitList extends React.Component<GitListProps, State> {
  constructor (props: GitListProps) {
    super(props)
    this.state = {
      form: {
        name: '',
        version: ''
      },
      searchVaild: true,
      selectedRowKeys: []
    }
    this.onSearch = this.onSearch.bind(this)
    this.onCreateGit = this.onCreateGit.bind(this)
    this.rowSelectChange = this.rowSelectChange.bind(this)
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'git/query'
    })
  }

  onClickEdit (git: GitInstance) {
    if (!git.enable) return
    this.props.history.push(`/manage/git/${git.id}`)
  }

  onChangeStatus (git: GitInstance) {
    this.props.dispatch({
      type: 'git/updateGitStatus',
      payload: [{
        id: git.id,
        enable: Number(!git.enable)
      }],
      callback: () => {
      }
    })
  }
  onCreateGit () {
    this.props.history.push(`/manage/git/createGit`)
  }
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
  rowSelectChange (selectedRowKeys: React.Key[], selectedRows: GitInstance[]) {
    var arr = selectedRowKeys.map(item => String(item))
    this.setState({
      selectedRowKeys: arr
    })
  }
  onBatchOption (order: string) {
    if (this.state.selectedRowKeys.length == 0) return
    const data = this.state.selectedRowKeys.map( item => { return {id: item, enable: order === 'disable' ? 0 : 1}})
    this.props.dispatch({
      type: 'git/updateGitStatus',
      payload: data,
      callback: () => {

      }
    })
  }
  onClickDel (git: GitInstance) {
    this.props.dispatch({
      type: 'git/delGitInfo',
      payload: git.id,
      callback: () => {
      }
    })
  }
  onClickUpdateEntry (git: GitInstance) {
    this.props.history.push(`/manage/git/updateInfo/${git.id}?title=${git.name}`)
  }
  render () {
    const columns: ColumnProps<GitInstance>[] = [
      {
        title: '项目名称',
        dataIndex: 'name',
        fixed: 'left',
        width: 300,
        ellipsis: true,
        render (text, record: GitInstance) {
          return text
        }
      },
      {
        title: '最新版本',
        dataIndex: 'version',
        width: 120,
        ellipsis: true,
        render (text) {
          return (
            text || '-'
          )
        }
      },
      {
        title: '使用文档',
        dataIndex: 'readmeDoc',
        width: 120,
        ellipsis: true,
        render (text) {
          return (
            <a>{text || '-'}</a>
          )
        }
      },
      {
        title: '部署文档',
        dataIndex: 'buildDoc',
        width: 120,
        ellipsis: true,
        render (text) {
          return (
            <a>{text || '-'}</a>
          )
        }
      },
      {
        title: '更新文档',
        dataIndex: 'updateDoc',
        width: 120,
        ellipsis: true,
        render (text) {
          return (
            <a>{text || '-'}</a>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'handle',
        fixed: 'right',
        render: (text, record: GitInstance) => {
          return (
            <div className={styles.toHandle}>
              <Button 
                type="primary" 
                style={{marginRight: 5}}
                disabled={!record.enable}
                onClick={this.onClickEdit.bind(this, record)}>编辑</Button>
              {/* <Button 
                type="primary"
                danger 
                style={{marginRight: 5}} 
                disabled={!record.enable}
                onClick={this.onClickDel.bind(this, record)}>删除</Button> */}
              <Button                 
                style={{marginRight: 5}} 
                disabled={!record.enable}
                onClick={this.onClickUpdateEntry.bind(this, record)}>版本更新日志</Button>
              {record.enable ? <Button danger onClick={this.onChangeStatus.bind(this,record)}>禁用</Button> : <Button onClick={this.onChangeStatus.bind(this,record)}>启用</Button> }
            </div>
          )
        }
      }
    ]
    const formData = this.state.form
    const showList = this.props.gitList.filter( item => {
      try {
        return new RegExp(formData.name, 'i').test(item.name) && new RegExp(formData.version, 'i').test(item.version)
      }
      catch (err) {
      }
    })
    return (
      <div className={styles.gitSourceList}>
        <div className={styles.gitFilterPanel}>
          <Form layout="inline" onValuesChange={this.onSearch}>
            <Form.Item label="项目名称" name="name">
              <Input autoComplete="off"/>
            </Form.Item>
            <Form.Item label="最新版本" name="version">
              <Input autoComplete="off"/>
            </Form.Item>
            <Form.Item>
              <Button 
                disabled={!this.state.selectedRowKeys.length}
                type="primary" 
                onClick={this.onBatchOption.bind(this, 'enable')}>批量启用</Button>
            </Form.Item>
            <Form.Item>
              <Button 
                danger 
                disabled={!this.state.selectedRowKeys.length}
                onClick={this.onBatchOption.bind(this, 'disable')}>批量禁用</Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={this.onCreateGit}>创建项目</Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          rowSelection={{
            type: "checkbox",
            onChange: this.rowSelectChange
          }}
          rowKey="id"
          columns={columns} 
          dataSource={showList}
          rowClassName={ (record) => record.enable ? "" : styles.disable}
          pagination={{pageSize: 5, showTotal(totle: number) {
            return (
              `总记录数${totle}`
            )
          }}}
        ></Table>
      </div>
    )
  }
}

export default connect(({git}: ConnectState) => {
  return {
    gitList: git.gitList
  }
})(withRouter(GitList))