import * as React from 'react'
import './styles/gitList.less'
import { Table, message } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import history from '../../utils/history'
import { RootState } from '../../store/state';
import { Dispatch } from 'redux';
import { gitActions } from '../../store/actionTypes'
import { connect } from 'react-redux'
import ajax from '../../utils/ajax'
interface Props {
  getGitSourceList (): void;
}
interface Record {
  key: string,
  name: string,
  latest: string,
  devDoc: string,
  depDoc: string
}
interface State {
  store: Record[],
  rowSelection: TableRowSelection<Record>
}
class GitSourceList extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)
    this.state = {
      store: [
        {key: 'xxx', name: 'webapp', latest: '1.0.3', devDoc: 'http://xx.com/a', depDoc: 'http://xx.com/b'},
        {key: 'aaa', name: 'sdkv', latest: '1.2.2', devDoc: 'http://xx.com/a', depDoc: 'http://xx.com/b'}
      ],
      rowSelection: {
        getCheckboxProps: (record: Record) => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        })
      }
    }
  }
  onClickEdit (record: Record) {
    history.push(`/project/git/${record.key}`)
  }
  componentDidMount () {
    this.props.getGitSourceList()
  }
  render () {
    const that = this
    const columns: ColumnProps<Record>[] = [
      {
        title: '项目名称',
        dataIndex: 'name'
      },
      {
        title: '最新版本',
        dataIndex: 'latest',
        sorter (a:Record, b: Record) {
          const val = Number(a.latest.replace(/\D/g, '')) - Number(b.latest.replace(/\D/g, ''))
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
        dataIndex: 'devDoc',
        render (text) {
          return (
            <a>{text}</a>
          )
        }
      },
      {
        title: '部署文档',
        dataIndex: 'depDoc',
        render (text) {
          return (
            <a>{text}</a>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'handle',
        render (text, record: Record) {
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
    const rowSelection: TableRowSelection<Record> = {

    }
    return (
      <div className="git-source-list">
        <ul>
          <li>名称过滤</li>
          <li>版本选择</li>
          <li>批量禁用</li>
          <li>批量启用</li>
          <li>git库同步</li>
        </ul>
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.store}></Table>
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
      }).then(() => {
        dispatch({
          type: gitActions.UPDATE_LIST
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