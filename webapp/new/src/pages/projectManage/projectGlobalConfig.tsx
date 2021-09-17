/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-27 16:13:10
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-15 14:11:05
 */
import { TemplateGlobalConfig } from "@/models/template";
import { ColumnProps  } from "antd/lib/table";
import { Table } from 'antd';
import { connect } from "dva";
import React from "react";
import { Dispatch } from "umi";
import ProjectGlobalConfigEdit from "./projectGlobalConfigEdit";
import styles from "./styles/projectGlobalConfig.less"

export interface Props {
  globalConfigList: TemplateGlobalConfig[] | null;
  dispatch: Dispatch;
}

interface States {
  currentGlobalConfig: TemplateGlobalConfig | null;
}

class ProjectGlobalConfig  extends React.Component<Props, States> {
    constructor(prop: Props){
      super(prop)
      this.state = {
        currentGlobalConfig: null,
      }
      this.onCancelConfig = this.onCancelConfig.bind(this)
    }

    onCancelConfig() {
      this.setState({
        currentGlobalConfig: null
      })
    }

    onEdit(config: TemplateGlobalConfig , type: string){
      switch(type){
        case "edit": {
          this.setState({
            currentGlobalConfig: config
          })
          break
        }
      }
    }

    render () {
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
              </div>
            );
          },
        },
      ];
      return (
        <div className={styles.projectGlobalConfigPanel}>
          {
            this.state.currentGlobalConfig &&(
              <ProjectGlobalConfigEdit
                globalConfig={this.state.currentGlobalConfig}
                onCancel={this.onCancelConfig}
              ></ProjectGlobalConfigEdit>
            )
          }

          <Table
            bordered
            columns={columns}
            rowKey="id"
            dataSource={this.props.globalConfigList || []}
            pagination={{
              pageSize: 3,
              showTotal(totle: number) {
                return `总记录数${totle}`;
              },
            }}/>
        </div>
      )
    }
}

export default connect()(ProjectGlobalConfig)