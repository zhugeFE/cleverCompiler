/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-03 18:45:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-20 17:09:34
 */
import { Table, Button, Form, Input } from 'antd';
import { connect } from 'dva';
import React from 'react';
import styles from './styles/templateList.less';
import { ColumnProps } from 'antd/lib/table';
import { TemplateInstance } from '@/models/template';
import { Dispatch, IRouteComponentProps } from 'umi';
import { ConnectState } from '@/models/connect';
import { withRouter } from 'react-router';
import util from '@/utils/utils';
import CopyTemplate from './copyTemplate';

interface State {
  form: {
    name: string;
    version: string;
  };
  selectedRowKeys: string[];
  searchVaild: boolean;
  currentTemplate: TemplateInstance | null;
}

interface TemplateListProps extends IRouteComponentProps {
  templateInfo: TemplateInstance[];
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
      selectedRowKeys: [],
      searchVaild: true,
      currentTemplate: null
    }
    this.onSearch = this.onSearch.bind(this)
    this.onCreateTemplate = this.onCreateTemplate.bind(this)
    this.rowSelectChange = this.rowSelectChange.bind(this)
    this.afterCopyTemplate = this.afterCopyTemplate.bind(this)
    this.onCancelCopyTemplate = this.onCancelCopyTemplate.bind(this)
  }

  componentDidMount() {
    this.getTemplate()
  }

  getTemplate () {
    this.props.dispatch({
      type: 'template/query',
    });
  }

  afterCopyTemplate () {
    this.setState({
      currentTemplate: null
    })
    this.getTemplate()
  }

  onCancelCopyTemplate () {
    this.setState({
      currentTemplate: null
    })
  }

  onClickCopyTemplate (template: TemplateInstance) {
    this.setState({
      currentTemplate: template
    })
  }

  onClickUpdateEntry (template: TemplateInstance){
    this.props.history.push(`/manage/template/updateInfo/${template.id}?vid=${template.versionId}`)
  }

  onClickEdit(template: TemplateInstance) {
    if (!template.enable) return
    this.props.history.push(`/manage/template/${template.id}`);
  }

  onCreateTemplate () {
    this.props.history.push(`/manage/template/createTemplate`);
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
  rowSelectChange (selectedRowKeys: React.Key[], selectedRows: TemplateInstance[]) {
    var arr = selectedRowKeys.map(item => String(item))
    this.setState({
      selectedRowKeys: arr
    })
  }
  onBatchOption (order: string) {
    if (this.state.selectedRowKeys.length == 0) return
    const data = this.state.selectedRowKeys.map( item => { return {id: item, enable: order === 'disable' ? 0 : 1}})
    this.props.dispatch({
      type: 'template/updateTemplateStatus',
      payload: data,
      callback: () => {

      }
    })
  }
  onClickDel (template: TemplateInstance) {
    this.props.dispatch({
      type: 'template/delTemplateInfo',
      payload: template.id,
      callback: () => {
      }
    })
  }
  onChangeStatus (template: TemplateInstance) {
    this.props.dispatch({
      type: 'template/updateTemplateStatus',
      payload: [{
        id: template.id,
        enable: Number(!template.enable)
      }],
      callback: () => {
      }
    })
  }
  render() {
    const FormData =  this.state.form
    const showList = this.props.templateInfo.filter(item => {
      try {
        return new RegExp(FormData.name, 'i').test(item.name) && new RegExp(FormData.version, 'i').test(item.version)
      }
      catch (err){}
    })
    const columns: ColumnProps<TemplateInstance>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        fixed: 'left',
        ellipsis: true,
        render(text: string, record: TemplateInstance) {
          return text || '-' || record.name
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        ellipsis: true,
        render(text: string, record: TemplateInstance) {
          return text || '-' || record.description
        },
      },
      {
        title: '最新版本号',
        dataIndex: 'version',
        ellipsis: true,
        render(text: string) {
          return text || '-';
        },
      },
      {
        title: '更新时间',
        ellipsis: true,
        dataIndex: 'createTime',
        // defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
        render(text: string) {
          return util.dateTimeFormat(new Date(text)) || '-'
        },
      },
      // {
      //   title: '文档地址',
      //   dataIndex: 'versionId',
      //   width:100,
      //   render(text: string) {
      //     return (
      //       <a href={`?id=${text}type=readmeDoc`}> 说明文档 </a>
      //     )
      //   },
      // },
      {
        title: '操作',
        dataIndex: 'handle',
        width: "40%",
        fixed: 'right',      
        render: (text, record: TemplateInstance) => {
          return (
            <div>
              <Button 
                type="primary" 
                style={{marginRight: 5}}
                disabled={!record.enable}
                onClick={this.onClickEdit.bind(this, record)}>编辑</Button>
              <Button 
                type="ghost"
                style={{marginRight: 5}}
                disabled={!record.enable}
                onClick={this.onClickCopyTemplate.bind(this, record)}>拷贝</Button>
              <Button 
                type="ghost"
                style={{marginRight: 5}}
                disabled={!record.enable}
                onClick={this.onClickUpdateEntry.bind(this, record)}>升级</Button>
              {/* <Button 
                type="primary"
                danger 
                style={{marginRight: 5}} 
                disabled={!record.enable}
                onClick={this.onClickDel.bind(this, record)}>删除</Button> */}
              {record.enable ? <Button danger onClick={this.onChangeStatus.bind(this,record)}>禁用</Button> : <Button onClick={this.onChangeStatus.bind(this,record)}>启用</Button> }
            </div>
          );
        },
      },
    ];


    return (
      <div className={styles.main}>
        {
          this.state.currentTemplate && <CopyTemplate 
            templateInfo={this.state.currentTemplate}
            afterCopyTemplate={this.afterCopyTemplate}
            onCancel={this.onCancelCopyTemplate}/>
        }
        <div className={styles.topButtons} >
          <Form layout="inline" onValuesChange={this.onSearch}> 
            <Form.Item label="项目名称" name="name">
              <Input autoComplete="off"/>
            </Form.Item>
            <Form.Item label="最新版本" name="version">
              <Input autoComplete="off"/>
            </Form.Item>
            <Form.Item>
              <Button 
                disabled={!this.state.selectedRowKeys.length}
                type="primary" 
                onClick={this.onBatchOption.bind(this, 'enable')}>批量启用</Button>
            </Form.Item>
            <Form.Item>
              <Button 
                danger 
                disabled={!this.state.selectedRowKeys.length}
                onClick={this.onBatchOption.bind(this, 'disable')}>批量禁用</Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.onCreateTemplate}>
                新建模板
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          className={styles.tablePanel}
          rowSelection={{
            type: "checkbox",
            onChange: this.rowSelectChange
          }}
          rowClassName={ (record) => record.enable ? "" : styles.disable}
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
    templateInfo: template.templateList,
  };
})(withRouter(TemplateList));
