import { Layout, Menu, Icon } from 'antd'
import * as React from 'react'
import './app.less'
import { Route, Switch, withRouter } from 'react-router-dom';
import CompileList from './modules/compile/compileList';
import Compile from './modules/compile/compile';
import history from './utils/history';
import GitSourceList from './modules/projectManage/gitSourceList';
import TemplateList from './modules/projectManage/templateList';
import { MenuClickArg } from './types/antd';
const { Header, Sider, Content } = Layout

interface AppState {
  collapsed: boolean,
  path: string,
  selectedKeys: string[]
}
class App extends React.Component<any, AppState> {
  constructor (props: null, state: AppState) {
    super(props, state)
    const path = this.props.location.pathname
    this.state = {
      collapsed: false,
      path,
      selectedKeys: [/project/.test(path) ? 'project' : 'compile']
    }
    this.toggle = this.toggle.bind(this)
    this.onClickTopMenu = this.onClickTopMenu.bind(this)
  }
  toggle () {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
  onClickTopMenu (param: MenuClickArg) {
    let path = '/project/template/list'
    if (param.key === 'compile') {
      path = '/compile/list'
    }
    history.push(path)
  }
  componentWillUpdate (nextProps: any) {
    if (nextProps && this.props.location.pathname !== nextProps.location.pathname) {
      const path = nextProps.location.pathname
      this.setState({
        path,
        selectedKeys: [/project/.test(path) ? 'project' : 'compile']
      })
    }
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
              selectedKeys={this.state.selectedKeys}
              onClick={this.onClickTopMenu}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="compile">编译管理</Menu.Item>
              <Menu.Item key="project">项目管理</Menu.Item>
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
            <Switch>
              <Route path="/compile/list">
                <CompileList></CompileList>
              </Route>
              <Route path="/compile">
                <Compile></Compile>
              </Route>
              <Route path="/project/git/list">
                <GitSourceList></GitSourceList>
              </Route>
              <Route path="/project/template/list">
                <TemplateList></TemplateList>
              </Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(App)