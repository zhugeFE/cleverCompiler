/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-19 15:09:03
 */
import { Table, Button, Spin, Form, Input } from 'antd';
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
    version: string;
  };
  showAddModal: boolean;
  searchVaild: boolean;
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
        version: ''
      },
      showAddModal: false,
      searchVaild: true
    }
    this.onSearch = this.onSearch.bind(this)
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

  onSearch (changedValues: any, values: any) {
    // 防抖处理 300ms
    if ( !this.state.searchVaild ) {
      return 
    } 
    this.setState({
      searchVaild: false
    })
    setTimeout(() => {
      this.setState({
        searchVaild: true,
        form: {
          ...this.state.form,
          ...values
        }
      })
    }, 300)
  }
  render() {
    const FormData =  this.state.form
    const showList = this.props.templateList?.filter(item => {
      return new RegExp(FormData.name, 'i').test(item.name) && new RegExp(FormData.version, 'i').test(item.version)
    })
    const columns: ColumnProps<TemplateInstance>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        fixed: 'left',
        width: 250,
        render(text: string, record: TemplateInstance) {
          return <div> {text || '-' || record.name} </div>;
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 280,
        render(text: string, record: TemplateInstance) {
          return <div> {text || '-' || record.description} </div>;
        },
      },
      {
        title: '最新版本号',
        dataIndex: 'version',
        width: 150,
        render(text: string) {
          return text || '-';
        },
      },
      {
        title: '更新时间',
        width: 150,
        dataIndex: 'createTime',
        // defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
        render(text: string) {
          return util.dateTimeFormat(new Date(text)) || '-';
        },
      },
      {
        title: '文档地址',
        dataIndex: 'versionId',
        width:80,
        render(text: string) {
          return (
            <>
              <a href={`?id=${text}type=readmeDoc`}> 说明文档 </a><br />
              <a href={`?id=${text}type=updateDoc`}> 更新文档 </a><br />
              <a href={`?id=${text}type=buildDoc`}> 部署文档 </a>
            </>
          )
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        width: 80,
        fixed: 'right',
        render: (text, record: TemplateInstance) => {
          return (
            <div>
              <a  onClick={this.onClickEdit.bind(this, record)}>
                编辑{' '}
              </a>
              <br />
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
        <div className={styles.topButtons} >
          <Form layout="inline" onValuesChange={this.onSearch}> 
            <Form.Item label="名称" name="name">
              <Input/>
            </Form.Item>
            <Form.Item label="最新版本" name="version">
              <Input/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.onClickEdit.bind(this, null)}>
                新建模板
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          className={styles.tablePanel}
          rowKey="id"
          columns={columns}
          dataSource={showList}
          pagination={{
            pageSize: 5,
            showTotal(totle: number) {
              return `总记录数${totle}`;
            },
          }}
        />
      </div>
    );
  }
}

export default connect(({ template }: ConnectState) => {
  return {
    templateList: template.templateList,
  };
})(withRouter(TemplateList));
