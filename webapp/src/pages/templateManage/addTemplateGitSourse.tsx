/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-10 18:48:36
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-05 14:56:41
 */
import { Form, message, Modal, Select } from 'antd';
import React from 'react';
import type { Dispatch } from '@/.umi/plugin-dva/connect';
import { connect } from 'dva';
import util from '@/utils/utils';
import type {
  CreateTemplateVersionGitParams,
  TemplateVersionGit,
} from '@/models/template';
import type { GitInfo, GitInstance } from '@/models/git';
import type { ConnectState } from '@/models/connect';
import { VersionStatus } from '@/models/common';
import styles from './styles/addGitSource.less'
const { Option } = Select;
interface FormData {
  gitId: string;
  version: string;
  branch: string;
}

interface Props {
  templateId: string;
  templateVersionId: string;
  existGits: TemplateVersionGit[];
  gitList: GitInstance[];
  gitInfo: GitInfo;
  onCancel: () => void;
  dispatch: Dispatch;
}

interface States {
  show: boolean;
  form: FormData;
}

class CreateTemplateVersion extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      show: true,
      form: {
        gitId: '',
        version: '',
        branch: ''
      },
    };
    this.onCancel = this.onCancel.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onChangeForm = this.onChangeForm.bind(this);
  }

  onCancel() {
    if (this.props.onCancel) this.props.onCancel();
  }

  onCommit() {
    const { gitId, version, branch} = this.state.form

    if( !gitId || !version || !branch){
      message.error('数据未填写完整！', 1);
      return
    }
    const data: CreateTemplateVersionGitParams = {
      templateId: this.props.templateId,
      templateVersionId: this.props.templateVersionId,
      gitSourceBranchId: branch,
      gitSourceId: gitId,
      gitSourceVersionId: version,
    };
    this.props.dispatch({
      type: 'template/addVersionGit',
      payload: data,
      callback: (res: boolean) => {
        if(res){
          message.success({
            content: "添加git仓库成功",
            duration: 0.5
          })
          this.props.onCancel()

        } else {
          message.error("添加git仓库失败")
        }
      }
    });
    
  }

  async onChangeForm(chanedValue: any, values: FormData) {
    const form = util.clone(values);
    if (Object.keys(chanedValue)[0] == 'gitId') {      
      await this.getGitInfo(chanedValue.gitId);
    }
    this.setState({
      form,
    });
  }

  //获取git版本数据
  getGitInfo(id: string) {
    this.props.dispatch({
      type: 'git/getInfo',
      payload: id
    });
  }

  render() {
    const existGits = {}
    this.props.existGits.map(item => {existGits[String(item.gitSourceId)]=true})
    const gitList = this.props.gitList.filter(item => !existGits[item.id] && item.enable)
    const gitInfo = this.props.gitInfo;
    
    return (
      <>
        {
          <Modal
            title="添加Git源"
            closable={false}
            visible={this.state.show}
            cancelText="取消"
            okText="保存"
            centered
            onCancel={this.onCancel}
            onOk={this.onCommit}
          >
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
              initialValues={this.state.form}
              layout="horizontal"
              onValuesChange={this.onChangeForm}>
              <Form.Item label="git源" name="gitId">
                <Select
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) =>{
                      return option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  }
                >
                  {gitList.map((item) => (
                    <Option value={item.id} key={item.id} title={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="git源分支" name="branch" >
                <Select>
                  {gitList.length && gitInfo?.branchList.map((item) => (
                    <Option value={item.id} key={item.id} title={item.name}>
                      {item.name}
                      <div className={styles.versionDesc}>{item.description}</div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="git源版本" name="version" >
                <Select>
                  { 
                  this.state.form.branch &&
                  gitInfo?.branchList.filter(item => item.id == this.state.form.branch)[0].versionList.map((item) => (
                    item.status === VersionStatus.placeOnFile &&
                    <Option value={item.id} key={item.id} title={item.name}>
                      {item.name}
                      <div className={styles.versionDesc}>{item.description}</div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        }
      </>
    );
  }
}

export default connect(({ git }: ConnectState) => {
  return {
    gitList: git.gitList,
    gitInfo: git.currentGit!
  };
})(CreateTemplateVersion);
