/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-18 14:25:32
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-18 14:35:48
 */
import { TypeMode } from "@/models/common";
import { TemplateConfig } from "@/models/template";
import { Modal, Table } from "antd";
import { ColumnProps } from "antd/lib/table/Column";
import React from "react"

interface Props {
  visible: boolean;
  dataSource: TemplateConfig[]
}

interface State {

}

class ConfigMarage extends React.Component<Props,State> {
  constructor (props: Props) {
    super(props)
    this.state = {

    }
  }

  render () {
    const columns: ColumnProps<TemplateConfig>[] = [
      { title: '文件位置', width: 100, ellipsis: true, dataIndex: 'filePath', fixed: 'left' },
      {
        title: '默认值',
        width: 180,
        ellipsis: true,
        render: (record: TemplateConfig) => {
          if ( record.globalConfigId) {
            return "-"
          }else {
            return record.typeId == TypeMode.text ? record.targetValue : JSON.parse(record.targetValue)['originalFilename']
          }
        },
      },
      { title: '描述', width: 100, dataIndex: 'description' },
      {
        title: '类型',
        width: 60,
        dataIndex: 'typeId',
        render(value) {
          if (value === 0) return <span>文本</span>;
          if (value === 1) return <span>文件</span>;
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
      }      
    ];
    return (
      <Modal
        visible={true}
        title="配置项管理"
        centered
        width="40%"
        okText="添加"
      >
        <Table
          columns={columns}
          rowKey="id"
          dataSource={this.props.dataSource}
          pagination={{
            pageSize: 3,
            showTotal(totle: number) {
              return `总记录数${totle}`;
            },
          }}/>
        
      </Modal>
    )
  }
}

export default ConfigMarage