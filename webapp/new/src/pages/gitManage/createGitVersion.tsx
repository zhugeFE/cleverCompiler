import * as React from 'react'
import { Modal, Form, Input, Radio, Select, Spin, FormInstance, message } from 'antd'
import { VersionStatus } from '@/models/common';
import { GitBranch, GitCommit, GitCreateVersionParam, GitInfo, GitInstance, GitList, GitTag, GitVersion } from '@/models/git';
import util from '@/utils/utils';
import { connect } from 'dva';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { ConnectState } from '@/models/connect';
import { VersionType } from "@/models/common";
import style from "./styles/createGitVersion.less";

interface FormData {
  option: string;
  source: string;
  repoId: string;
  branch: string;
  branchName: string;
  branchDesc: string;
  originBranchId: string;
  originVersionId: string;
  tag: string;
  commit: string;
  description: string;
}
interface Props {
  mode: string;
  gitList: GitInstance[]; 
  gitId?: string;
  gitInfo?: GitInfo;
  repoId?: string;
  branchId?: string;
  title?: string;
  versionList?: GitVersion[];
  dispatch: Dispatch;
  onCancel? (): void;
  afterAdd? (): void;
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
  createGitForm: React.RefObject<FormInstance> = React.createRef();
  constructor (props: Props) {
    super(props)
    this.state = {
      show: true,
      version: '',
      form: {
        option: '',
        description: '',
        source: 'commit',
        repoId: '',
        branch: '',
        tag: '',
        commit: '',
        branchName: '',
        branchDesc: '',
        originBranchId: "",
        originVersionId: ""
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

    if (this.props.mode != 'init') {
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
    if (chanedValue['branchName'] ) {
      let version
      if (values.originBranchId) {
        version = '1.0.0-' + chanedValue['branchName']
      } else {
        version = '1.0.0'
      }
      this.setState({
        version
      })
    }
    if (chanedValue['originBranchId']) {
      if (values.branchName) {
        this.setState({
          version: '1.0.0-' + values.branchName
        })
      }
      values.originVersionId = "" 
      this.createGitForm.current?.setFieldsValue({"originVersionId":""})
    }
    if (chanedValue['option']) {      
      const splitArr = this.props.versionList![0].name!.split('-')
      const str = splitArr[0].split('.');
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
        version : splitArr.length == 1 ? str.join('.') : str.join('.') + '-' +splitArr[1]
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
      version: this.state.version,
      source: source,
      sourceValue: this.state.form[source],
      description: this.state.form.description,
      branchName: this.state.form.branchName,
      branchDesc: this.state.form.branchDesc,
      originBranchId: this.state.form.originBranchId,
      originVersionId: this.state.form.originVersionId,
      branchId: this.props.branchId || ""
    }    
    this.props.dispatch({
      type: 'git/createVersion',
      payload: data,
      callback: (res: true) => {
        if (!res) {
          message.error("创建失败")
          return
        }
        this.setState({
          show: false
        })
        message.info("创建成功")
        if (this.props.afterAdd) this.props.afterAdd()
      }
    })
  }
  onCancel () {
    this.setState({
      show: false
    })
    if (this.props.onCancel) this.props.onCancel()
  }
  filterGitRep (input: string, option: any) {
    return new RegExp(input, 'i').test(option.children)
  }
  render () {
    const source = this.state.form.source
    const branchDisplay = source === 'branch' ? 'flex' : 'none'
    const tagDisplay = source === 'tag' ? 'flex' : 'none'
    const commitDisplay = source === 'commit' ? 'flex' : 'none'
    if ( !this.state.gitList && this.props.mode == 'init' ){
      return(
        <Spin className={style.gitEditLoading} tip="git列表获取中..." size="large"></Spin>
      )
    }
    return (
      <Modal
        className={style.createGitModal}
        title={this.props.title || '添加版本'}
        closable={false}
        visible={this.state.show}
        cancelText="取消"
        okText="保存"
        onCancel={this.onCancel}
        onOk={this.onCommit}>
        <Form 
          ref={this.createGitForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }} 
          initialValues={this.state.form}
          layout="horizontal"
          onValuesChange={this.onChangeForm}>
          {
            this.props.mode == 'branch' ? (
              <>
                <Form.Item label="源分支" name="originBranchId">
                  <Select>
                    {
                      this.props.gitInfo?.branchList.map( item => {
                        return (
                          <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>
                {
                  this.state.form.originBranchId &&
                  <Form.Item label="源版本" name="originVersionId">
                    <Select>
                    {
                      this.props.gitInfo?.branchList.filter( branch => branch.id == this.state.form.originBranchId)[0].versionList.map(item => {
                        if( item.status == VersionStatus.placeOnFile) {
                          return (
                            <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                          )
                        }      
                      })
                    }
                    </Select>
                  </Form.Item>
                } 
              </>
            ) : null
          }
          {
            this.props.mode == 'init' || this.props.mode == 'branch' ? (
              <>
                <Form.Item label="分支名称" name="branchName" required>
                  <Input autoComplete="off"></Input>
                </Form.Item>
                
                <Form.Item label="分支描述" name="branchDesc" required>
                  <Input autoComplete="off"></Input>
                </Form.Item>
              </>
            ) : null
          }
          {
            this.props.mode == 'init' &&
            <Form.Item label="git来源" name="repoId" required>
              <Select 
                showSearch
                filterOption={this.filterGitRep}>
                {
                  this.state.gitList!.map(item => 
                    <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                }
              </Select>
            </Form.Item>
          }
          <Form.Item label="来源" name="source" required>
            <Radio.Group>
              <Radio.Button value="tag">tag</Radio.Button>
              <Radio.Button value="commit">commit</Radio.Button>
              <Radio.Button value="branch">branch</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="branch" name="branch" style={{display: branchDisplay}} required>
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
          <Form.Item label="tag" name="tag" style={{display: tagDisplay}} required>
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
          <Form.Item label="commit" name="commit" style={{display: commitDisplay}} required>
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
    
          {
            this.props.mode !== 'init' && this.props.mode !== 'branch' ? 
            <Form.Item label="版本类型" name="option" required>
              <Select>
                {VersionType.map((item) => (
                  <Select.Option value={item.key} key={item.key} title={item.title}>
                    {item.title}
                  </Select.Option>
                ))}
              </Select>              
            </Form.Item> : null
          }
 
          <Form.Item label="版本号" required>
            {
              <Input
                type="text"
                value={this.state.version}
                addonBefore="v"
                disabled
                placeholder="1.0.0"
              />
            }
          </Form.Item>

          <Form.Item label="版本描述" name="description" required>
            <Input autoComplete="off"></Input>
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