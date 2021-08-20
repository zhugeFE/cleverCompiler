/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-09 17:29:16
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-19 18:35:00
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

export interface ConfigPanelProps {
  templateId: string;
  templateVersionId: string;
  globalConfigs: TemplateGlobalConfig[];
  gitList: TemplateVersionGit[];
  afterChangeConfig?(data: ConfigInstance): void;
  dispatch: Dispatch;
}
interface State {
  activeKey: string | undefined;
  showAddGitSource: boolean;
}

class GitConfigPanel extends React.Component<ConfigPanelProps, State> {
  globalConfigMap: { [propName: string]: TemplateGlobalConfig } = {};
  constructor(props: ConfigPanelProps) {
    super(props);
    this.state = {
      showAddGitSource: false,
      activeKey: props.gitList.length > 0 ? props.gitList[0].id : ""
    };
    this.onChange = this.onChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.remove = this.remove.bind(this);
    this.hideAddGitSource = this.hideAddGitSource.bind(this);
  }

  onChange(activeKey: string) {
    this.setState({
      activeKey,
    });
  }


  componentWillReceiveProps(props: any ){
    console.log(props)
    this.setState({
      activeKey: props.gitList.length > 0 ? props.gitList[0].id : ""
    })
    props.globalConfigs.map((item: any) => (this.globalConfigMap[item.id] = item));
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

  remove(targetKey: string) {
    this.props.dispatch({
      type: 'template/delVersionGit',
      payload: targetKey,
    });
  }
  
  onChangeConfig(config: ConfigInstance, type: string, value: any) {
    const data = util.clone(config);
    switch (type) {
      case 'globalConfig': {
        data.globalConfigId = value;
        break;
      }
      case 'hidden': {
        data.isHidden = Number(!data.isHidden);
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
        if (this.props.afterChangeConfig) {
          this.props.afterChangeConfig(data);
        }
      },
    });
  }

  onConfigEdit(id: string) {
    console.log(id);
  }



  render() {
    const columns: ColumnProps<ConfigInstance>[] = [
      { title: '文件位置', width: 150, ellipsis: true, dataIndex: 'filePath', fixed: 'left' },
      {
        title: '默认值',
        width: 300,
        ellipsis: true,
        render: (record: ConfigInstance) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {record.value || record.sourceValue}
              <Select
                defaultValue={this.globalConfigMap[record.globalConfigId]?.name}
                style={{ width: '100px' }}
                onChange={this.onChangeConfig.bind(this, record, 'globalConfig')}
              >
                {this.props.globalConfigs!.map((git) => {
                  return (
                    <Select.Option value={git.id} key={git.id} title={git.name}>
                      {git.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
          );
        },
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
              <a onClick={this.onConfigEdit.bind(this, record.id)}>编辑</a>
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
