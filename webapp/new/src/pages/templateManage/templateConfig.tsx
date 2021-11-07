/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-09 17:29:16
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-08 01:46:53
 */
import * as React from 'react';
import styles from './styles/templateConfig.less';
import { Select, Table, Tabs } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import {
  TemplateConfig,
  TemplateGlobalConfig,
  TemplateVersionGit,
  UpdateConfigParam,
} from '@/models/template';
import util from '@/utils/utils';
import AddTemplateGitSourse from './addTemplateGitSourse';
import { EditMode, TypeMode, VersionStatus } from '@/models/common';
import UpdateTextConfig from "./updateTextConfig";
import UpdateFileConfig from "./updateFileConfig";

export interface ConfigPanelProps {
  mode: VersionStatus;
  globalConfigList: TemplateGlobalConfig[];
  gitList: TemplateVersionGit[];
  templateId: string;
  templateVersionId: string;
  activeKey: string;
  onChangeGit(activeKey: string): void;
  onSubmit(config: TemplateConfig): void;
  afterDelGit(id: string): void;
  afterAddGit(git: TemplateVersionGit): void;
  dispatch: Dispatch;
}
interface State {
  fileContent: string;
  showAddGitSource: boolean;
  currentConfig: TemplateConfig | null;
}

class GitConfigPanel extends React.Component<ConfigPanelProps, State> {
  globalConfigMap: { [propName: string]: TemplateGlobalConfig } = {};
  constructor(props: ConfigPanelProps) {
    super(props);
    this.props.globalConfigList.map((item: any) => (this.globalConfigMap[String(item.id)] = item))
    this.state = {
      fileContent: "",
      showAddGitSource: false,
      currentConfig: null,
    };
    this.onEdit = this.onEdit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.remove = this.remove.bind(this);
    this.hideAddGitSource = this.hideAddGitSource.bind(this);
    this.onCancelUpdateConfig = this.onCancelUpdateConfig.bind(this);
    this.afterAddGitSource = this.afterAddGitSource.bind(this);
    this.afterUpdateConfig = this.afterUpdateConfig.bind(this);
  }

  onChange(activeKey: string) {
    if (this.props.onChangeGit) this.props.onChangeGit(activeKey)
  }


  onEdit(targetKey: any, action: any) {
    this[action](targetKey);
  }

  // 显示添加gitSource
  add = () => {
    this.setState({
      showAddGitSource: true,
    });
  };

  //隐藏添加gitSource
  hideAddGitSource() {
    this.setState({
      showAddGitSource: false,
    });
  }

  //删除gitSource
  remove(targetKey: string) {
    this.props.dispatch({
      type: 'template/delVersionGit',
      payload: targetKey,
      callback: () => {
        if (this.props.afterDelGit) this.props.afterDelGit(targetKey)
      }
    });
  }
  
  //配置修改
  onChangeConfig(config: TemplateConfig, type: string, value: any) {
    const data = util.clone(config);
    switch (type) {
      case 'globalConfig': {
        data.globalConfigId = value === "0" ? null : value
        break;
      }
      case 'hidden': {
        data.isHidden = Number(!config.isHidden)
        break;
      }
      case "edit": {
        this.props.dispatch({
          type: 'git/getFileContent',
          payload: config.filePath,
          callback: fileContent => {
            this.setState({
              fileContent
            })
          }
        })
        this.setState({
          currentConfig: data
        })
        return 
      }
    }
    this.props.dispatch({
      type: 'template/updateConfig',
      payload: {
        id: data.id,
        isHidden: data.isHidden,
        globalConfigId: data.globalConfigId,
      } as UpdateConfigParam,
      callback: (config: TemplateConfig) => {
        if( this.props.onSubmit) this.props.onSubmit(config)
      }
    });
  }


  //增加git源
  afterAddGitSource(git: TemplateVersionGit){
    this.hideAddGitSource()
    if (this.props.afterAddGit) this.props.afterAddGit(git)
  }

  onCancelUpdateConfig () {
    this.setState({
      currentConfig: null
    })
  }

  afterUpdateConfig (formData: any){
    const form = new FormData()
    for (let key of Object.keys(formData)) {
      if (key == 'file') {
        console.log(formData[key])
        form.append("files", formData[key]['file'])
      } else {
        form.append(key, formData[key])
      }
    }
    form.append("configId", this.state.currentConfig!.id)
    this.props.dispatch({
      type: 'template/updateTemplateConfig',
      payload: form,
      callback: (config: TemplateConfig) => {
        this.setState({
          currentConfig: null
        })
        if (this.props.onSubmit) this.props.onSubmit(config)
      }
    })
  }

  render() {
    const columns: ColumnProps<TemplateConfig>[] = [
      { title: '文件位置', width: 150, ellipsis: true, dataIndex: 'filePath', fixed: 'left' },
      {
        title: '默认值',
        width: 200,
        ellipsis: true,
        render: (record: TemplateConfig) => {
          if (record.typeId == TypeMode.text) {
            return record.targetValue
          }else {
            return JSON.parse(record.targetValue)['originalFilename']
          }
        },
      },
      {
        title: "全局配置",
        width: 150,
        ellipsis: true,
        render: (record: TemplateConfig) => {
          return (
            <Select
              defaultValue={this.globalConfigMap[record.globalConfigId]?.name || "无"}
              style={{ width: '100px' }}
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>{
                  return option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              }
              onChange={this.onChangeConfig.bind(this, record, 'globalConfig')}
            >
              <Select.Option value="0" key="0" title="无">无</Select.Option>
              {this.props.globalConfigList!.map((git) => {
                return (
                  <Select.Option value={git.id} key={git.id} title={git.name}>
                    {git.name}
                  </Select.Option>
                );
              })}
            </Select>
          )
        }
      },
      { title: '描述', width: 100, dataIndex: 'description' , ellipsis: true },
      {
        title: '类型',
        width: 60,
        dataIndex: 'typeId',
        render(value) {
          if (value === 0) return <span>文本</span>;
          if (value === 1) return <span>文件替换</span>;
          if (value === 2) return <span>json</span>;
        },
      },
      {
        title: '匹配规则',
        width: 150,
        ellipsis: true,
        dataIndex: 'reg',
        render(value) {
          if (!value) return <span>-</span>;
          const val = JSON.parse(value);
          const reg = new RegExp(
            val.source,
            `${val.global ? 'g' : ''}${val.ignoreCase ? 'i' : ''}`,
          );
          return <span>{reg.toString()}</span>;
        },
      },
      {
        title: '操作',
        width:100,
        fixed: 'right',
        render: (value: any, record: TemplateConfig) => {
          return (
            <div>
              <a onClick={this.onChangeConfig.bind(this, record , 'edit')}>编辑</a>
              <a
                style={{ marginLeft: '5px', color: record.isHidden ? 'rgba(0,0,0,0,.5)' : '' }}
                onClick={this.onChangeConfig.bind(this, record, 'hidden')}
              >
                {record.isHidden ? '启用' : '隐藏'}
              </a>
            </div>
          );
        },
      },
    ];
    const gitList = this.props.gitList;
    return (
      <div className={styles.templateConfigPanel}>
        {
          this.state.currentConfig && (
            this.state.currentConfig.typeId == TypeMode.text ? (
              <UpdateTextConfig
                mode={EditMode.update}
                config={this.state.currentConfig}
                onCancel={this.onCancelUpdateConfig}
                onSubmit={this.afterUpdateConfig}
              ></UpdateTextConfig>
            ) : (
              <UpdateFileConfig
                mode={EditMode.update}
                config={this.state.currentConfig}
                onCancel={this.onCancelUpdateConfig}
                onSubmit={this.afterUpdateConfig}
              ></UpdateFileConfig>
            )
          )
          
        }
        
        {
          //显示添加git
          this.state.showAddGitSource && 
          <AddTemplateGitSourse 
            existGits={this.props.gitList}
            templateId={this.props.templateId}
            templateVersionId={this.props.templateVersionId}
            afterAdd={this.afterAddGitSource}
            onCancel={this.hideAddGitSource} />
        }
        { !this.props.activeKey ? (
          <Tabs type={this.props.mode == VersionStatus.normal ? 'editable-card' : 'card'} className={styles.cardBg} onEdit={this.onEdit}>
            <Tabs.TabPane tab="引导页">引导页面</Tabs.TabPane>
          </Tabs>
        ) : (
          <Tabs
          type={this.props.mode == VersionStatus.normal ? 'editable-card' : 'card'}
            className={styles.cardBg}
            onChange={this.onChange}
            activeKey={this.props.activeKey}
            onEdit={this.onEdit}>
            {gitList.map((item, index) => {
              return (
                <Tabs.TabPane  tab={item.name} key={item.id}>
                  <Table
                    columns={columns}
                    dataSource={item.configList}
                    rowClassName={ (record) => record.isHidden ? styles.disable : ""}
                    pagination={{
                      pageSize: 3,
                      showTotal(totle: number) {
                        return `总记录数${totle}`;
                      },
                    }}/>
                </Tabs.TabPane>
              )
            })}
          </Tabs>
        )}
      </div>
    );
  }
}
export default connect()(GitConfigPanel);
