import * as React from 'react';
import { Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import FileTree from './fileTree';

interface Props {
  gitId: string;
}
interface State {}
class GitTextConfig extends React.Component<Props, State> {
  render () {
    return (
      <Modal className="git-config-modal" visible={true} title={
        <a><LeftOutlined style={{marginRight: '5px'}}/>切换类型</a>
      } width="90%">
        <FileTree gitId={this.props.gitId}></FileTree>
      </Modal>
    )
  }
}

export default GitTextConfig