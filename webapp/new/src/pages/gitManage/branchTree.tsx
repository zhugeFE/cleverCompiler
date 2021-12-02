/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-25 17:32:35
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-01 15:49:04
 */

import { GitInfoBranch } from '@/models/git';
import { Key } from 'antd/lib/table/interface';
import DirectoryTree from 'antd/lib/tree/DirectoryTree';
import React from 'react';
import style from "./styles/branchTree.less";
interface Props {
  autoExpandParent: boolean;
  expandedKeys: string[]
  selectedKeys: string[]
  data: GitInfoBranch[]
  onChange(id: string[], type: string): void;
}

interface State {
  treeData: BranchData[]
}

interface BranchData {
  key: string;
  title: string;
  isLeaf: boolean,
  parentId?: string;
  children?: BranchData[]
}

class BranchTree extends React.Component <Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      treeData: []
    }
    this.onSelect = this.onSelect.bind(this)
    this.onBuildTree = this.onBuildTree.bind(this)
  }

  onBuildTree (propData: GitInfoBranch[]): BranchData[] {    
    const propsBranchList = propData
    const data: BranchData[] = []
    if (propsBranchList.length) {
      propsBranchList.forEach( branch => {
        const sub: BranchData[] = []
        branch.versionList.forEach( version => {
          sub.push({
            title: version.name!,
            key: version.id,
            parentId: branch.id,
            isLeaf: true
          })
        })
        data.push({
          title: branch.name,
          key: branch.id,
          isLeaf: false,
          children: sub
        })
      })
    }
    return data

  }
  onSelect (selectedKeys: Key[],e:any) {
    if (e.node.isLeaf) {
      this.props.onChange( [e.node.parentId, ...selectedKeys,], 'version')
    } else {
      this.props.onChange(selectedKeys as string[], 'branch')
    }

  }
  render () {
    return (
      <div className={style.BranchTreePanel}>
        <DirectoryTree
          showIcon
          expandedKeys={this.props.expandedKeys}
          selectedKeys={this.props.selectedKeys}
          onSelect={this.onSelect}
          treeData={this.onBuildTree(this.props.data)}
        />
      </div>
    )
  }
}

export default BranchTree