import * as React from 'react'
import { Modal, Form, Input, Radio, message, Select } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import * as _ from 'lodash';
import ajax from '../../utils/ajax';
import { ApiResult } from '../../utils/ajax';
import { GitBranch } from '../../store/state/git';

interface FormData {
  source: string;
  version: string;
  branch: string;
  /* tag: string;
  commit: string; */
}
interface Props {
  form: WrappedFormUtils<FormData>;
  gitId: string;
}
interface States {
  show: boolean;
  form: FormData;
  branchList: GitBranch[];
  refs: {
    branch: Select
  }
}

class CreateVersion extends React.Component<Props, States> {
  constructor (props: Props) {
    super(props)
    this.state = {
      show: true,
      form: {
        version: '',
        source: 'branch',
        branch: ''/* ,
        tag: '',
        commit: '' */
      },
      branchList: [],
      refs: {
        branch: null
      }
    }
    this.onCommit = this.onCommit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onInputVersion = this.onInputVersion.bind(this)
    this.onChangeBranch = this.onChangeBranch.bind(this)
  }
  componentDidMount () {
    this.props.form.setFieldsValue(this.state.form)
    this.getBranchList()
  }
  getBranchList () {
    ajax({
      url: `/api/git/branchs/${this.props.gitId}`,
      method: 'GET'
    })
    .then((res: ApiResult) => {
      this.setState({
        branchList: res.data as GitBranch[]
      })
    })
    .catch(err => {
      message.error('git分支列表获取失败')
      console.error('git分支列表获取失败', err)
    })
  }
  onChangeBranch (branch: string) {
    this.setState({
      form: {
        ...this.state.form,
        branch
      }
    })
  }
  onInputVersion () {
    
  }
  onCommit () {
    console.log('保存')
  }
  onCancel () {
    console.log('取消')
    this.setState({
      show: false
    })
  }
  render () {
    let { getFieldDecorator } = this.props.form
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
          layout="horizontal">
          <Form.Item label="版本号">
          {
            getFieldDecorator('version')(
              <Input addonBefore="v" placeholder="x.x.x" onChange={this.onInputVersion}/>
            )
          }
          </Form.Item>
          <Form.Item label="来源">
          {
            getFieldDecorator('source')(
              <Radio.Group>
                <Radio.Button value="branch">branch</Radio.Button>
                <Radio.Button value="tag">tag</Radio.Button>
                <Radio.Button value="commit">commit</Radio.Button>
              </Radio.Group>
            )
          }
          </Form.Item>
          <Form.Item label="branch">
          {
            getFieldDecorator('branch')(
              <Select showSearch={true} onChange={this.onChangeBranch}>
              {
                this.state.branchList.map(branch => {
                  return (
                    <Select.Option value={branch.name} key={branch.name}>
                      {branch.name}
                    </Select.Option>
                  )
                })
              }
              </Select>
            )
          }
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
export default Form.create<Props>()(CreateVersion)