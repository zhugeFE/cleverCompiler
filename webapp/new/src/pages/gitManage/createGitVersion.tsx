import * as React from 'react'
import { Modal, Form, Input, Radio, message, Select, Spin } from 'antd'
import { Version } from '@/models/common';
import { GitBranch, GitCommit, GitCreateVersionParam, GitInstance, GitList, GitTag, GitVersion } from '@/models/git';
import util from '@/utils/utils';
import { connect } from 'dva';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import styles from './styles/createGitVersion.less';
import { ConnectState } from '@/models/connect';
import { VersionType } from "@/models/common";
interface FormData {
  option: string;
  source: string;
  repoId: string;
  branch: string;
  tag: string;
  commit: string;
  description: string;
  parentId: string;
}
interface Props {
  mode: string;
  gitList: GitInstance[]; 
  gitId?: string;
  repoId?: string;
  title?: string;
  versionList?: Version[];
  dispatch: Dispatch;
  onCancel? (): void;
  afterAdd? (version: Version): void;
}
interface States {
  show: boolean;
  form: FormData;
  version: string;
  gitList: GitList[] | null;
  branchList: GitBranch[] ;
  tags: GitTag[];
  commits: GitCommit[];
  ready: {
    branch: boolean;
    tag: boolean;
    commit: boolean;
  };
}

class CreateGitVersion extends React.Component<Props, States> {
  constructor (props: Props) {
    super(props)
    this.state = {
      show: true,
      version: '',
      form: {
        option: '',
        description: '',
        source: 'branch',
        repoId: '',
        branch: '',
        tag: '',
        commit: '',
        parentId: ''
      },
      gitList: null,
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
    if (this.props.mode == 'init') {
      if (this.props.gitList.length == 0) {
        this.props.dispatch({
          type: 'git/query'
        })
      }
      this.getRemoteList()
    }

    if (this.props.mode == 'add') {
      this.getBranchList(this.props.repoId!)
      this.getTags(this.props.repoId!)
      this.getCommits(this.props.repoId!)
    }
    
    
  }
  getRemoteList () {
    this.props.dispatch({
      type: 'git/queryRemoteGitList',
      callback: (list: GitList[]) => {
        let gitListMap = this.props.gitList.map(item => item.repoId)
        list = list.filter( item => !gitListMap.includes(Number(item.id)))
        this.setState({
          gitList: list
        })
      }
    })
  }
  getBranchList (id: string) {
    this.props.dispatch({
      type: 'git/queryBranchs',
      payload: id,
      callback: (list: GitBranch[]) => {
        this.setState({
          branchList: list
        })
      }
    })
  }

  getTags (id: string) {
    this.props.dispatch({
      type: 'git/queryTags',
      payload: id,
      callback: (list: GitTag[]) => {
        this.setState({
          tags: list
        })
      }
    })
  }
  getCommits (id: string) {
    this.props.dispatch({
      type: 'git/queryCommits',
      payload: id,
      callback: (list: GitCommit[]) => {
        this.setState({
          commits: list
        })
      }
    })
  }
  onFilterCommit<GitCommit> (value: string, optionData: any): boolean {
    return new RegExp(value.toLowerCase()).test(optionData.title.toLowerCase())
  }
  onChangeForm (chanedValue: any, values: FormData) {
    if( chanedValue['repoId']) {
      this.getBranchList(chanedValue['repoId'])
      this.getTags(chanedValue['repoId'])
      this.getCommits(chanedValue['repoId'])
    }
    if (chanedValue['option']) {
      const str = this.props.versionList![0].name!.split('.');
      str[chanedValue['option']] = Number(str[chanedValue['option']]) + 1 + '';
      switch (chanedValue['option']) {
        case '0': {
          str[1] = '0';
          str[2] = '0';
        }
        case '1': {
          str[2] = '0';
        }
      }
      this.setState({
        version : str.join('.')
      });
    }
    this.setState({
      form: values
    })
  }
  onCommit () {
    const source = this.state.form.source as 'branch' | 'tag' | 'commit'
    if (!this.props.gitId && !this.state.form.repoId){
      return
    }
    const data: GitCreateVersionParam = {
      gitId: this.props.gitId || "",
      repoId: this.state.form.repoId || "",
      version: this.props.mode == 'init' ? '1.0.0' : this.state.version,
      source: source,
      value: this.state.form[source],
      description: this.state.form.description,
      parentId: this.state.form.parentId
    }

    this.props.dispatch({
      type: 'git/createVersion',
      payload: data,
      callback: (version: GitVersion) => {
        this.setState({
          show: false
        })
        if (this.props.afterAdd) this.props.afterAdd(version)
      }
    })
  }
  onCancel () {
    this.setState({
      show: false
    })
    if (this.props.onCancel) this.props.onCancel()
  }
  render () {
    const source = this.state.form.source
    const branchDisplay = source === 'branch' ? 'flex' : 'none'
    const tagDisplay = source === 'tag' ? 'flex' : 'none'
    const commitDisplay = source === 'commit' ? 'flex' : 'none'
    if ( !this.state.gitList && this.props.mode == 'init' ){
      return(
        <Spin className={styles.gitEditLoading} tip="git列表获取中..." size="large"></Spin>
      )
    }
    return (
      <Modal
        className="create-git-version"
        title={this.props.title || '添加版本'}
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
          {
            this.props.mode == 'init' &&
            <Form.Item label="git" name="repoId">
              <Select>
                {
                  this.state.gitList!.map(item => 
                    <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                }
              </Select>
          </Form.Item>
          }

          {
            this.props.mode !== 'init' ? 
            <Form.Item label="版本类型" name="option">
              <Select>
                {VersionType.map((item) => (
                  <Select.Option value={item.key} key={item.key} title={item.title}>
                    {item.title}
                  </Select.Option>
                ))}
              </Select>              
            </Form.Item> : null
          }
          
          <Form.Item label="版本号">
            {
              this.props.mode == 'init' ? <Input addonBefore="v" placeholder="1.0.0" disabled/>
              :
              <Input
                type="text"
                value={this.state.version}
                addonBefore="v"
                disabled
                placeholder="x.x.x"
              />
            }
          </Form.Item>
            
        
          <Form.Item label="描述" name="description">
            <Input></Input>
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
                    {commit.createdAt ? (
                      <div className="git-commit-time">{util.dateTimeFormat(new Date(commit.createdAt))}</div>
                    ) : null}
                  </Select.Option>
                )
              })
            }
            </Select>
          </Form.Item>
          <Form.Item label="父版本" name="parentId">
            <Select>
              {this.props.versionList?.map(version => {
                return (
                <Select.Option 
                  value={version.id} 
                  key={version.id} 
                  title={version.name}>
                  {version.name}
                  <div className='option-desc'>{version.description}</div>
                </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
export default connect(({git}: ConnectState) => {
  return {
    gitList: git.gitList
  }
})(CreateGitVersion)