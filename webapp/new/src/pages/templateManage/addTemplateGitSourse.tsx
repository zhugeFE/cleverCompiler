/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-10 18:48:36
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-18 18:31:50
 */
import { Form, Modal, Select } from 'antd';
import React from 'react';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { connect } from 'dva';
import util from '@/utils/utils';
import {
  CreateTemplateVersionGitParams,
  TemplateInfo,
  TemplateVersion,
  TemplateVersionGit,
} from '@/models/template';
import { GitInfo, GitInstance } from '@/models/git';
import { ConnectState } from '@/models/connect';

const { Option } = Select;
interface FormData {
  gitId: string;
  version: string;
}

interface Props {
  gitList: GitInstance[];
  templateInfo: TemplateInfo | null;
  onCancel(): void;
  dispatch: Dispatch;
}

interface States {
  show: boolean;
  form: FormData;
  gitInfo: GitInfo | null;
}

class CreateTemplateVersion extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      gitInfo: null,
      show: true,
      form: {
        gitId: '',
        version: '',
      },
    };
    this.onCancel = this.onCancel.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onChangeForm = this.onChangeForm.bind(this);
  }

  componentDidMount() {
    console.log(this.props.gitList);
  }

  onCancel() {
    if (this.props.onCancel) this.props.onCancel();
  }

  onCommit() {
    const data: CreateTemplateVersionGitParams = {
      templateId: this.props.templateInfo!.id,
      templateVersionId: this.props.templateInfo!.currentVersion.id,
      gitSourceId: this.state.form.gitId,
      gitSourceVersionId: this.state.form.version,
    };
    this.props.dispatch({
      type: 'template/addVersionGit',
      payload: data,
      callback: (version: TemplateVersionGit) => {
        console.log(version);
        const templateInfo = util.clone(this.props.templateInfo);
        if (templateInfo?.currentVersion) {
          templateInfo.currentVersion.gitList.push({
            id: version.id,
            templateId: version.templateId,
            templateVersionId: version.templateVersionId,
            gitSourceVersionId: version.gitSourceVersionId,
            gitSourceId: version.gitSourceId,
            name: version.name,
            configList: version.configList,
          } as TemplateVersionGit);
          templateInfo.currentVersion.buildDoc = version.buildDoc || '';
          templateInfo.currentVersion.readmeDoc = version.readmeDoc || '';
          templateInfo.currentVersion.updateDoc = version.updateDoc || '';
          templateInfo.versionList.map((item) => {
            if (templateInfo.currentVersion && item.id === templateInfo.currentVersion.id) {
              item = templateInfo.currentVersion;
            }
          });
          this.props.dispatch({
            type: 'template/setTemplateInfo',
            payload: templateInfo,
          });
        }
      },
    });
    this.onCancel();
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
  getGitInfo(id: string) {
    this.props.dispatch({
      type: 'git/getInfo',
      payload: id,
      callback: (info: GitInfo) => {
        this.setState({
          gitInfo: info,
        });
      },
    });
  }

  render() {
    const gitList = this.props.gitList;
    const gitInfo = this.state.gitInfo;
    return (
      <>
        {gitList[0].name && (
          <Modal
            title="添加Git源"
            closable={false}
            visible={this.state.show}
            cancelText="取消"
            okText="保存"
            onCancel={this.onCancel}
            onOk={this.onCommit}
          >
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
              initialValues={this.state.form}
              layout="horizontal"
              onValuesChange={this.onChangeForm}
            >
              <Form.Item label="git源" name="gitId">
                <Select>
                  {gitList.map((item) => (
                    <Option value={item.id} key={item.id} title={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="git源版本" name="version">
                <Select>
                  {gitInfo?.versionList.map((item) => (
                    <Option value={item.id} key={item.id} title={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </>
    );
  }
}

export default connect(({ git, template }: ConnectState) => {
  return {
    gitList: git.gitList,
    templateInfo: template.templateInfo,
  };
})(CreateTemplateVersion);
