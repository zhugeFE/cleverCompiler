/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-09 21:22:00
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-18 18:32:37
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
import { ConnectState } from '@/models/connect';

interface Props {
  templateInfo: TemplateInfo | null;
  afterAdd?(version: TemplateVersion): void;
  dispatch: Dispatch;
}
interface State {
  currentVersion: TemplateVersion | null;
  versionList: TemplateVersion[];
  showCreate: boolean;
  filter: string;
}
class TimeLinePanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      versionList: this.props.templateInfo!.versionList,
      currentVersion: this.props.templateInfo!.versionList[0],
      showCreate: false,
      filter: '',
    };
    this.toAddVersion = this.toAddVersion.bind(this);
    this.onChooseVersion = this.onChooseVersion.bind(this);
    this.afterAdd = this.afterAdd.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onChangeVersion = this.onChangeVersion.bind(this);
  }
  // static getDerivedStateFromProps(props:Props, state: State) {
  //   const version = props.versionList.find(item => item.currentVersionContent?.id === state.currentVersion?.currentVersionContent?.id)
  //   if (!_.isEqual(version, state.currentVersion)) {
  //     return {
  //       currentVersion: version || state.currentVersion
  //     }
  //   }
  //   return null
  // }

  onChangeVersion(version: TemplateVersion) {
    const templateInfo = util.clone(this.props.templateInfo);
    if (templateInfo) {
      templateInfo.currentVersion = version;
      this.props.dispatch({
        type: 'template/setTemplateInfo',
        payload: templateInfo,
      });
    }
  }

  onChooseVersion(version: TemplateVersion) {
    this.setState({
      currentVersion: version,
    });
  }
  onFilter(changedValues: { search: string }) {
    this.setState({
      filter: changedValues.search,
    });
  }
  toAddVersion() {
    this.setState({
      showCreate: true,
    });
  }
  afterAdd(version: TemplateVersion) {
    const templateInfo = util.clone(this.props.templateInfo);
    templateInfo?.versionList.unshift(version);
    templateInfo!.currentVersion = version;
    this.setState({
      versionList: templateInfo?.versionList || [],
      currentVersion: templateInfo?.versionList[0] || null,
    });
    this.props.dispatch({
      type: 'template/setTemplateInfo',
      payload: templateInfo,
    });
    console.log(this.state.versionList);
  }
  render() {
    return (
      <div className={styles.timeLinePanel}>
        {this.state.showCreate ? (
          <CreateTemplateVersion
            version={this.state.currentVersion!.version}
            id={this.props.templateInfo!.id}
            afterAdd={this.afterAdd}
          ></CreateTemplateVersion>
        ) : null}
        <Form layout="inline" onValuesChange={this.onFilter} wrapperCol={{ span: 24 }}>
          <Form.Item name="search">
            <Input.Search className={styles.versionSearch} size="middle" placeholder="x.x.x" />
          </Form.Item>
        </Form>
        <Timeline mode="alternate">
          <TimelineItem
            dot={
              <a onClick={this.toAddVersion}>
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
                      onClick={this.onChooseVersion.bind(this, version)}
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
                      onClick={this.onChooseVersion.bind(this, version)}
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
export default connect(({ template }: ConnectState) => {
  return {
    templateInfo: template.templateInfo,
  };
})(TimeLinePanel);
