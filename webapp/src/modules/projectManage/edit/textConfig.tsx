import * as React from 'react';
import { Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import FileTree from './fileTree';

interface Props {
  gitId: string;
}
interface State {}
class GitTextConfig extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.onSelectFile = this.onSelectFile.bind(this)
  }
  onSelectFile (filePath: string, fileType: string) {
    console.log('>>>>', filePath, fileType)
  }
  render () {
    return (
      <Modal className="git-config-modal" visible={true} title={
        <a><LeftOutlined style={{marginRight: '5px'}}/>切换类型</a>
      } width="90%">
        <FileTree onSelect={this.onSelectFile} gitId={this.props.gitId}></FileTree>
      </Modal>
    )
  }
}

export default GitTextConfig