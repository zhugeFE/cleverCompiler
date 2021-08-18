/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-11 17:57:37
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-18 18:32:22
 */

import * as React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { TemplateGlobalConfig } from '@/models/template';

export interface GitConfigPanelProps {
  store: TemplateGlobalConfig[];
  afterDelConfig(configId: string): void;
  dispatch: Dispatch;
}
interface State {}
class GlobalConfigPanel extends React.Component<GitConfigPanelProps, State> {
  constructor(props: GitConfigPanelProps) {
    super(props);
    this.state = {};
  }
  onDel(config: TemplateGlobalConfig) {
    this.props.dispatch({
      type: 'template/delComConfig',
      payload: config.id,
      callback: () => {
        if (this.props.afterDelConfig) this.props.afterDelConfig(config.id);
      },
    });
  }
  render() {
    const columns: ColumnProps<TemplateGlobalConfig>[] = [
      { title: '名称', dataIndex: 'name', fixed: 'left' },
      { title: '默认值', dataIndex: 'defaultValue' },
      { title: '描述', dataIndex: 'desc' },
      {
        title: '是否隐藏',
        render(value: any) {
          return <>{value ? '否' : '是'}</>;
        },
      },
      {
        title: '操作',
        render: (value: any, record: TemplateGlobalConfig) => {
          return (
            <div>
              <a>编辑</a>
              <a style={{ marginLeft: '5px' }} onClick={this.onDel.bind(this, record)}>
                删除
              </a>
            </div>
          );
        },
      },
    ];
    return (
      <div>
        <Table
          bordered
          columns={columns}
          rowKey="id"
          dataSource={this.props.store}
          pagination={{
            pageSize: 3,
            showTotal(totle: number) {
              return `总记录数${totle}`;
            },
          }}
        ></Table>
      </div>
    );
  }
}
export default connect()(GlobalConfigPanel);
