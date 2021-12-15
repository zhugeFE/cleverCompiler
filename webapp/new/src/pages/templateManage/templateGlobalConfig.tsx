/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-11 17:57:37
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-14 17:10:20
 */

import * as React from 'react';
import {Button, message, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { TemplateGlobalConfig } from '@/models/template';
import UpdateTextGlobalConfig from './addTemplateGlobalTextConfig';
import UpdateFileGlobalConfig from './addTemplateGlobalFileConfig';
import { EditMode, TypeMode, VersionStatus } from '@/models/common';
import styles from './styles/templateGlobalConfig.less';
import { ConnectState } from '@/models/connect';


export interface GitConfigPanelProps {
  mode: VersionStatus;
  globalConfigList: TemplateGlobalConfig[];
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
    
    this.afterEditConfig = this.afterEditConfig.bind(this)
    this.onCancelEditConfig = this.onCancelEditConfig.bind(this)
  }
  

  onEdit(config: TemplateGlobalConfig , type: string){
    switch(type){
      case "edit": {
        this.setState({
          currentGlobalConfig: config
        })
        break
      }
      case "delete": {
        this.props.dispatch({
          type: 'template/delGlobalConfig',
          payload: config.id,
          callback: (res: boolean) => {
            if (res) {
              message.success({
                content: "删除成功",
                duration: 0.5
              })
            } else {
              message.error({
                content: "删除失败",
                duration: 0.5
              })
            }
          }
        });
        break;
      }
      case "hidden": {
        this.props.dispatch({
          type: 'template/updateGlobalConfigStatus',
          payload: {
            id: config.id,
            status: Number(!config.isHidden)
          },
          callback: (res: boolean) => {
            if (res) {
              message.success({
                content:"修改状态成功",
                duration: 0.5
              })
            } else {
              message.error({
                content:"修改状态失败",
                duration: 0.5,
              })
            }
          }
        })
      }
    }
  }


  onCancelEditConfig(){
    this.setState({
      currentGlobalConfig: null
    })
  }

  afterEditConfig (formData: any) {
    const form = new FormData()
    for (let key of Object.keys(formData)) {
      if (key == 'file') {
        form.append("files", formData[key]['file'])
      } else {
        form.append(key, formData[key])
      }
    }
    form.append("configId", this.state.currentGlobalConfig!.id)
    this.props.dispatch({
      type: 'template/updateGlobalConfig',
      payload: form,
      callback: (res: boolean) => {
        if (res) {
          message.success({
            content: "修改成功",
            duration: 0.5
          })
          this.setState({
            currentGlobalConfig: null
          })
        } else {
          message.error({
            content: "修改失败",
            duration: 0.5
          })
        }
      }
    })
  }

  render() {
    const columns: ColumnProps<TemplateGlobalConfig>[] = [
      { title: '名称', width:150, ellipsis: true, dataIndex: 'name', fixed: 'left' },
      {
        title: '类型',
        width: 60,
        dataIndex: 'type',
        render(value) {
          if (value === 0) return <span>文本</span>;
          if (value === 1) return <span>文件</span>;
          if (value === 2) return <span>json</span>;
        },
      },
      {title: '目标内容', width: 200, ellipsis: true, dataIndex: 'targetValue', render: (text: string, record) => {
        if (record.type == TypeMode.text) {
          return record.targetValue
        }else {
          return JSON.parse(record.targetValue)['originalFilename']
        }
      }},
      { title: '描述', width: 100, ellipsis:true, dataIndex: 'description' },
      {
        title: '是否隐藏',
        width: 100,
        dataIndex: 'isHidden',
        render(value: any) {
          return <>{value ? '是' : '否'}</>;
        },
      },
      {
        title: '操作',
        width:300,
        render: (value: any, record: TemplateGlobalConfig) => {
          return (
            <div>
              <Button
                type="primary"
                disabled={this.props.mode != VersionStatus.normal || !!record.isHidden}
                onClick={this.onEdit.bind(this, record , 'edit')}>编辑</Button>
              <Button 
                style={{ marginLeft: '5px' }} 
                disabled={this.props.mode != VersionStatus.normal}
                onClick={this.onEdit.bind(this, record, 'hidden')}>
               {record.isHidden ? "启用" : "隐藏"}
              </Button>
              <Button type="primary" danger style={{ marginLeft: '5px' }} onClick={this.onEdit.bind(this, record, 'delete')}>
                删除
              </Button>
            </div>
          );
        },
      },
    ];
    return (
      <div>
        {
          this.state.currentGlobalConfig && (
            this.state.currentGlobalConfig.type === TypeMode.text ? (
              <UpdateTextGlobalConfig
                mode={EditMode.update}
                templateId={this.state.currentGlobalConfig.templateId}
                templateVersionId={this.state.currentGlobalConfig.templateVersionId}
                globalConfig={this.state.currentGlobalConfig}
                onCancel={this.onCancelEditConfig}
                onSubmit={this.afterEditConfig}
              ></UpdateTextGlobalConfig>
            ) : (
              <UpdateFileGlobalConfig
                mode={EditMode.update}
                templateId={this.state.currentGlobalConfig.templateId}
                templateVersionId={this.state.currentGlobalConfig.templateVersionId}
                globalConfig={this.state.currentGlobalConfig}
                onCancel={this.onCancelEditConfig}
                onSubmit={this.afterEditConfig}
              ></UpdateFileGlobalConfig>
            )
          )
        }
        <Table
          bordered
          columns={columns}
          rowKey="id"
          dataSource={this.props.globalConfigList}
          rowClassName={ (record) => record.isHidden ? styles.disable : ""}
          pagination={{
            pageSize: 3,
            showTotal(totle: number) {
              return `总记录数${totle}`;
            },
          }}/>
      </div>
    );
  }
}
export default connect( ({template}: ConnectState) => {
  return {
    mode: template.currentVersion?.status!,
    globalConfigList: template.currentVersion?.globalConfigList!,
  }
})(GlobalConfigPanel);
