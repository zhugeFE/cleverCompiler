import { Layout, Menu, Icon, Spin } from 'antd'
import * as React from 'react'
import './app.less'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import CompileList from './modules/compile/compileList'
import Compile from './modules/compile/compile'
import history from './utils/history'
import GitSourceList from './modules/projectManage/gitSourceList'
import TemplateList from './modules/projectManage/templateList'
import { MenuClickArg } from './types/antd'
import GitEditPanel from './modules/projectManage/gitEdit'
import TemplateEdit from './modules/projectManage/templateEdit'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { userActions } from './store/actionTypes'
import { RootState, UserState, SysState } from './store/state';
import ajax from './utils/ajax'
import api from './store/api'
const { Header, Sider, Content } = Layout

interface AppState {
  collapsed: boolean,
  path: string
}
interface Props {
  currentUser: UserState,
  sys: SysState
}
class App extends React.Component<any, AppState> {
  constructor (props: Props, state: AppState) {
    super(props, state)
    const path = this.props.location.pathname
    this.state = {
      collapsed: false,
      path
    }
    this.toggle = this.toggle.bind(this)
    this.onClickTopMenu = this.onClickTopMenu.bind(this)
  }
  componentDidMount () {
    this.props.getCurrentUser()
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

  render () {
    const { location } = this.props
    let configMenus = [
      {key: 'template', label: '模板', reg: /^\/project\/template\/\S*/, root: '/project/template/list'},
    {key: 'git', label: 'git源', reg: /^\/project\/git\/\S*/, root: '/project/git/list'}
    ]
    let compileMenus = [
    {key: 'project', label: '项目', reg: /^\/compile\/\S*/, root: '/compile/list'},
      {key: 'compile', label: '编译', reg: /^\/compile$/, root: '/compile'}
    ]
    const menus = /^\/compile/.test(location.pathname) ? compileMenus : configMenus
    let selectedKeys: string[] = []
    menus.forEach(menu => {
      if (menu.reg.test(location.pathname)) selectedKeys.push(menu.key)
    })
    
    function onClickSubMenu (param: MenuClickArg) {
      const chosenMenu = menus.find(menu => {
        return menu.key === param.key
      })
      history.push(chosenMenu.root)
    }
    if (this.props.currentUser) {
      return (
        <Layout className="app-layout">
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo">{this.state.collapsed ? 'C' : 'COMPILER'}</div>
            <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} onClick={onClickSubMenu}>
              {menus.map(menu => {
                return (
                  <Menu.Item key={menu.key}>
                    <Icon type="user"/>
                    {this.state.collapsed ? '' : menu.label}
                  </Menu.Item>
                )
              })}
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
                selectedKeys={[/project/.test(location.pathname) ? 'project' : 'compile']}
                onClick={this.onClickTopMenu}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="compile">编译管理</Menu.Item>
                <Menu.Item key="project">配置管理</Menu.Item>
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
                <Route path="/project/git/:id">
                  <GitEditPanel></GitEditPanel>
                </Route>
                <Route path="/project/template/list">
                  <TemplateList></TemplateList>
                </Route>
                <Route path="/project/template/:id">
                  <TemplateEdit></TemplateEdit>
                </Route>
                <Route path="/">
                  <Redirect to="/project/git/list"></Redirect>
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      )
    } else {
      return (
        <div className="app-loading">
          <Spin tip="系统加载中..." size="large"></Spin>
        </div>
      )
    }
  }
}
const mapStateToProps = (state: RootState) => {
  return {
    currentUser: state.user.current
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getCurrentUser: () => {
      ajax({
        url: api.user.getCurrent
      }).then(res => {
        dispatch({
          type: userActions.UPDATE_CURRENT,
          value: res.data
        })
      })
    }
  }
}
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))