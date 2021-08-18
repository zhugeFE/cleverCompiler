/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-04 15:09:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-18 18:32:13
 */

import { connect } from 'dva';
import React from 'react';
import styles from './styles/templateEdit.less';
import { withRouter } from 'react-router';
import { IRouteComponentProps } from '@umijs/renderer-react';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { Button, Progress, Spin, Tabs, Tag, Tooltip } from 'antd';
import { GitInstance } from '@/models/git';
import {
  TemplateInfo,
  TemplateVersion,
  UpdateTemplateVersion,
  TemplateGlobalConfig,
  TemplateVersionGit,
  ConfigInstance,
} from '@/models/template';
import TimeLinePanel from './templateTimeLine';
import Description from '@/components/description/description';
import Markdown from '@/components/markdown/markdown';
import { LeftOutlined } from '@ant-design/icons';
import util from '@/utils/utils';
import * as _ from 'lodash';
import TemplateConfigPanel from './templateConfig';
import CreateTemplate from './createTemplate';
import { ConnectState } from '@/models/connect';
import AddTemplateGlobalConfig from './addTemplateGlobalConfig';
import TemplateGlobalConfigComponent from './templateGlobalConfig';

export interface TemplateEditProps
  extends IRouteComponentProps<{
    id: string;
  }> {
  gitList: GitInstance[];
  templateInfo: TemplateInfo | null;
  dispatch: Dispatch;
}

interface State {
  savePercent: number;
  updateTimeout: number;
  showCreateTemplate: boolean;
  showGlobalConfig: boolean;
}

class TemplateEdit extends React.Component<TemplateEditProps, State> {
  constructor(prop: TemplateEditProps) {
    super(prop);
    this.state = {
      showCreateTemplate: false,
      showGlobalConfig: false,
      savePercent: 100,
      updateTimeout: 0,
    };

    this.afterCreateTemplate = this.afterCreateTemplate.bind(this);
    this.onAddGlobalConfig = this.onAddGlobalConfig.bind(this);
    this.onCancelAddGlobalConfig = this.onCancelAddGlobalConfig.bind(this);
    this.afterAddGlobalConfig = this.afterAddGlobalConfig.bind(this);
    this.afterDelGlobalConfig = this.afterDelGlobalConfig.bind(this);
    this.afterChangeConfig = this.afterChangeConfig.bind(this);
    this.onChangeConfigTab = this.onChangeConfigTab.bind(this);
    this.onChangeReadme = this.onChangeReadme.bind(this);
    this.onChangeBuild = this.onChangeBuild.bind(this);
    this.onChangeUpdate = this.onChangeUpdate.bind(this);
  }

  async componentDidMount() {
    const id = this.props.match.params.id;

    await this.props.dispatch({
      type: 'git/query',
    });

    if (id == 'createTemplate') {
      this.setState({
        showCreateTemplate: true,
      });
      return;
    }

    this.props.dispatch({
      type: 'template/getInfo',
      payload: this.props.match.params.id,
    });
  }

  afterCreateTemplate(template: TemplateInfo) {
    history.replaceState('', '', `/manage/template/${template.id}`);
    const templateInfo: TemplateInfo = {
      ...template,
      currentVersion: template.versionList[0], //当前版本
    };
    this.props.dispatch({
      type: 'template/setTemplateInfo',
      payload: templateInfo,
    });
  }

  onUpdateVersion() {
    if (this.state.updateTimeout) {
      clearTimeout(this.state.updateTimeout);
    }
    this.setState({
      savePercent: _.random(10, 90, false),
      updateTimeout: setTimeout(() => {
        if (this.props.templateInfo?.currentVersion) {
          const { currentVersion } = this.props.templateInfo;
          const param: UpdateTemplateVersion = {
            id: currentVersion.id,
            readmeDoc: currentVersion.readmeDoc,
            buildDoc: currentVersion.buildDoc,
            updateDoc: currentVersion.updateDoc,
          };
          this.props.dispatch({
            type: 'template/updateVersion',
            payload: param,
            callback: () => {
              this.setState({
                savePercent: 100,
              });
            },
          });
        }
      }, 500) as unknown as number,
    });
  }

  onChangeReadme(content: string) {
    const templateInfo = util.clone(this.props.templateInfo);
    if (templateInfo) {
      templateInfo.currentVersion!.readmeDoc = content;
      templateInfo.versionList.map((item) => {
        if (item.id === templateInfo.currentVersion?.id) {
          item = templateInfo.currentVersion;
        }
      });
    }
    this.props.dispatch({
      type: 'template/setTemplateInfo',
      payload: templateInfo,
    });
    this.onUpdateVersion();
  }

  onChangeBuild(content: string) {
    const templateInfo = util.clone(this.props.templateInfo);
    if (templateInfo) {
      templateInfo.currentVersion!.buildDoc = content;
      templateInfo.versionList.map((item) => {
        if (item.id === templateInfo.currentVersion?.id) {
          item = templateInfo.currentVersion;
        }
      });
    }
    this.props.dispatch({
      type: 'template/setTemplateInfo',
      payload: templateInfo,
    });
    this.onUpdateVersion();
  }

  onChangeUpdate(content: string) {
    const templateInfo = util.clone(this.props.templateInfo);
    if (templateInfo) {
      templateInfo.currentVersion!.updateDoc = content;
      templateInfo.versionList.map((item) => {
        if (item.id === templateInfo.currentVersion?.id) {
          item = templateInfo.currentVersion;
        }
      });
    }
    this.props.dispatch({
      type: 'template/setTemplateInfo',
      payload: templateInfo,
    });
    this.onUpdateVersion();
  }

  onChangeConfigTab(id: string) {
    const templateInfo = util.clone(this.props.templateInfo);
    if (templateInfo?.versionList) {
      templateInfo.versionList.map((item) => {
        if (item.id === id) {
          templateInfo.currentVersion = item;
        }
      });
      this.props.dispatch({
        type: 'template/setTemplateInfo',
        payload: templateInfo,
      });
    }
  }

  afterChangeConfig(data: ConfigInstance) {
    const templateInfo = util.clone(this.props.templateInfo);
    if (templateInfo) {
      templateInfo.currentVersion.gitList.map((item) => {
        item.configList.map((config, index) => {
          if (config.id == data.id) {
            item.configList[index] = data;
          }
        });
      });
      templateInfo?.versionList.map((item) => {
        if (item.id == templateInfo?.currentVersion?.id) {
          item = templateInfo.currentVersion;
        }
      });
      this.props.dispatch({
        type: 'template/setTemplateInfo',
        payload: templateInfo,
      });
    }
  }

  onAddGlobalConfig() {
    this.setState({
      showGlobalConfig: true,
    });
  }

  onCancelAddGlobalConfig() {
    this.setState({
      showGlobalConfig: false,
    });
  }
  afterAddGlobalConfig(config: TemplateGlobalConfig) {
    const templateInfo = util.clone(this.props.templateInfo);
    if (templateInfo?.currentVersion) {
      templateInfo.currentVersion.globalConfigList.push(config);
      templateInfo.versionList.map((item) => {
        if (templateInfo.currentVersion && item.id === templateInfo.currentVersion.id) {
          item = templateInfo.currentVersion;
        }
      });
      this.props.dispatch({
        type: 'template/setTemplateInfo',
        payload: templateInfo,
      });
    }

    this.onCancelAddGlobalConfig();
  }

  afterDelGlobalConfig(configId: string) {
    const templateInfo = util.clone(this.props.templateInfo);
    if (templateInfo?.currentVersion) {
      templateInfo.currentVersion.globalConfigList =
        templateInfo.currentVersion.globalConfigList.filter((item) => item.id != configId);
      templateInfo.versionList.map((item) => {
        if (templateInfo.currentVersion && item.id === templateInfo.currentVersion.id) {
          item = templateInfo.currentVersion;
        }
      });
      this.props.dispatch({
        type: 'template/setTemplateInfo',
        payload: templateInfo,
      });
    }
  }

  render() {
    const labelWidth = 75;
    if (!this.props.templateInfo && !this.state.showCreateTemplate) {
      return <Spin className={styles.gitEditLoading} tip="git详情获取中..." size="large"></Spin>;
    }
    return (
      <div className={styles.gitEditPanel}>
        {this.state.showGlobalConfig &&
        this.props.templateInfo &&
        this.props.templateInfo.currentVersion ? (
          <AddTemplateGlobalConfig
            templateId={this.props.templateInfo.id}
            versionId={this.props.templateInfo.currentVersion?.id}
            onClose={this.onCancelAddGlobalConfig}
            onSubmit={this.afterAddGlobalConfig}
          ></AddTemplateGlobalConfig>
        ) : null}
        <div className={styles.gitPanelTop}>
          <a
            onClick={() => {
              this.props.history.goBack();
            }}
          >
            <LeftOutlined />
            返回
          </a>
          <span style={{ marginLeft: '20px' }}>
            <Tooltip title="归档后版本将变为只读状态">
              <a style={{ marginLeft: '10px', color: '#faad14' }}>归档</a>
            </Tooltip>
            <Tooltip title="废弃后，新建项目中该版本将不可用">
              <a style={{ marginLeft: '10px', color: '#f5222d' }}>废弃</a>
            </Tooltip>
            <Progress
              percent={this.state.savePercent}
              size="small"
              strokeWidth={2}
              format={(percent) => (percent === 100 ? 'saved' : 'saving')}
            ></Progress>
          </span>
        </div>
        {this.state.showCreateTemplate ? (
          <div className={styles.gitPanelCenter}>
            <CreateTemplate onCommit={this.afterCreateTemplate}></CreateTemplate>
          </div>
        ) : null}
        {this.props.templateInfo && (
          <div className={styles.gitPanelCenter}>
            <TimeLinePanel></TimeLinePanel>
            <div className={styles.gitDetail}>
              <Description label="项目名称" labelWidth={labelWidth}>
                {this.props.templateInfo.name}
                <Tooltip title="版本" placement="bottom">
                  <Tag color="#87d068" style={{ marginLeft: '5px' }}>
                    v:{this.props.templateInfo.currentVersion?.version}
                  </Tag>
                </Tooltip>
                <Tooltip title="版本发布时间">
                  <Tag color="#f50">
                    {util.dateTimeFormat(new Date(this.props.templateInfo.createTime))}
                  </Tag>
                </Tooltip>
              </Description>
              <Description
                label="全局配置"
                labelWidth={labelWidth}
                display="flex"
                className={styles.gitConfigs}
              >
                <>
                  <TemplateGlobalConfigComponent
                    store={this.props.templateInfo.currentVersion.globalConfigList}
                    afterDelConfig={this.afterDelGlobalConfig}
                  ></TemplateGlobalConfigComponent>
                  <Button onClick={this.onAddGlobalConfig}>添加配置项</Button>
                </>
              </Description>
              <Description
                label="配置项"
                labelWidth={labelWidth}
                display="flex"
                className={styles.gitConfigs}
              >
                <TemplateConfigPanel
                  globalConfigs={this.props.templateInfo.currentVersion.globalConfigList}
                  gitList={this.props.templateInfo.currentVersion.gitList}
                  afterChangeConfig={this.afterChangeConfig}
                ></TemplateConfigPanel>
              </Description>

              <Tabs defaultActiveKey="readme" style={{ margin: '10px 0 10px 85px' }}>
                <Tabs.TabPane tab="使用文档" key="readme">
                  {this.props.templateInfo.currentVersion ? (
                    <Markdown
                      onChange={this.onChangeReadme}
                      content={this.props.templateInfo.currentVersion.readmeDoc || ''}
                    ></Markdown>
                  ) : null}
                </Tabs.TabPane>
                <Tabs.TabPane tab="部署文档" key="build">
                  {this.props.templateInfo.currentVersion ? (
                    <Markdown
                      onChange={this.onChangeBuild}
                      content={this.props.templateInfo.currentVersion.buildDoc || ''}
                    ></Markdown>
                  ) : null}
                </Tabs.TabPane>
                <Tabs.TabPane tab="更新内容" key="update">
                  {this.props.templateInfo.currentVersion ? (
                    <Markdown
                      onChange={this.onChangeUpdate}
                      content={this.props.templateInfo.currentVersion.updateDoc || ''}
                    ></Markdown>
                  ) : null}
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(({ git, template }: ConnectState) => {
  return {
    gitList: git.gitList,
    templateInfo: template.templateInfo,
  };
})(withRouter(TemplateEdit));
