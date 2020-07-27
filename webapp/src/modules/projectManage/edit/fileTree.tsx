import * as React from 'react';
import { DirNode } from '../../../store/state/common';
import ajax from '../../../utils/ajax';
import api from '../../../store/api';
import { ApiResult } from '../../../utils/ajax';
import { message, Spin } from 'antd';
import DirectoryTree from 'antd/lib/tree/DirectoryTree';
import { DataNode, EventDataNode } from 'rc-tree/lib/interface'
import './styles/fileTree.less'
interface Props {
  gitId: string;
  versionId: string;
  onSelect? (filePath: string, fileType: string): void
}
interface NodeData extends DataNode {
  fileType: string;
}
interface State {
  treeData: NodeData[];
  loading: boolean;
}

class FileTree extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      treeData: [],
      loading: true
    }
    this.onSelect = this.onSelect.bind(this)
  }
  queryTreeData () {
    ajax({
      url: api.git.getFileTree,
      method: 'GET',
      params: {
        id: this.props.gitId,
        versionId: this.props.versionId
      }
    })
    .then((res: ApiResult<DirNode[]>) => {
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
        treeData: iterator(res.data),
        loading: false
      })
    })
    .catch(err => {
      message.error('文件树加载失败')
      console.error('文件树加载失败', err)
    })
  }
  componentDidMount () {
    this.queryTreeData()
  }
  onSelect (selectedKeys: string[], info: {
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
      <div className="file-tree">
        {this.state.loading ? (
          <Spin className="tree-loading"></Spin>
        ) : (
          <DirectoryTree
          treeData={this.state.treeData}
          onSelect={this.onSelect}></DirectoryTree>
        )}
      </div>
    )
  }
}
export default FileTree