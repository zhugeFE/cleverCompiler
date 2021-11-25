/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-25 17:32:35
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-25 17:49:24
 */

import { GitInfoBranch } from '@/models/git';
import { Tree } from 'antd';
import React from 'react';
import style from "./styles/branchTree.less";
interface Props {
  branchList: GitInfoBranch[]
}

interface State {
  branchList: BranchData[]
}

interface BranchData {
  key: string;
  title: string;
  icon: "",
  children?: BranchData[]
}

class BranchTree extends React.Component <Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      branchList: []
    }
  }

  componentDidMount () {
    const branchList = this.props.branchList
    if (branchList.length) {
      const data: BranchData[] = []
      branchList.forEach( branch => {
        const sub: BranchData[] = []
        branch.versionList.forEach( version => {
          sub.push({
            title: version.name!,
            key: version.id,
            icon: ""
          })
        })
        data.push({
          title: branch.name,
          key: branch.id,
          icon: '',
          children: sub
        })
      })
      this.setState({
        branchList: data
      }) 
    }
  }

  render () {
    return (
      <div className={style.BranchTreePanel}>
        <Tree
          showIcon
          defaultExpandAll
          treeData={this.state.branchList}
        />
      </div>
    )
  }
}

export default BranchTree