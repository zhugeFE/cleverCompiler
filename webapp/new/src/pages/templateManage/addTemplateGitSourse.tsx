/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-10 18:48:36
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-23 10:49:25
 */
import { Form, message, Modal, Select } from 'antd';
import React from 'react';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { connect } from 'dva';
import util from '@/utils/utils';
import {
  CreateTemplateVersionGitParams,
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
  templateId: string;
  templateVersionId: string;
  existGits: TemplateVersionGit[];
  gitList: GitInstance[];
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

  onCancel() {
    if (this.props.onCancel) this.props.onCancel();
  }

  onCommit() {
    const { gitId, version } = this.state.form

    if( !gitId || !version){
      message.error('数据未填写完整！', 1);
      return
    }
    const data: CreateTemplateVersionGitParams = {
      templateId: this.props.templateId,
      templateVersionId: this.props.templateVersionId,
      gitSourceId: gitId,
      gitSourceVersionId: version,
    };
    this.props.dispatch({
      type: 'template/addVersionGit',
      payload: data,
      callback: () => {
        if (this.props.onCancel) this.props.onCancel();
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
      payload: id,
      callback: (info: GitInfo) => {
        this.setState({
          gitInfo: info,
        });
      },
    });
  }

  render() {
    const existGits = {}
    this.props.existGits.map(item => {existGits[String(item.gitSourceId)]=true})
    const gitList = this.props.gitList.filter(item => !existGits[item.id])
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
              <Form.Item label="git源版本" name="version" >
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

export default connect(({ git }: ConnectState) => {
  return {
    gitList: git.gitList,
  };
})(CreateTemplateVersion);
