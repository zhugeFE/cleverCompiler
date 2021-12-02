/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-29 17:49:55
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-02 14:44:49
 */

import { GitInfo, GitInfoBranch, GitVersion } from '@/models/git';
import { Button } from 'antd';
import React from 'react';
import BranchTree from './branchTree';
import styles from './styles/leftPanel.less';
import CreateGitVersion from './createGitVersion';

interface Props {
  disabled: boolean;
  expandedKeys: string[];
  selectedKeys: string[];
  data: GitInfoBranch[];
  gitId: string;
  repoId: string;
  versionList: GitVersion[];
  onChange(id: string[], type: string): void;
  deleteBranch(): void;
  afterAdd(gitInfo: GitInfo): void;
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
    
  }

  onHideAddBranch () {
    this.setState({
      showAddType: '',
    })
  }
  afterAdd (gitInfo: GitInfo) {
    this.state.showAddType == 'branch' ? this.onHideAddBranch() : this.onCancelAddVersion()
    if (this.props.afterAdd) this.props.afterAdd(gitInfo)
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


  renderAddComponent () {
    if (this.state.showAddType == 'branch') {
      return (
        <CreateGitVersion 
          mode='branch'
          gitId={this.props.gitId} 
          title='新建分支'
          repoId={this.props.repoId}
          versionList={this.props.versionList}
          onCancel={this.onHideAddBranch}
          afterAdd={this.afterAdd}></CreateGitVersion>
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
          afterAdd={this.afterAdd}></CreateGitVersion>
      )
    }
  }
  render () {
    return (
      <div className={styles.leftPanel}>          
        { this.renderAddComponent() }
        <div className={styles.leftPanelTopBtns}>
          <Button onClick={this.onClickAddBranch}>添加分支</Button>
          <Button onClick={this.props.deleteBranch}>删除分支</Button>
          <Button onClick={this.onClickAddVersion} >添加版本</Button>
        </div>
        <BranchTree
          autoExpandParent={true}
          expandedKeys={this.props.expandedKeys}
          selectedKeys={this.props.selectedKeys}
          data={this.props.data}
          onChange={this.props.onChange}
        ></BranchTree>
      </div>
    )
  }
}

export default  LeftPanel