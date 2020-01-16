import { Layout, Menu, Icon } from 'antd'
import * as React from 'react'
import './app.less'
const { Header, Sider, Content } = Layout

interface AppState {
  collapsed: boolean
}
class App extends React.Component<any, AppState> {
  constructor (props: null, state: AppState) {
    super(props, state)
    this.state = {
      collapsed: false,
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  render () {
    return (
      <Layout className="app-layout">
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo">COMPILER</div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header className="app-header">
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <Menu className="top-menu"
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">编译</Menu.Item>
              <Menu.Item key="2">管理</Menu.Item>
            </Menu>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default App