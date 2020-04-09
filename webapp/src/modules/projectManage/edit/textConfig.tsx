import * as React from 'react';
import { Modal, message, Form, Input, Checkbox } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import FileTree from './fileTree';
import ajax from '../../../utils/ajax';
import api from '../../../store/api';
import { ApiResult } from '../../../utils/ajax';
import GitFileEditor from './fileEditor';
import './styles/textConfig.less'

interface Props {
  gitId: string;
}
interface State {
  fileContent: string;
}
class GitTextConfig extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      fileContent: ''
    }
    this.onSelectFile = this.onSelectFile.bind(this)
  }
  onSelectFile (filePath: string) {
    ajax({
      url: api.git.fileCat,
      method: 'get',
      params: {
        filePath
      }
    })
    .then((res: ApiResult<string>) => {
      this.setState({
        fileContent: res.data
      })
    })
    .catch(err => {
      message.error('文件读取失败')
      console.error('文件读取失败', err)
    })
  }
  render () {
    return (
      <Modal className="git-config-modal" visible={true} title={
        <a><LeftOutlined style={{marginRight: '5px'}}/>切换类型</a>
      } width="90%">
        <FileTree onSelect={this.onSelectFile} gitId={this.props.gitId}></FileTree>
        <div className="git-cm-left-panel git-text-config">
          <Form layout="inline">
            <Form.Item label="匹配正则">
              <Form.Item name="reg" noStyle>
                <Input></Input>
              </Form.Item>
              <Form.Item name="global" valuePropName="global" noStyle>
                <Checkbox>全局</Checkbox>
              </Form.Item>
              <Form.Item name="ignoreCase" valuePropName="ignoreCase" noStyle>
                <Checkbox>忽略大小写</Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item label="替换为" name="value">
              <Input></Input>
            </Form.Item>
            <Form.Item label="配置描述" name="desc">
              <Input></Input>
            </Form.Item>
          </Form>
          <GitFileEditor content={this.state.fileContent}></GitFileEditor>
        </div>
      </Modal>
    )
  }
}

export default GitTextConfig