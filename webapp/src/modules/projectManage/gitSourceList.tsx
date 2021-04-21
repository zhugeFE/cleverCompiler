import * as React from 'react'
import './styles/gitList.less'
import { Table, message, Form, Input, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import history from '../../utils/history'
import { RootState } from '../../store/state';
import { Dispatch } from 'redux';
import { gitActions } from '../../store/actionTypes'
import { connect } from 'react-redux'
import ajax from '../../utils/ajax'
import * as _ from 'lodash'
import { GitInstance } from '../../store/state/git';
import api from '../../store/api'
interface Props {
  getGitSourceList (): void;
  gitList: GitInstance[];
}
interface State {
  form: {
    name: string,
    version: string
  }
}
class GitSourceList extends React.Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props)
    this.state = {
      form: {
        name: '',
        version: ''
      }
    }
    this.onSearch = this.onSearch.bind(this)
  }
  onClickEdit (record: GitInstance) {
    history.push(`/project/git/${record.id}`)
  }
  componentDidMount () {
    this.props.getGitSourceList()
  }
  onSearch (changedValues: any, values: any) {
    this.setState({
      form: {
        ...this.state.form,
        ...values
      }
    })
  }
  render () {
    const that = this
    const columns: ColumnProps<GitInstance>[] = [
      {
        title: '项目名称',
        dataIndex: 'name',
        fixed: 'left',
        width: 300,
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
        dataIndex: 'version',
        render (text) {
          return (
            text || '-'
          )
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
    const formData = this.state.form
    const showList = this.props.gitList.filter(item => {
      return new RegExp(formData.name, 'i').test(item.name) && new RegExp(formData.version, 'i').test(item.version)
    })
    return (
      <div className="git-source-list">
        <div className="git-filter-panel">
          <Form layout="inline" onValuesChange={this.onSearch}>
            <Form.Item label="项目名称" name="name">
              <Input/>
            </Form.Item>
            <Form.Item label="版本" name="version">
              <Input/>
            </Form.Item>
            <Form.Item>
              <Button type="primary">批量启用</Button>
            </Form.Item>
            <Form.Item>
              <Button type="danger">批量禁用</Button>
            </Form.Item>
          </Form>
        </div>
        <Table 
          rowKey="id"
          columns={columns} 
          dataSource={showList}
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
        url: api.git.queryGitList,
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