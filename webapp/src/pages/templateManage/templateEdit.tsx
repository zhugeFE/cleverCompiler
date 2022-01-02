/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-04 15:09:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-31 19:53:28
 */

import { connect } from 'dva';
import React from 'react';
import styles from './styles/templateEdit.less';
import { withRouter } from 'react-router';
import type { IRouteComponentProps } from '@umijs/renderer-react';
import type { Dispatch, GitInfoBranch } from '@/.umi/plugin-dva/connect';
import type { RadioChangeEvent} from 'antd';
import { Button, message, Progress, Radio, Spin, Tabs, Tag, Tooltip } from 'antd';
import type {
  TemplateInfo,
  TemplateVersion,
} from '@/models/template';
import TimeLinePanel from './templateTimeLine';
import Description from '@/components/description/description';
import Markdown from '@/components/markdown/markdown';
import { LeftOutlined } from '@ant-design/icons';
import util from '@/utils/utils';
import * as _ from 'lodash';
import TemplateConfigPanel from './templateConfig';
import CreateTemplateVersion from './createTemplateVersion';
import TemplateAddGlobalConfig from './addTemplateGlobalConfig';
import TemplateGlobalConfigComponent from './templateGlobalConfig';
import { publicType, VersionStatus } from '@/models/common';
import type { ConnectState } from '@/models/connect';

export interface TemplateEditProps extends IRouteComponentProps<{
    id: string;
  }> {
    templateInfo: TemplateInfo;
    currentVersion: TemplateVersion;
    currentGitId: string;
    dispatch: Dispatch;
}

interface State {
  
  showAddGlobalConfig: boolean;
  savePercent: number;
  updateTimeout: number;
  delTimeout: number;
  delTooltip: string;
  currentBranch: GitInfoBranch | null;
  publicType: number;
}

class TemplateEdit extends React.Component<TemplateEditProps, State> {
  delInterval?: NodeJS.Timeout;
  constructor(prop: TemplateEditProps) {
    super(prop);
    this.state = {
      currentBranch: null,
      showAddGlobalConfig: false,
      savePercent: 100,
      delTimeout: 0,
      delTooltip: '',
      updateTimeout: 0,
      publicType: 0,
    };

    this.onDeleteVersion = this.onDeleteVersion.bind(this);
    this.onCancelGlobalConfig = this.onCancelGlobalConfig.bind(this);
    this.onCancelAddVersion = this.onCancelAddVersion.bind(this);
    this.onChangeReadme = this.onChangeReadme.bind(this);
    this.onChangeBuild = this.onChangeBuild.bind(this);
    this.onChangeUpdate = this.onChangeUpdate.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
    this.afterCreateVersion = this.afterCreateVersion.bind(this);
    this.onAddGlobalConfig = this.onAddGlobalConfig.bind(this);
  }


  componentDidMount() {
    this.delInterval = setInterval( () => this.initDelInterval(this.props.currentVersion), 1000)
    const id = this.props.match.params.id;

    this.getGitList()
    if (id != 'createTemplate') {
      this.getTemplateInfo(id)
    }
  }
  componentDidUpdate () {
    this.delInterval = setInterval( () => this.initDelInterval(this.props.currentVersion), 1000)
  }
  componentWillUnmount () {
    if (this.delInterval) clearInterval(this.delInterval)
    this.setState = ()=>false
  }

  getTemplateInfo (id: string) {
    this.props.dispatch({
      type: 'template/getInfo',
      payload: id
    });
  }

  getGitList () {
    this.props.dispatch({
      type: 'git/query',
      callback: () => {
      }
    });
  }

  initDelInterval (version: TemplateVersion | null) {
    clearInterval(this.delInterval as unknown as number)
    if (!version || version.status != VersionStatus.normal) {
      this.setState({
        delTimeout: 0,
        delTooltip: ''
      })
      return
    }
    const delTimeout = 24 * 60 * 60 * 1000 - (new Date().getTime() -  new Date(version!.publishTime).getTime())
    const delTooltip = `可删除倒计时：${util.timeFormat(delTimeout)}`
    if (delTimeout <= 0) {
      clearInterval(this.initDelInterval as unknown as number)
    }
    this.setState({
      delTimeout,
      delTooltip
    })
  }
  
  updateVersion(param: object) {
    this.props.dispatch({
      type: 'template/updateVersion',
      payload: param,
    })
  }
  //修改操作文档，同步更新状态
  onChangeReadme(content: string) {
    const readmeDoc = content
    this.updateVersion({
      readmeDoc
    })
  }
  //操作部署文档，同步更新状态
  onChangeBuild(content: string) {
    const buildDoc = content
    this.updateVersion({
      buildDoc
    })
  }
  //修改更新文档，同步更新状态
  onChangeUpdate(content: string) {
    const updateDoc = content
    this.updateVersion({
      updateDoc
    })
  }

  onRadioChange (e: RadioChangeEvent) {
    const publicType = e.target.value
    this.updateVersion({
      publicType
    })
  }

  onDeleteVersion () {
    this.props.dispatch({
      type: 'template/deleteVersion',
      payload: this.props.currentVersion!.id,
      callback: (res: boolean) => {
        if (res) {
          message.success({
            content: "删除版本成功",
            duration: 0.5
          })
        } else {
          message.error({
            content: "删除版本失败",
            duration: 0.5
          })
        }
      }
    })
  }
  afterCreateVersion () {
      this.props.history.replace(`/manage/template/${this.props.currentVersion.templateId}`)
  }
  onCancelAddVersion () {
    this.props.history.goBack()
  }
  
  onAddGlobalConfig () {
    this.setState({
      showAddGlobalConfig: true
    })
  }
  
  onCancelGlobalConfig () {
    this.setState({
      showAddGlobalConfig: false
    })
  }
  onChangeVersionStatue (status: VersionStatus) {
    if (!this.props.currentVersion) return
    this.props.dispatch({
      type: "template/updateTemplateVersionStatus",
      payload: {
        id: this.props.currentVersion.id,
        status: Number(status)
      },
      callback: (res: boolean) => {
        if(res){
          message.success({
            content: "版本状态修改成功",
            duration: 0.5
          })
        } else {
          message.error({
            content: "版本状态修改失败",
            duration: 0.5
          })
        }
      }
    })
  }

  render() {
    const labelWidth = 75;
    if (!this.props.templateInfo && this.props.match.params.id != 'createTemplate') {
      return <Spin className={styles.gitEditLoading} tip="git详情获取中..." size="large" />;
    }
    return (
      <div className={styles.gitEditPanel}>
        {
          this.state.showAddGlobalConfig ? (
              <TemplateAddGlobalConfig            
                onClose={this.onCancelGlobalConfig}
               />
          ): null
        }
        <div className={styles.gitPanelTop}>
          <a
            onClick={() => {
              this.props.history.goBack();
            }}>
            <LeftOutlined />
            返回
          </a>
          <span style={{marginLeft: '20px'}}>
            <Tooltip title="发布后版本将变为只读状态">
              {
                this.props.currentVersion?.status === VersionStatus.placeOnFile ? (
                  <a style={{marginLeft: '10px', color: '#faad14'}}>已发布</a>): (
                  this.props.currentVersion?.status !== VersionStatus.deprecated &&
                  <a style={{marginLeft: '10px', color: '#faad14'}} onClick={()=>this.onChangeVersionStatue(VersionStatus.placeOnFile)} >发布 </a> )
              }
            </Tooltip>
            <Tooltip title="废弃后，新建项目中该版本将不可用">
              {
                this.props.currentVersion?.status === VersionStatus.deprecated ? (
                  <a style={{marginLeft: '10px', color: '#f5222d'}} >已废弃</a>
                ) : (
                  <a style={{marginLeft: '10px', color: '#f5222d'}} onClick={()=>this.onChangeVersionStatue(VersionStatus.deprecated)}>废弃</a>
                )
              }
            </Tooltip>
            {
              this.state.delTimeout > 0 && this.props.currentVersion?.status === VersionStatus.normal ? (
                <span>
                  <a onClick={this.onDeleteVersion} style={{marginLeft: '10px', color: '#f5222d', marginRight: '5px'}}>删除</a>
                  ({this.state.delTooltip})
                </span>
              ) : null
            }
          
            {
              this.state.savePercent !== 100 && <Progress
                percent={this.state.savePercent}
                size="small"
                strokeWidth={2}
                format={(percent) => (percent === 100 ? 'saved' : 'saving')}
               />
            }

          </span>
        </div>
      
        {
          this.props.templateInfo?.versionList.length ? (
            <div className={styles.gitPanelCenter}>
              <TimeLinePanel/>
              <div className={styles.gitDetail}>
                <Description label="项目名称" labelWidth={labelWidth}>
                  {this.props.templateInfo.name}
                  <Tooltip title="版本" placement="bottom">
                    <Tag color="#87d068" style={{ marginLeft: '5px' }}>
                      v:{this.props.currentVersion?.version}
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
                      onAddGlobalConfig={this.onAddGlobalConfig}
                    />

                </Description>

                <Description
                  label="配置项"
                  labelWidth={labelWidth}
                  display="flex"
                  className={styles.gitConfigs}>
                  {/* 配置组件 */}
                  <TemplateConfigPanel/>
                </Description>

                <Description
                  label='发布方式'
                  labelWidth={labelWidth}
                >
                 <Radio.Group onChange={this.onRadioChange} defaultValue={this.state.publicType} disabled={this.props.currentVersion?.status != VersionStatus.normal}>
                    {
                      publicType.map( item => {
                        return <Radio key={item.value} value={item.value}>{item.text}</Radio>
                      })
                    }
                  </Radio.Group>
                </Description>
                
                <Tabs defaultActiveKey="readme" style={{ margin: '10px 0 10px 85px' }}>
                  <Tabs.TabPane tab="使用文档" key="readme">
                    {
                      this.props.currentVersion && (
                        <Markdown
                          DisabledEdit={true}
                          content={this.props.currentVersion.readmeDoc}
                         />
                      )
                    }
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部署文档" key="build">
                    {
                      this.props.currentVersion && (
                        <Markdown
                          // onChange={this.onChangeBuild}
                          DisabledEdit={true}
                          content={this.props.currentVersion.buildDoc}
                         />
                      )
                    }
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="更新内容" key="update">
                    {
                      this.props.currentVersion && (
                        <Markdown
                          // onChange={this.onChangeUpdate}
                          DisabledEdit={true}
                          content={this.props.currentVersion.updateDoc}
                         />
                      )
                    }
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          ) : (
            <CreateTemplateVersion
              mode="init"
              title="创建初始版本"
              afterAdd={this.afterCreateVersion} 
              onCancel={this.onCancelAddVersion}/>
          )
        }
      </div>
    )
  }
}

export default connect( ({template}: ConnectState) => {
  return {
    templateInfo: template.templateInfo!,
    currentVersion: template.currentVersion!,
    currentGitId: template.currentGitId!,
  }
})(withRouter(TemplateEdit));
