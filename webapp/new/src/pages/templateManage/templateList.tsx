/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-18 18:32:30
 */
import { Table, Button, Spin } from 'antd';
import { connect } from 'dva';
import React from 'react';
import styles from './styles/templateList.less';
import { ColumnProps } from 'antd/lib/table';
import { TemplateInstance } from '@/models/template';
import { Dispatch, IRouteComponentProps } from 'umi';
import { ConnectState } from '@/models/connect';
import { withRouter } from 'react-router';
import util from '@/utils/utils';

interface State {
  form: {
    name: string;
  };
  showAddModal: boolean;
}

export interface TemplateListProps extends IRouteComponentProps {
  templateList: TemplateInstance[] | null;
  dispatch: Dispatch;
}

class TemplateList extends React.Component<TemplateListProps, State> {
  constructor(prop: TemplateListProps) {
    super(prop);
    this.state = {
      form: {
        name: '',
      },
      showAddModal: false,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'template/query',
    });
  }

  onClickEdit(template: TemplateInstance | null) {
    const id = template?.id ? template.id : 'createTemplate';
    this.props.history.push(`/manage/template/${id}`);
  }

  onClickEnable(template: TemplateInstance) {
    template.enable = template.enable ? 0 : 1;
    const templateList = util.clone(this.props.templateList);
    if (!templateList) {
      return;
    }
    templateList.map((item) => {
      if (item.id == template.id) {
        item.enable = template.enable;
      }
    });
    this.props.dispatch({
      type: 'template/updateTemplate',
      payload: template,
      callback: () => {
        this.props.dispatch({
          type: 'template/setList',
          payload: templateList,
        });
      },
    });
  }

  render() {
    const columns: ColumnProps<TemplateInstance>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        fixed: 'left',
        width: 300,
        render(text: string, record: TemplateInstance) {
          return <div> {text || '-' || record.name} </div>;
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 300,
        render(text: string, record: TemplateInstance) {
          return <div> {text || '-' || record.description} </div>;
        },
      },
      {
        title: '最新版本号',
        dataIndex: 'version',
        render(text: string) {
          return text || '-';
        },
      },
      {
        title: '更新时间',
        dataIndex: 'create_time',
        render(text: string) {
          return util.dateTimeFormat(new Date(text)) || '-';
        },
      },
      {
        title: '使用文档',
        dataIndex: 'readmeDoc',
        render(text: string) {
          return <a> {text || '-'} </a>;
        },
      },
      {
        title: '部署文档',
        dataIndex: 'buildDoc',
        render(text: string) {
          return <a> {text || '-'} </a>;
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        fixed: 'right',
        render: (text, record: TemplateInstance) => {
          return (
            <div>
              <a style={{ marginRight: 5 }} onClick={this.onClickEdit.bind(this, record)}>
                编辑{' '}
              </a>
              <a onClick={this.onClickEnable.bind(this, record)}>
                {record.enable ? '禁用' : '启用'}{' '}
              </a>
            </div>
          );
        },
      },
    ];

    if (!this.props.templateList) {
      return <Spin className={styles.gitEditLoading} tip="git详情获取中..." size="large" />;
    }
    return (
      <div className={styles.main}>
        <div>
          <div className={styles.topButtons}>
            <Button type="primary" onClick={this.onClickEdit.bind(this, null)}>
              新建模板
            </Button>
          </div>
          <Table
            className={styles.tablePanel}
            rowKey="id"
            columns={columns}
            dataSource={this.props.templateList}
            pagination={{
              pageSize: 5,
              showTotal(totle: number) {
                return `总记录数${totle}`;
              },
            }}
          ></Table>
        </div>
      </div>
    );
  }
}

export default connect(({ template }: ConnectState) => {
  return {
    templateList: template.templateList,
  };
})(withRouter(TemplateList));
