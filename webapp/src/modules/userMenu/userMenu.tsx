import './styles/userMenu.less'
import * as React from 'react';
import { Dropdown, Menu } from 'antd';
import { DownOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { RootState } from '../../store/state/index';
import { connect } from 'react-redux';
import { User } from '../../store/state/user';

interface Props {
  currentUser: User;
}
interface States {}

class UserMenu extends React.Component<Props, States> {
  constructor (props: Props) {
    super(props)
    this.state = {}
  }
  render () {
    const menu = (
      <Menu>
        <Menu.Item key="user">
          <span><UserOutlined />用户管理</span>
        </Menu.Item>
        <Menu.Item key="sys">
          <span><SettingOutlined />系统设置</span>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout">
          <span><LogoutOutlined />退出登录</span>
        </Menu.Item>
      </Menu>
    )
    return (
      <span className="user-menu">
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <a>{this.props.currentUser.name || this.props.currentUser.email}<DownOutlined style={{marginLeft: '5px'}}/></a>
        </Dropdown>
      </span>
    )
  }
}
const mapStateToProps = (state: RootState) => {
  return {
    currentUser: state.user.current
  }
}
export default connect(mapStateToProps)(UserMenu)