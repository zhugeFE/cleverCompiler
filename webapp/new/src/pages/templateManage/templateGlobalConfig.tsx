/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-11 17:57:37
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-20 15:57:26
 */

import * as React from 'react';
import { Button, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { TemplateGlobalConfig } from '@/models/template';
import AddTemplateGlobalConfig from './addTemplateGlobalConfig';
import AddTextConfig from './addTemplateGlobalTextConfig';
import util from '@/utils/utils';

export interface GitConfigPanelProps {
  globalConfigList: TemplateGlobalConfig[];
  templateId: string;
  templateVersionId: string;
  dispatch: Dispatch;
}
interface State {
  showGlobalConfig: boolean;
  mode: string;
  currentGlobalConfig: TemplateGlobalConfig | null ;
}
class GlobalConfigPanel extends React.Component<GitConfigPanelProps, State> {
  constructor(props: GitConfigPanelProps) {
    super(props);
    this.state = {
      showGlobalConfig: false,
      mode: "add",
      currentGlobalConfig: null
    };
    this.onAddGlobalConfig = this.onAddGlobalConfig.bind(this);
    this.onCancelAddGlobalConfig = this.onCancelAddGlobalConfig.bind(this);
    this.onCancelTextConfig = this.onCancelTextConfig.bind(this)
  }
  

  onEdit(config: TemplateGlobalConfig , type: string){
    switch(type){
      case "edit": {
        this.setState({
          mode: "edit",
          currentGlobalConfig: config
        })
        break
      }
      case "delete": {
        this.props.dispatch({
          type: 'template/delComConfig',
          payload: config.id,
        });
        break;
      }
      case "hidden": {
        const data = util.clone(config)
        data.isHidden = Number(!data.isHidden)
        this.props.dispatch({
          type: 'template/updateComConfig',
          payload: data
        })
      }
    }
  }


  //显示添加全局配置
  onAddGlobalConfig() {
    this.setState({
      showGlobalConfig: true,
    });
  }

  //隐藏添加全局配置
  onCancelAddGlobalConfig() {
    this.setState({
      showGlobalConfig: false,
    });
  }

  onCancelTextConfig(){
    this.setState({
      mode: "",
      currentGlobalConfig: null
    })
  }
  render() {
    const columns: ColumnProps<TemplateGlobalConfig>[] = [
      { title: '名称', dataIndex: 'name', fixed: 'left' },
      { title: '默认值', dataIndex: 'defaultValue' },
      { title: '描述', dataIndex: 'description' },
      {
        title: '是否隐藏',
        dataIndex: 'isHidden',
        render(value: any) {
          return <>{value ? '是' : '否'}</>;
        },
      },
      {
        title: '操作',
        render: (value: any, record: TemplateGlobalConfig) => {
          return (
            <div>
              <a onClick={this.onEdit.bind(this, record , 'edit')}>编辑</a>
              <a style={{ marginLeft: '5px' }} onClick={this.onEdit.bind(this, record, 'delete')}>
                删除
              </a>
              <a style={{ marginLeft: '5px' }} onClick={this.onEdit.bind(this, record, 'hidden')}>
               <>{record.isHidden ? "启用" : "隐藏"}</>
              </a>
            </div>
          );
        },
      },
    ];
    return (
      <div>
        {
          this.state.mode === "edit" && this.state.currentGlobalConfig &&(
            <AddTextConfig
              mode={this.state.mode}
              templateId={this.props.templateId}
              templateVersionId={this.props.templateVersionId}
              globalConfig={this.state.currentGlobalConfig}
              onCancel={this.onCancelTextConfig}
            ></AddTextConfig>
          )
        }
        {
          this.state.showGlobalConfig && (
            <AddTemplateGlobalConfig
              templateId={this.props.templateId}
              versionId={this.props.templateVersionId}
              onClose={this.onCancelAddGlobalConfig}/>
          )
        }
        <Table
          bordered
          columns={columns}
          rowKey="id"
          dataSource={this.props.globalConfigList}
          pagination={{
            pageSize: 3,
            showTotal(totle: number) {
              return `总记录数${totle}`;
            },
          }}/>
        <Button onClick={this.onAddGlobalConfig}>添加配置项</Button>
      </div>
    );
  }
}
export default connect()(GlobalConfigPanel);
