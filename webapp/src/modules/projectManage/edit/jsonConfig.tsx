import * as React from 'react';
import './styles/jsonConfig.less'
import { Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

interface Props {}
interface State {}
class GitJsonConfig extends React.Component<Props, State> {
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
export default GitJsonConfig