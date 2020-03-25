import * as React from 'react'
import './styles/gitList.less'
import { Table, message } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import history from '../../utils/history'
import { RootState, GitInstance } from '../../store/state';
import { Dispatch } from 'redux';
import { gitActions } from '../../store/actionTypes'
import { connect } from 'react-redux'
import ajax from '../../utils/ajax'
interface Props {
  getGitSourceList (): void;
  gitList: GitInstance[];
}
interface State {
  rowSelection: TableRowSelection<GitInstance>
}
class GitSourceList extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      rowSelection: {
        getCheckboxProps: (record: GitInstance) => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        })
      }
    }
  }
  onClickEdit (record: GitInstance) {
    history.push(`/project/git/${record.id}`)
  }
  componentDidMount () {
    this.props.getGitSourceList()
  }
  render () {
    const that = this
    const columns: ColumnProps<GitInstance>[] = [
      {
        title: '项目名称',
        dataIndex: 'name',
        fixed: 'left',
        render (text, record: GitInstance) {
          return (
            <div>
              <div>{text}</div>
              <div>{record.description}</div>
            </div>
          )
        }
      },
      {
        title: '最新版本',
        dataIndex: 'lastVersion',
        render (text) {
          return (
            text || '-'
          )
        },
        sorter (a:GitInstance, b: GitInstance) {
          const val = Number(a.lastVersion.replace(/\D/g, '')) - Number(b.lastVersion.replace(/\D/g, ''))
          if (val > 0) {
            return 1
          } else if (val < 0) {
            return -1
          } else {
            return 0
          }
        }
      },
      {
        title: '使用文档',
        dataIndex: 'readmeDoc',
        render (text) {
          return (
            <a>{text || '-'}</a>
          )
        }
      },
      {
        title: '部署文档',
        dataIndex: 'buildDoc',
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
        render (text, record: GitInstance) {
          return (
            <div className="to-handle">
              <a onClick={that.onClickEdit.bind(that, record)}>编辑</a>
              <a style={{marginRight: 5}}>版本记录</a>
              <a>禁用</a>
            </div>
          )
        }
      }
    ]
    const rowSelection: TableRowSelection<GitInstance> = {

    }
    return (
      <div className="git-source-list">
        <Table 
          rowSelection={rowSelection} 
          rowKey="id"
          columns={columns} 
          dataSource={this.props.gitList}
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
const mapStateToProps = (state: RootState) => {
  return {
    gitList: state.git.list
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getGitSourceList: () => {
      ajax({
        url: '/api/git/list',
        method: 'post'
      }).then((res) => {
        dispatch({
          type: gitActions.UPDATE_LIST,
          value: res.data
        })
      }).catch(err => {
        message.error(err.message)
      })
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GitSourceList)