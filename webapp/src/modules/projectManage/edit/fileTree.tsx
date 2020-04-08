import * as React from 'react';
import { DirNode } from '../../../store/state/common';
import ajax from '../../../utils/ajax';
import api from '../../../store/api';
import { ApiResult } from '../../../utils/ajax';
import { message } from 'antd';
import DirectoryTree from 'antd/lib/tree/DirectoryTree';
import { DataNode, EventDataNode } from 'rc-tree/lib/interface'
import './styles/fileTree.less'
interface Props {
  gitId: string;
  onSelect? (filePath: string): void
}
interface State {
  treeData: DataNode[];
}

class FileTree extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      treeData: []
    }
    this.onSelect = this.onSelect.bind(this)
  }
  queryTreeData () {
    ajax({
      url: api.git.getFileTree.replace(':id', this.props.gitId),
      method: 'GET'
    })
    .then((res: ApiResult<DirNode[]>) => {
      function iterator (nodes: DirNode[]): DataNode[] {
        return nodes.map(node => {
          const resNode: DataNode = {
            key: node.filePath,
            title: node.name,
            isLeaf: !node.isDirectory,
            children: iterator(node.children)
          }
          return resNode
        })
      }
      this.setState({
        treeData: iterator(res.data)
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
    selectedNodes: DataNode[];
    nativeEvent: MouseEvent;
  }) {
    if (info.node.isLeaf) {
      if (this.props.onSelect) this.props.onSelect(info.node.key as string)
    }
  }
  render () {
    return (
      <div className="file-tree">
      <DirectoryTree
        treeData={this.state.treeData}
        onSelect={this.onSelect}></DirectoryTree>
      </div>
    )
  }
}
export default FileTree