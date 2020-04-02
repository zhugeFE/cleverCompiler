import './styles/userMenu.less'
import * as React from 'react';
import { Dropdown, Menu } from 'antd';
import { DownOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

interface Props {}
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
          <a>admin<DownOutlined style={{marginLeft: '5px'}}/></a>
        </Dropdown>
      </span>
    )
  }
}
export default UserMenu