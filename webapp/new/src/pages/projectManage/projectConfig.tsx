/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-27 16:13:19
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-27 19:42:36
 */

import { ConfigInstance, TemplateConfig, TemplateVersionGit } from "@/models/template";
import { Table, Tabs } from "antd";
import { ColumnProps } from "antd/lib/table";
import { connect } from "dva";
import React from "react"
import projectConfigEdit from './projectConfigEdit';

interface Props {
  gitList: TemplateVersionGit[] | null;
}

interface States {
  activeKey: string | undefined;
  showEditConfig: boolean;
  currentConfig: ConfigInstance | null
}

class ProjectConfig extends React.Component <Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      activeKey: prop.gitList[0].id ,
      showEditConfig: false,
      currentConfig: null
    }
    this.onHideEditConfig = this.onHideEditConfig.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onClickConfig = this.onClickConfig.bind(this)
  }

  onHideEditConfig () {

  }

  onChange(activeKey: string) {
    this.setState({
      activeKey,
    });
  }


  onClickConfig(config: ConfigInstance, type: string, value: any) {
    switch (type) {
      case "edit": {
        this.setState({
          showEditConfig: true,
          currentConfig: config
        })
        return 
      }
    }
  }

  render () {
    const columns: ColumnProps<ConfigInstance>[] = [
      { title: '文件位置', width: 150, ellipsis: true, dataIndex: 'filePath', fixed: 'left' },
      {
        title: '默认值',
        width: 200,
        dataIndex:"value",
        ellipsis: true,
        render: (record: ConfigInstance) => {
          return (
            <span>{record.value || record.sourceValue}</span>
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
              <a onClick={this.onClickConfig.bind(this, record , 'edit')}>编辑</a>
            </div>
          );
        },
      },
    ];
    const { gitList } = this.props
    return (
      <div>
        {/* {
          this.state.showEditConfig && this.state.currentConfig && (
            <projectConfigEdit
              config={this.state.currentConfig}
              onCancel={this.onHideEditConfig}
            ></projectConfigEdit>
          )
        } */}
        { !gitList || !gitList.length ? (
          <Tabs type="editable-card" 
          // className={styles.cardBg} 
          >
            <Tabs.TabPane tab="引导页">引导页面</Tabs.TabPane>
          </Tabs>
        ) : (
          <Tabs
            type="editable-card"
            // className={styles.cardBg}
            onChange={this.onChange}
            activeKey={this.state.activeKey}>
            {gitList.map((item, index) => (
              <Tabs.TabPane  tab={item.name} key={item.id}>
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
    )
  }
}


export default connect()(ProjectConfig)