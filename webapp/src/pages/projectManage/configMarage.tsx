/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-18 14:25:32
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-25 20:03:56
 */
import { TypeMode } from "@/models/common";
import type { TemplateConfig } from "@/models/template";
import { message, Modal, Table } from "antd";
import type { ColumnProps } from "antd/lib/table/Column";
import type { Key } from "antd/lib/table/interface";
import React from "react"

interface Props {
  disabled?: boolean;
  visible: boolean;
  dataSource: TemplateConfig[]
  onAddConfig: (data: string[]) => void;
  onCancel:  () => void; 
}

interface State {
  selectedRowKeys: string[]
}

class ConfigMarage extends React.Component<Props,State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      selectedRowKeys: []
    }
    this.onCancel = this.onCancel.bind(this)
    this.onOk = this.onOk.bind(this)
    this.rowSelectChange = this.rowSelectChange.bind(this)
  }

  onOk () {
    if (this.props.disabled) {
      message.warning("您没有操作权限！")
      return
    }
    if (!this.state.selectedRowKeys.length) {
      message.warn("请选择数据，再来添加！")
      return
    }
    this.props.onAddConfig(this.state.selectedRowKeys)
  }

  onCancel () {
    this.props.onCancel()
  }
  
  rowSelectChange (selectedRowKeys: Key[]) {
    this.setState({
      selectedRowKeys: selectedRowKeys as string[]
    })
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
            return record.typeId == TypeMode.text ? record.targetValue : JSON.parse(record.targetValue).originalFilename
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
      },
      {
        title: '是已显示',
        dataIndex: 'visable',
        width: 70,
        filters: [
          {text: "是", value:"1"},
          {text: "否", value:"0"}
        ],
        filtered: true,
        onFilter: (value, record: TemplateConfig) => record.visable == value,
        render(value: any) {
          return <>{value ? '是' : '否'}</>;
        },
      }      
    ];
    return (
      <Modal
        visible={this.props.visible}
        title="配置项管理"
        centered
        width="60%"
        okText="添加"
        onCancel={this.onCancel}
        onOk={this.onOk}
      >
        <Table
          columns={columns}
          rowKey="id"
          dataSource={this.props.dataSource}
          rowSelection={{type:"checkbox",onChange:this.rowSelectChange}}
          pagination={{
            pageSize: 5,
            showTotal(totle: number) {
              return `总记录数${totle}`;
            },
          }}/>
        
      </Modal>
    )
  }
}

export default ConfigMarage