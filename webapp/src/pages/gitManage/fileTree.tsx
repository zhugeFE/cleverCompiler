/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-05 20:08:04
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-25 18:16:04
 */
import * as React from 'react';
import { Button, Result, Skeleton, Tree } from 'antd';
import type { DataNode, EventDataNode } from 'rc-tree/lib/interface'
import styles from './styles/fileTree.less'
import { connect } from 'dva';
import type { Dispatch } from '@/.umi/core/umiExports';
import type { DirNode } from '@/models/common';
interface NodeData extends DataNode {
  fileType: string;
}
export interface FileTreeProps {
  gitId: string;
  versionId: string;
  defauleSelect?: string;
  dispatch: Dispatch;
  onSelect?: (filePath: string, fileType: string) => void
}
interface State {
  treeData: NodeData[];
  loading: boolean;
  loadErr: boolean;
}

class FileTree extends React.Component<FileTreeProps, State> {
  constructor (props: FileTreeProps) {
    super(props)
    this.state = {
      treeData: [],
      loading: true,
      loadErr: false
    }
    this.onSelect = this.onSelect.bind(this)
    this.queryTreeData = this.queryTreeData.bind(this)
  }

  queryTreeData () {
    this.setState({
      loadErr: false,
      loading: true
    })
    this.props.dispatch({
      type: 'git/getFileTree',
      payload: {
        id: this.props.gitId,
        versionId: this.props.versionId
      },
      callback: (list: DirNode[] | boolean) => {
        if (!list) {
          this.setState({
            loadErr: true,
            loading: false
          })
          return
        }
        function iterator (nodes: DirNode[]): NodeData[] {
          return nodes.map(node => {
            const resNode: NodeData = {
              key: node.filePath,
              title: node.name,
              isLeaf: !node.isDirectory,
              children: iterator(node.children),
              fileType: node.fileType
            }
            return resNode
          })
        }
        this.setState({
          treeData: iterator(list as DirNode[]),
          loading: false
        })
      }
    })
  }

  componentDidMount () {
    this.queryTreeData()
  }
  
  onSelect ( info: {
    event: 'select';
    selected: boolean;
    node: EventDataNode;
    selectedNodes: NodeData[];
    nativeEvent: MouseEvent;
  }) {
    const node = info.selectedNodes[0]
    if (node.isLeaf) {
      if (this.props.onSelect) this.props.onSelect(node.key as string, node.fileType)
    }
  }

  render () {
    return (
      <div className={styles.fileTree}>
        {(() => {
          if (this.state.loadErr) {
            return <Result status="error" subTitle="项目加载失败" extra={[
              <Button 
                disabled={this.state.loading} 
                type="primary" 
                size="small" 
                key="reload"
                onClick={this.queryTreeData}>重新加载</Button>
            ]} />
          }
          if (this.state.loading) {
            return <Skeleton active />
          }
          return <Tree.DirectoryTree
            defaultSelectedKeys={[this.props.defauleSelect!]}
            treeData={this.state.treeData}
            onSelect={(keys, info) => {
              this.onSelect(info)
            }} />
        })()}
      </div>
    )
  }
}
export default connect()(FileTree)