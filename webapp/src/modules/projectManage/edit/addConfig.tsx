import * as React from 'react';
import { Modal } from 'antd';

interface Props {
  mode: 'add' | 'edit'
}
interface State {
  type: number;
}
class GitAddConfig extends React.Component<Props, State> {
  static defaultProps = {
    mode: 'add'
  };
  constructor (props: Props) {
    super(props)
    this.state = {
      type: null
    }
  }
  render () {
    let title = this.props.mode === 'add' ? '添加配置' : '修改配置'
    return (
      <Modal title={title} visible={true}>
      xxxx
      </Modal>
    )
  }
}
export default GitAddConfig