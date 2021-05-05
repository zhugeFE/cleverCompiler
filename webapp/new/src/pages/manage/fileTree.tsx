import * as React from 'react';
import { Spin, Tree } from 'antd';
import { DataNode, EventDataNode } from 'rc-tree/lib/interface'
import styles from './styles/fileTree.less'
import { connect } from 'dva';
import { Dispatch } from '@/.umi/core/umiExports';
import { DirNode } from '@/models/common';
export interface FileTreeProps {
  gitId: string;
  versionId: string;
  dispatch: Dispatch;
  onSelect? (filePath: string, fileType: string): void
}
interface State {
  treeData: DataNode[];
  loading: boolean;
}

class FileTree extends React.Component<FileTreeProps, State> {
  constructor (props: FileTreeProps) {
    super(props)
    this.state = {
      treeData: [],
      loading: true
    }
    this.onSelect = this.onSelect.bind(this)
  }

  queryTreeData () {
    this.props.dispatch({
      type: 'git/getFileTree',
      payload: {
        id: this.props.gitId,
        versionId: this.props.versionId
      },
      callback: (list: DirNode[]) => {
        function iterator (nodes: DirNode[]): DataNode[] {
          return nodes.map(node => {
            const resNode: DataNode = {
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
          treeData: iterator(list),
          loading: false
        })
      }
    })
  }

  componentDidMount () {
    this.queryTreeData()
  }
  
  onSelect (selectedKeys: React.Key[], info: {
    event: 'select';
    selected: boolean;
    node: EventDataNode;
    selectedNodes: DataNode[];
    nativeEvent: MouseEvent;
  }) {
    const node = info.selectedNodes[0]
    if (node.isLeaf) {
      // if (this.props.onSelect) this.props.onSelect(node.key as string, node.fileType)
    }
  }

  render () {
    return (
      <div className={styles.fileTree}>
        {this.state.loading ? (
          <Spin className={styles.treeLoading}></Spin>
        ) : (
          <Tree.DirectoryTree
          treeData={this.state.treeData}
          onSelect={this.onSelect}></Tree.DirectoryTree>
        )}
      </div>
    )
  }
}
export default connect()(FileTree)