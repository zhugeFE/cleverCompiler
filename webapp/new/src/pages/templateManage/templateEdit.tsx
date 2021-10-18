/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-04 15:09:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-18 14:57:29
 */

import { connect } from 'dva';
import React from 'react';
import styles from './styles/templateEdit.less';
import { withRouter } from 'react-router';
import { IRouteComponentProps } from '@umijs/renderer-react';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { Progress, Spin, Tabs, Tag, Tooltip } from 'antd';
import { GitInstance } from '@/models/git';
import {
  TemplateInfo,
  UpdateTemplateVersion,
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
}

class TemplateEdit extends React.Component<TemplateEditProps, State> {
  constructor(prop: TemplateEditProps) {
    super(prop);
    this.state = {
      showCreateTemplate: false,
      savePercent: 100,
      updateTimeout: 0,
    };

    this.afterCreateTemplate = this.afterCreateTemplate.bind(this);
    this.onCancelCreateTemplate = this.onCancelCreateTemplate.bind(this);
    this.onChangeReadme = this.onChangeReadme.bind(this);
    this.onChangeBuild = this.onChangeBuild.bind(this);
    this.onChangeUpdate = this.onChangeUpdate.bind(this);
    this.cloneChangeDoc = this.cloneChangeDoc.bind(this);
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

  // 新建模板之后
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
  // 取消新建模版
  onCancelCreateTemplate () {
    this.props.history.goBack()
  }

  //异步更新版本里的文档
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


  //更新文档，拷贝状态进行内容替换
  cloneChangeDoc(content: string , key: string){
    const templateInfo = util.clone(this.props.templateInfo);
    if (templateInfo) {
      templateInfo.currentVersion![key] = content;
      templateInfo.versionList.map((item) => {
        if (item.id === templateInfo.currentVersion?.id) {
          item = templateInfo.currentVersion;
        }
      });
    }
    return templateInfo
  }

  //修改操作文档，同步更新状态
  onChangeReadme(content: string) {
    const templateInfo = this.cloneChangeDoc(content, "readmeDoc")
    this.props.dispatch({
      type: 'template/setTemplateInfo',
      payload: templateInfo,
    });
    this.onUpdateVersion();
  }

  //操作部署文档，同步更新状态
  onChangeBuild(content: string) {
    const templateInfo = this.cloneChangeDoc(content, "buildDoc")
    this.props.dispatch({
      type: 'template/setTemplateInfo',
      payload: templateInfo,
    });
    this.onUpdateVersion();
  }

  //修改更新文档，同步更新状态
  onChangeUpdate(content: string) {
    const templateInfo = this.cloneChangeDoc(content, "updateDoc")
    this.props.dispatch({
      type: 'template/setTemplateInfo',
      payload: templateInfo,
    });
    this.onUpdateVersion();
  }


  render() {
    const labelWidth = 75;
    if (!this.props.templateInfo && !this.state.showCreateTemplate) {
      return <Spin className={styles.gitEditLoading} tip="git详情获取中..." size="large"></Spin>;
    }
    return (
      <div className={styles.gitEditPanel}>
        <div className={styles.gitPanelTop}>
          <a
            onClick={() => {
              this.props.history.goBack();
            }}>
            <LeftOutlined />
            返回
          </a>
          <span>
            {
              this.state.savePercent !== 100 && <Progress
                percent={this.state.savePercent}
                size="small"
                strokeWidth={2}
                format={(percent) => (percent === 100 ? 'saved' : 'saving')}
              ></Progress>
            }

          </span>
        </div>
        
        {
          // 是否显示创建模板
          this.state.showCreateTemplate && (
            <CreateTemplate 
              onCommit={this.afterCreateTemplate} 
              onCancel={this.onCancelCreateTemplate}></CreateTemplate>
          )
        }

        {
          this.props.templateInfo && (
            <div className={styles.gitPanelCenter}>
              <TimeLinePanel
                templateInfo={this.props.templateInfo}
              ></TimeLinePanel>
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
                  className={styles.gitConfigs}>
                    
                    {/* 全局配置组件 */}
                    <TemplateGlobalConfigComponent
                      templateId={this.props.templateInfo.id} //模板id
                      templateVersionId={this.props.templateInfo.currentVersion.id} //模板版本id
                      //全局配置项
                      globalConfigList={this.props.templateInfo.currentVersion.globalConfigList}/>
                </Description>

                <Description
                  label="配置项"
                  labelWidth={labelWidth}
                  display="flex"
                  className={styles.gitConfigs}>
                  
                  {/* 配置组件 */}
                  <TemplateConfigPanel
                    templateId={this.props.templateInfo.id} //模板id
                    templateVersionId={this.props.templateInfo.currentVersion.id} //模板版本id
                    globalConfigs={this.props.templateInfo.currentVersion.globalConfigList} //全局配置项
                    gitList={this.props.templateInfo.currentVersion.gitList} //版本git项
                  ></TemplateConfigPanel>

                </Description>

                <Tabs defaultActiveKey="readme" style={{ margin: '10px 0 10px 85px' }}>
                  <Tabs.TabPane tab="使用文档" key="readme">
                    {
                      this.props.templateInfo.currentVersion && (
                        <Markdown
                          // onChange={this.onChangeReadme}
                          DisabledEdit={true}
                          content={this.props.templateInfo.currentVersion.readmeDoc || ''}
                        ></Markdown>
                      )
                    }
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部署文档" key="build">
                    {
                      this.props.templateInfo.currentVersion && (
                        <Markdown
                          // onChange={this.onChangeBuild}
                          DisabledEdit={true}
                          content={this.props.templateInfo.currentVersion.buildDoc || ''}
                        ></Markdown>
                      )
                    }
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="更新内容" key="update">
                    {
                      this.props.templateInfo.currentVersion && (
                        <Markdown
                          // onChange={this.onChangeUpdate}
                          content={this.props.templateInfo.currentVersion.updateDoc || ''}
                        ></Markdown>
                      )
                    }
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

export default connect(({ git, template }: ConnectState) => {
  return {
    gitList: git.gitList,
    templateInfo: template.templateInfo,
  };
})(withRouter(TemplateEdit));
