import * as React from 'react'
import { Modal, Form, Input, Radio, message, Select } from 'antd'
import * as _ from 'lodash';
import ajax from '../../utils/ajax';
import { ApiResult } from '../../utils/ajax';
import { GitBranch, GitTag, GitCommit, GitCreateVersionParam } from '../../store/state/git';
// import { WrappedFormUtils } from 'antd/lib/form/Form';

interface FormData {
  source: string;
  version: string;
  branch: string;
  tag: string;
  commit: string;
}
interface Props {
  gitId: string;
  repoId: string;
}
interface States {
  show: boolean;
  form: FormData;
  branchList: GitBranch[];
  tags: GitTag[];
  commits: GitCommit[];
  ready: {
    branch: boolean;
    tag: boolean;
    commit: boolean;
  };
}

class CreateVersion extends React.Component<Props, States> {
  constructor (props: Props) {
    super(props)
    this.state = {
      show: true,
      form: {
        version: '',
        source: 'branch',
        branch: '',
        tag: '',
        commit: ''
      },
      branchList: [],
      tags: [],
      commits: [],
      ready: {
        branch: false,
        tag: false,
        commit: false
      }
    }
    this.onCommit = this.onCommit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onChangeForm = this.onChangeForm.bind(this)
  }
  componentDidMount () {
    this.getBranchList()
    this.getTags()
    this.getCommits()
  }
  getBranchList () {
    ajax({
      url: `/api/git/branchs/${this.props.repoId}`,
      method: 'GET'
    })
    .then((res: ApiResult) => {
      this.setState({
        branchList: res.data as GitBranch[]
      })
    })
    .catch(err => {
      message.error('git分支列表查询失败')
      console.error('git分支列表查询失败', err)
    })
  }
  getTags () {
    ajax({
      url: `/api/git/tags/${this.props.repoId}`,
      method: 'GET'
    })
    .then((res: ApiResult) => {
      this.setState({
        tags: res.data as GitTag[]
      })
    })
    .catch(err => {
      message.error('git标签列表查询失败')
      console.error('git标签列表查询失败', err)
    })
  }
  getCommits () {
    ajax({
      url: `/api/git/commits/${this.props.repoId}`,
      method: 'GET'
    })
    .then((res: ApiResult) => {
      this.setState({
        commits: res.data as GitCommit[]
      })
    })
    .catch(err => {
      message.error('git提交记录查询失败')
      console.error('git提交记录查询失败', err)
    })
  }
  onFilterCommit<GitCommit> (value: string, optionData: any): boolean {
    return new RegExp(value.toLowerCase()).test(optionData.title.toLowerCase())
  }
  onChangeForm (chanedValue: any, values: FormData) {
    this.setState({
      form: values
    })
  }
  onCommit () {
    const source = this.state.form.source as 'branch' | 'tag' | 'commit'
    const data: GitCreateVersionParam = {
      gitId: this.props.gitId,
      version: this.state.form.version,
      source: source,
      value: this.state.form[source]
    }
    ajax({
      url: '/api/git/version/add',
      method: 'POST',
      data
    })
    .then(() => {
      message.success('版本创建成功')
    })
    .catch(err => {
      message.error('版本创建失败')
      console.error('版本创建失败', err)
    })
  }
  onCancel () {
    this.setState({
      show: false
    })
  }
  render () {
    const source = this.state.form.source
    const branchDisplay = source === 'branch' ? 'flex' : 'none'
    const tagDisplay = source === 'tag' ? 'flex' : 'none'
    const commitDisplay = source === 'commit' ? 'flex' : 'none'
    return (
      <Modal
        title="添加版本"
        closable={false}
        visible={this.state.show}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}>
        <Form 
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }} 
          initialValues={this.state.form}
          layout="horizontal"
          onValuesChange={this.onChangeForm}>
          <Form.Item label="版本号" name="version">
            <Input addonBefore="v" placeholder="x.x.x"/>
          </Form.Item>
          <Form.Item label="来源" name="source">
            <Radio.Group>
              <Radio.Button value="branch">branch</Radio.Button>
              <Radio.Button value="tag">tag</Radio.Button>
              <Radio.Button value="commit">commit</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="branch" name="branch" style={{display: branchDisplay}}>
            <Select showSearch={true}>
              {
                this.state.branchList.map(branch => {
                  return (
                    <Select.Option value={branch.name} key={branch.name} title={branch.name}>
                      {branch.name}
                    </Select.Option>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="tag" name="tag" style={{display: tagDisplay}}>
            <Select showSearch={true}>
            {
              this.state.tags.map(tag => {
                return (
                  <Select.Option value={tag.name} key={tag.name} title={tag.name}>
                    {tag.name}
                  </Select.Option>
                )
              })
            }
            </Select>
          </Form.Item>
          <Form.Item label="commit" name="commit" style={{display: commitDisplay}}>
            <Select showSearch={true} filterOption={this.onFilterCommit}>
            {
              this.state.commits.map(commit => {
                return (
                  <Select.Option value={commit.id} key={commit.id} title={commit.message}>
                    {commit.message}
                  </Select.Option>
                )
              })
            }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
export default CreateVersion