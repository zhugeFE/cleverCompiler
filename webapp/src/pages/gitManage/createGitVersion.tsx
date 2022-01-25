import * as React from 'react'
import type { FormInstance} from 'antd';
import { Modal, Form, Input, Radio, Select, Spin, message } from 'antd'
import { VersionStatus } from '@/models/common';
import type { GitBranch, GitCommit, GitCreateVersionParam, GitInfo, GitInstance, GitList, GitTag, GitVersion } from '@/models/git';
import util from '@/utils/utils';
import { connect } from 'dva';
import type { Dispatch } from '@/.umi/plugin-dva/connect';
import type { ConnectState } from '@/models/connect';
import { VersionType } from "@/models/common";
import style from "./styles/createGitVersion.less";
import type { IRouteComponentProps} from 'umi';
import { withRouter } from 'umi';

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
  projectName?: string;
  dir?: string;
}
interface Props extends IRouteComponentProps {
  mode: string;
  gitList: GitInstance[]; 
  gitId?: string;
  gitInfo?: GitInfo;
  repoId?: string;
  branchId?: string;
  title?: string;
  versionList?: GitVersion[];
  dispatch: Dispatch;
  onCancel?: () => void;
  afterAdd?: () => void;
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
  tagPending: boolean;
  commitPending: boolean;
  branchPending: boolean;
  isCreateDispatch: boolean;
  fileDirList: any[];
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
        source: 'tag',
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
      },
      tagPending: false,
      commitPending: false,
      branchPending: false,
      isCreateDispatch: false,
      fileDirList: []
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

      if (this.props.location.query.type) {        
        this.setState({
          isCreateDispatch: true
        })
        this.getRemoteGitDir()
      }
    }

    if (this.props.mode != 'init') {
      this.getBranchList(this.props.repoId!)
      this.getTags(this.props.repoId!)
      // this.getCommits(this.props.repoId!)
    }
    
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  }
  getRemoteGitDir () {    
    this.props.dispatch({
      type: 'git/getFileTree',
      payload: {
        id: this.props.location.query.gitId,
        versionId: this.props.location.query.versionId
      },
      callback: (res) => {
        this.setState({
          fileDirList: res
        })
      }
    })
  }
  getRemoteList () {
    this.props.dispatch({
      type: 'git/queryRemoteGitList',
      callback: (list: GitList[]) => {
        const gitListMap = this.props.gitList.map(item => item.repoId)
        this.setState({
          gitList:  list.filter( item => !gitListMap.includes(Number(item.id)))
        })
      }
    })
  }
  getBranchList (id: string) {
    this.setState({
      branchPending: true
    })
    this.props.dispatch({
      type: 'git/queryBranchs',
      payload: id,
      callback: (list: GitBranch[]) => {
        this.setState({
          branchList: list,
          branchPending: false
        })
      }
    })
  }

  getTags (id: string) {
    this.setState({
      tagPending: true
    })
    this.props.dispatch({
      type: 'git/queryTags',
      payload: id,
      callback: (list: GitTag[]) => {        
        this.setState({
          tags: list,
          tagPending: false
        })
      }
    })
  }
  getCommits (id: string, branch: string) {
    this.setState({
      commitPending: true
    })
    this.props.dispatch({
      type: 'git/queryCommits',
      payload: {
        gitId: id,
        branch
      },
      callback: (list: GitCommit[]) => {        
        this.setState({
          commits: list,
          commitPending: false
        })
      }
    })
  }
  onFilterCommit (value: string, optionData: any): boolean {
    return new RegExp(value.toLowerCase()).test(optionData.title.toLowerCase())
  }
  onChangeForm (chanedValue: any, values: FormData) {
    
    if( chanedValue.repoId) {
      this.getBranchList(chanedValue.repoId)
      this.getTags(chanedValue.repoId)
    }
    if (chanedValue.branch) {
      this.getCommits(values.repoId || this.props.repoId!, chanedValue.branch)
      this.createGitForm.current?.setFieldsValue({commit:""})
    }
    if (chanedValue.branchName ) {
      
      let version
      if (values.originBranchId) {
        version = '1.0.0-' + chanedValue.branchName
      } else {
        version = '1.0.0'
      }
      this.setState({
        version
      })
    }
    if (chanedValue.originBranchId) {
      if (values.branchName) {
        this.setState({
          version: '1.0.0-' + values.branchName
        })
      }
      values.originVersionId = "" 
      this.createGitForm.current?.setFieldsValue({"originVersionId":""})
    }
    if (chanedValue.option) {      
      const splitArr = this.props.versionList![0].name!.split('-')
      const str = splitArr[0].split('.');
      str[chanedValue.option] = Number(str[chanedValue.option]) + 1 + '';
      switch (chanedValue.option) {
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
    if (this.state.isCreateDispatch) {
      const {projectName, dir, branchName, branchDesc, description} = this.state.form
      if (!projectName || !dir || !branchName || !branchDesc || !description) {
        message.error({
          content: "数据填写不完整",
          duration: 0.5
        })
        return
      }
    }
    else if (!this.props.gitId && !this.state.form.repoId || !this.state.form[source] || !this.state.version || !this.state.form.description){
      message.error({
        content: "数据填写不完整",
        duration: 0.5
      })
      return
    }
    const queryGitid: string = this.props.location.query.gitId as string
    const queryVersionId: string = this.props.location.query.versionId as string
    const repoId: string = this.props.location.query.repoId as string
    const data: GitCreateVersionParam = {
      dispatch: this.state.isCreateDispatch,
      gitId: queryGitid || this.props.gitId || "",
      repoId: repoId || this.state.form.repoId || "",
      version: this.state.version,
      projectName: this.state.form.projectName || "",
      dir: this.state.form.dir || "",
      source: source,
      sourceValue: this.state.form[source],
      description: this.state.form.description,
      branchName: this.state.form.branchName,
      branchDesc: this.state.form.branchDesc,
      originBranchId: this.state.form.originBranchId,
      originVersionId: queryVersionId || this.state.form.originVersionId,
      branchId: this.props.branchId || ""
    }    
    this.props.dispatch({
      type: 'git/createVersion',
      payload: data,
      callback: (res: { id: string; result: boolean }) => {
        if (!res.result) {
          message.error({
            content: "创建失败",
            duration: 0.5
          })
          return
        }
        this.setState({
          show: false
        })
        message.info({
          content: "创建成功",
          duration: 0.5
        })
        this.props.history.replace(`/manage/git/${res.id}`)
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
    const branchDisplay = source === 'commit' ? 'flex' : 'none'
    const tagDisplay = source === 'tag' ? 'flex' : 'none'
    const commitDisplay = source === 'commit' ? 'flex' : 'none'
    if ( !this.state.gitList && this.props.mode == 'init' ){
      return(
        <Spin className={style.gitEditLoading} tip="git列表获取中..." size="large" />
      )
    }
    return (
      <Modal
        className={style.createGitModal}
        title={this.state.isCreateDispatch ? "创建派生版本" : this.props.title || '添加版本'}
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
                  <Select allowClear>
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
                    <Select allowClear>
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
          
          <Form.Item 
            style={{display: this.state.isCreateDispatch ? " " : "none"}}
            label="项目名称" 
            name="projectName" 
            required> 
            <Input autoComplete='off' />
          </Form.Item>
          <Form.Item 
            style={{display: this.state.isCreateDispatch ? " " : "none"}}
            label="目录" 
            name="dir" 
            required> 
            <Select showSearch allowClear>
             {
              this.state.fileDirList && this.state.fileDirList.map( item => {
                if (item.isDirectory) {
                  return <Select.Option value={item.name}>{item.filePath}</Select.Option>
                }
              })
             }
            </Select>
          </Form.Item>
          
          {
            this.props.mode == 'init' && !this.state.isCreateDispatch &&
            <Form.Item label="git来源" name="repoId" required>
              <Select 
                showSearch
                allowClear
                filterOption={this.filterGitRep}>
                {
                  this.state.gitList!.map(item => 
                    <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                }
              </Select>
            </Form.Item>
          }
         
          {
            !this.state.isCreateDispatch && (
              <>
                <Form.Item label="来源" name="source" required>
                  <Radio.Group>
                    <Radio.Button value="tag">tag</Radio.Button>
                    <Radio.Button value="commit">commit</Radio.Button>
                    {/* <Radio.Button value="branch">branch</Radio.Button> */}
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="branch" name="branch" style={{display: branchDisplay}} required>
                  <Select showSearch={true} allowClear loading={this.state.branchPending}>
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
                  <Select showSearch={true} allowClear loading={this.state.tagPending}>
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
                  <Select showSearch={true} filterOption={this.onFilterCommit} allowClear loading={this.state.commitPending}>
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
              </>
            )
          }
          {
            this.props.mode == 'init' || this.props.mode == 'branch' ? (
              <>
                <Form.Item label="分支名称" name="branchName" required>
                  <Input autoComplete="off" />
                </Form.Item>
                
                <Form.Item label="分支描述" name="branchDesc" required>
                  <Input autoComplete="off" />
                </Form.Item>
              </>
            ) : null
          }

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
            <Input autoComplete="off" />
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
})(withRouter(CreateGitVersion))