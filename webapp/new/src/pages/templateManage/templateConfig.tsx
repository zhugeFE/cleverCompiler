/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-09 17:29:16
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-23 10:48:28
 */
import * as React from 'react';
import styles from './styles/templateConfig.less';
import { Select, Table, Tabs } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import {
  ConfigInstance,
  TemplateGlobalConfig,
  TemplateVersionGit,
  UpdateConfigParam,
} from '@/models/template';
import util from '@/utils/utils';
import AddTemplateGitSourse from './addTemplateGitSourse';
import EditeTemplateConfig from "./editTemplateConfig";

export interface ConfigPanelProps {
  templateId: string;
  templateVersionId: string;
  globalConfigs: TemplateGlobalConfig[];
  gitList: TemplateVersionGit[];
  dispatch: Dispatch;
}
interface State {
  activeKey: string | undefined;
  showAddGitSource: boolean;
  showEditConfig: boolean;
  currentConfig: ConfigInstance | null;
}

class GitConfigPanel extends React.Component<ConfigPanelProps, State> {
  globalConfigMap: { [propName: string]: TemplateGlobalConfig } = {};
  constructor(props: ConfigPanelProps) {
    super(props);
    this.props.globalConfigs.map((item: any) => (this.globalConfigMap[String(item.id)] = item))
    this.state = {
      showAddGitSource: false,
      activeKey: props.gitList.length > 0 ? props.gitList[0].id : "",
      showEditConfig: false,
      currentConfig: null,
    };
    this.onEdit = this.onEdit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.remove = this.remove.bind(this);
    this.hideAddGitSource = this.hideAddGitSource.bind(this);
    this.onHideEditConfig = this.onHideEditConfig.bind(this);
  }

  onChange(activeKey: string) {
    this.setState({
      activeKey,
    });
  }

  componentWillReceiveProps(props: any ){
    this.setState({
      activeKey: props.gitList.length > 0 ? props.gitList[0].id : ""
    })
    props.globalConfigs.map((item: any) => (this.globalConfigMap[String(item.id)] = item));

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
    });
  }
  
  //配置修改
  onChangeConfig(config: ConfigInstance, type: string, value: any) {
    const data = util.clone(config);
    switch (type) {
      case 'globalConfig': {
        data.globalConfigId = value === "0" ? null : value
        break;
      }
      case 'hidden': {
        data.isHidden = Number(!data.isHidden);
        break;
      }
      case "edit": {
        this.setState({
          showEditConfig: true,
          currentConfig: data
        })
        return 
      }
    }
    this.props.dispatch({
      type: 'template/updateConfig',
      payload: {
        id: data.id,
        defaultValue: data.value,
        isHidden: data.isHidden,
        globalConfigId: data.globalConfigId,
      } as UpdateConfigParam,
      callback: () => {
      }
    });
  }

  onHideEditConfig(){
    this.setState({
      showEditConfig: false,
      currentConfig: null
    })
  }


  render() {
    const columns: ColumnProps<ConfigInstance>[] = [
      { title: '文件位置', width: 150, ellipsis: true, dataIndex: 'filePath', fixed: 'left' },
      {
        title: '默认值',
        width: 200,
        ellipsis: true,
        render: (record: ConfigInstance) => {
          return (
            <span>{record.value || record.sourceValue}</span>
          );
        },
      },
      {
        title: "全局配置",
        width: 150,
        ellipsis: true,
        render: (record: ConfigInstance) => {
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
              {this.props.globalConfigs!.map((git) => {
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
      { title: '描述', width: 100, dataIndex: 'description' },
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
        width: 200,
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
        fixed: 'right',
        render: (value: any, record: ConfigInstance) => {
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
          this.state.showEditConfig && this.state.currentConfig && (
            <EditeTemplateConfig
              config={this.state.currentConfig}
              onCancel={this.onHideEditConfig}
            ></EditeTemplateConfig>
          )
        }
        {
          //显示添加git
          this.state.showAddGitSource && 
          <AddTemplateGitSourse 
            existGits={this.props.gitList}
            templateId={this.props.templateId}
            templateVersionId={this.props.templateVersionId}
            onCancel={this.hideAddGitSource} />
        }
        { !gitList.length ? (
          <Tabs type="editable-card" onEdit={this.onEdit}>
            <Tabs.TabPane tab="引导页">引导页面</Tabs.TabPane>
          </Tabs>
        ) : (
          <Tabs
            type="editable-card"
            onChange={this.onChange}
            activeKey={this.state.activeKey}
            onEdit={this.onEdit}>
            {gitList.map((item, index) => (
              <Tabs.TabPane tab={item.name} key={item.id}>
                <Table
                  columns={columns}
                  dataSource={item.configList}
                  pagination={{
                    pageSize: 3,
                    showTotal(totle: number) {
                      return `总记录数${totle}`;
                    },
                  }}/>
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </div>
    );
  }
}
export default connect()(GitConfigPanel);
