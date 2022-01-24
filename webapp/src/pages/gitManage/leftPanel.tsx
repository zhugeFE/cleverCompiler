/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-29 17:49:55
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-14 14:58:55
 */

import type { GitInfo, GitInfoBranch, GitVersion } from '@/models/git';
import { Button } from 'antd';
import React from 'react';
import BranchTree from './branchTree';
import styles from './styles/leftPanel.less';
import CreateGitVersion from './createGitVersion';
import type { ConnectState } from '@/models/connect';
import type { Dispatch } from 'dva';
import { connect } from 'dva';
import { VersionStatus } from '@/models/common';
import type { IRouteProps } from '@umijs/types';

interface Props extends IRouteProps{
  disabled: boolean;
  gitInfo: GitInfo;
  expandedKeys: string[];
  selectedKeys: string[];
  data: GitInfoBranch[];
  gitId: string;
  repoId: string;
  versionList: GitVersion[];
  dispatch: Dispatch;
}

interface State {
  showAddType: string;
}

class LeftPanel extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      showAddType: '',
    }
    this.onClickAddBranch = this.onClickAddBranch.bind(this)
    this.afterAdd = this.afterAdd.bind(this)
    this.onHideAddBranch = this.onHideAddBranch.bind(this)
    this.onClickAddVersion = this.onClickAddVersion.bind(this)
    this.onCancelAddVersion = this.onCancelAddVersion.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onHideAddBranch () {
    this.setState({
      showAddType: '',
    })
  }

  afterAdd () {
    this.state.showAddType == 'branch' ? this.onHideAddBranch() : this.onCancelAddVersion()
  }

  onClickAddBranch () {
    this.setState({
      showAddType: 'branch'
    })
  }

  onClickAddVersion () {
    this.setState({
      showAddType: 'version'
    })
  }

  onCancelAddVersion () {
    this.setState({
      showAddType: ''
    })
  }

  onChange (id: string[], type: string) {
    switch (type) {
      case "branch": 
        this.props.dispatch({
          type: "git/setBranch",
          payload: id[0]
        })
        break
      case "version":
        this.props.dispatch({
          type: "git/setVersion",
          payload: id[1]
        })
        break
      default:
        break
      
    }
  }
  renderAddComponent () {
    if (this.state.showAddType == 'branch') {
      return (
        <CreateGitVersion 
          mode='branch'
          gitId={this.props.gitId}
          title='新建分支'
          gitInfo={this.props.gitInfo}
          repoId={this.props.repoId}
          versionList={this.props.versionList}
          onCancel={this.onHideAddBranch}
          afterAdd={this.afterAdd}/>
      )
    }

    if (this.state.showAddType == 'version') {
      return (
        <CreateGitVersion 
          mode='version'
          gitId={this.props.gitId} 
          title='新建版本'
          repoId={this.props.repoId}
          branchId={this.props.expandedKeys[0]}
          versionList={this.props.versionList}
          onCancel={this.onCancelAddVersion}
          afterAdd={this.afterAdd} />
      )
    }
  }
  render () {
    return (
      <div className={styles.leftPanel}>          
        { this.renderAddComponent() }
        <div className={styles.leftPanelTopBtns}>
          <Button onClick={this.onClickAddBranch}>添加分支</Button>
          {/* <Button onClick={this.props.deleteBranch}>删除分支</Button> */}
          <Button onClick={this.onClickAddVersion} >添加版本</Button>
        </div>
        <BranchTree
          autoExpandParent={true}
          expandedKeys={this.props.expandedKeys}
          selectedKeys={this.props.selectedKeys}
          data={this.props.data}
          onChange={this.onChange}
         />
      </div>
    )
  }
}

export default connect( ({git}: ConnectState) => {  
  return {
    disabled : git.currentVersion?.status != VersionStatus.normal,
    expandedKeys: [git.currentBranch!.id],
    selectedKeys: [git.currentVersion!.id],
    gitInfo: git.currentGit!,
    data: git.currentGit?.branchList!,
    gitId: git.currentGit?.id!,
    repoId: git.currentGit?.gitId!,
    versionList: git.currentBranch?.versionList!
  }
})(LeftPanel)  