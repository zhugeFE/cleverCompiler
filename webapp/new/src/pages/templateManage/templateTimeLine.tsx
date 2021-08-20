/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-09 21:22:00
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-20 16:37:43
 */
import * as React from 'react';
import { Timeline, Tag, Input, Form } from 'antd';
import TimelineItem from 'antd/lib/timeline/TimelineItem';
import { PlusOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import { TemplateInfo, TemplateVersion } from '@/models/template';
import CreateTemplateVersion from './createTemplateVersion';
import styles from './styles/timeline.less';
import util from '@/utils/utils';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { connect } from '@/.umi/plugin-dva/exports';

interface Props {
  templateInfo: TemplateInfo;
  afterAdd?(version: TemplateVersion): void;
  dispatch: Dispatch;
}
interface State {
  currentVersion: TemplateVersion;
  versionList: TemplateVersion[];
  showCreate: boolean;
  filter: string;
}
class TimeLinePanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      versionList: this.props.templateInfo.versionList,
      currentVersion: this.props.templateInfo.versionList[0],
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
    const templateInfo = util.clone(this.props.templateInfo);
    this.setState({
      versionList: templateInfo.versionList,
      currentVersion: templateInfo.versionList[0],
    });
    this.hideAddVersion()
  }
  // 选中项
  onChangeVersion(version: TemplateVersion) {
    const templateInfo = util.clone(this.props.templateInfo);
    if (templateInfo) {
      templateInfo.currentVersion = version;
      this.props.dispatch({
        type: 'template/setTemplateInfo',
        payload: templateInfo,
      });
    }
    this.setState({
      currentVersion: version,
    });
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
            version={this.state.versionList[0].version}
            id={this.props.templateInfo.id}
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
          {this.state.versionList
            .filter((version) => {
              return new RegExp(this.state.filter).test(version.version);
            })
            .map((version) => {
              if (version === this.state.currentVersion) {
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
