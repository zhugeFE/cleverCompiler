import * as React from 'react';
import { Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

interface Props {}
interface State {}
class GitFileConfig extends React.Component<Props, State> {
  render () {
    return (
      <Modal visible={true} title={
        <a><LeftOutlined style={{marginRight: '5px'}}/>切换类型</a>
      } width="90%">
        xxx
      </Modal>
    )
  }
}
export default GitFileConfig