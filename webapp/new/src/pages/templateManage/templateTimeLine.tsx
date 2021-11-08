/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-09 21:22:00
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-08 15:31:40
 */
import * as React from 'react';
import { Timeline, Tag, Input, Form } from 'antd';
import TimelineItem from 'antd/lib/timeline/TimelineItem';
import { PlusOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import { TemplateVersion } from '@/models/template';
import CreateTemplateVersion from './createTemplateVersion';
import styles from './styles/timeline.less';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { connect } from '@/.umi/plugin-dva/exports';

interface Props {
  currentVersion: TemplateVersion;
  versionList: TemplateVersion[]
  afterAdd?(version: TemplateVersion): void;
  onChange?(version: TemplateVersion): void;
  dispatch: Dispatch;
}
interface State {
  showCreate: boolean;
  filter: string;
}
class TimeLinePanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showCreate: false,
      filter: '',
    };
    this.showAddVersion = this.showAddVersion.bind(this);
    this.hideAddVersion = this.hideAddVersion.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.afterAddVersion = this.afterAddVersion.bind(this);
  }

  //添加新版本后 更改state值
  afterAddVersion(version: TemplateVersion) {
    this.hideAddVersion()
    if (this.props.afterAdd) this.props.afterAdd(version)
  }
  // 选中项
  onChangeVersion(version: TemplateVersion) {
    if (this.props.onChange) this.props.onChange(version)
  }

  onFilter(changedValues: { search: string }) {
    this.setState({
      filter: changedValues.search,
    });
  }
  showAddVersion() {
    this.setState({
      showCreate: true,
    });
  }
  hideAddVersion() {
    this.setState({
      showCreate: false
    })
  }

  render() {
    return (
      <div className={styles.timeLinePanel}>
        {this.state.showCreate && (
          <CreateTemplateVersion
            mode="add"
            templateId={this.props.currentVersion.templateId}
            versionList={this.props.versionList}
            onCancel={this.hideAddVersion}
            afterAdd={this.afterAddVersion}
          ></CreateTemplateVersion>
        )}
        <Form layout="inline" onValuesChange={this.onFilter} wrapperCol={{ span: 24 }}>
          <Form.Item name="search">
            <Input.Search className={styles.versionSearch} size="middle" placeholder="x.x.x" />
          </Form.Item>
        </Form>
        <Timeline mode="alternate">
          <TimelineItem
            dot={
              <a onClick={this.showAddVersion}>
                <PlusOutlined />
              </a>
            }
          ></TimelineItem>
          {this.props.versionList
            .filter((version) => {
              try {
                return new RegExp(this.state.filter).test(version.version);
              }
              catch (err){
                
              }
            })
            .map((version) => {
              if (version === this.props.currentVersion) {
                return (
                  <TimelineItem
                    key={version.id || 'i'}
                    color={version.status === 0 ? 'gray' : 'blue'}
                  >
                    <a
                      className={version.status === 0 ? styles.disabled : null}
                      onClick={this.onChangeVersion.bind(this, version)}
                    >
                      <Tag color="blue" title={version.description}>
                        {version.version}
                      </Tag>
                    </a>
                  </TimelineItem>
                );
              } else {
                return (
                  <TimelineItem key={version.id} color={version.status === 0 ? 'gray' : 'blue'}>
                    <a
                      title={version.description}
                      className={version.status === 0 ? styles.disabled : null}
                      onClick={this.onChangeVersion.bind(this, version)}
                    >
                      {version.version}
                    </a>
                  </TimelineItem>
                );
              }
            })}
        </Timeline>
      </div>
    );
  }
}
export default connect()(TimeLinePanel);
