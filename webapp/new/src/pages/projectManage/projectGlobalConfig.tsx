/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-27 16:13:10
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-17 10:29:52
 */
import { TemplateGlobalConfig } from "@/models/template";
import { ColumnProps  } from "antd/lib/table";
import { Button, Table } from 'antd';
import { connect } from "dva";
import React from "react";
import { Dispatch } from "umi";
import TextGlobalConfig from "./TextGlobalConfig";
import FileGlobalConfig from "./FileGlobalConfig";
import styles from "./styles/projectGlobalConfig.less"
import { TypeMode } from "@/models/common";
import util from "@/utils/utils";

export interface Props {
  globalConfigList: TemplateGlobalConfig[];
  onUpdateConfig (config: TemplateGlobalConfig): void;
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
      this.afterUpdateConfig = this.afterUpdateConfig.bind(this)
    }

    onCancelConfig() {
      this.setState({
        currentGlobalConfig: null
      })
    }

    afterUpdateConfig (data: {file?: File, targetValue: string}) {
      if (!this.state.currentGlobalConfig) return
      const globalConfig = util.clone(this.state.currentGlobalConfig)
      globalConfig.targetValue = data.targetValue
      if ( globalConfig.type == TypeMode.file) {
        globalConfig.file = data.file
      }
      this.onCancelConfig()
      this.props.onUpdateConfig(globalConfig)
    }

    onEdit(config: TemplateGlobalConfig){
      this.setState({
        currentGlobalConfig: config
      })
    }

    render () {
      const columns: ColumnProps<TemplateGlobalConfig>[] = [
        { title: '名称', dataIndex: 'name', fixed: 'left' },
        {
          title: '类型',
          width: 80,
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
        { title: '描述', dataIndex: 'description' },
        {
          title: '是否隐藏',
          dataIndex: 'isHidden',
          filters: [
            {text: "是", value:"1"},
            {text: "否", value:"0"}
          ],
          filtered: true,
          onFilter: (value, record: TemplateGlobalConfig) => record.isHidden == value,
          render(value: any) {
            return <>{value ? '是' : '否'}</>;
          },
        },
        {
          title: '操作',
          render: (value: any, record: TemplateGlobalConfig) => {
            return (
              <Button onClick={this.onEdit.bind(this, record)}>编辑</Button>
            );
          },
        },
      ];
      return (
        <div className={styles.projectGlobalConfigPanel}>
          {
            this.state.currentGlobalConfig &&(
              this.state.currentGlobalConfig.type == TypeMode.text ? (
                <TextGlobalConfig
                  globalConfig={this.state.currentGlobalConfig}
                  onCancel={this.onCancelConfig}
                  onSubmit={this.afterUpdateConfig}
                ></TextGlobalConfig>
              ) : (
                <FileGlobalConfig
                  globalConfig={this.state.currentGlobalConfig}
                  onCancel={this.onCancelConfig}
                  onSubmit={this.afterUpdateConfig}
                ></FileGlobalConfig>
              )
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