/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-09 17:29:16
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-20 17:11:35
 */
import * as React from 'react';
import styles from './styles/templateConfig.less';
import { Button, Empty, message, Select, Skeleton, Table, Tabs } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { GitInfo, GitVersion } from '../../models/git';
import {
  TemplateConfig,
  TemplateGlobalConfig,
  TemplateVersion,
  TemplateVersionGit,
} from '@/models/template';
import util from '@/utils/utils';
import AddTemplateGitSourse from './addTemplateGitSourse';
import { EditMode, TypeMode, VersionStatus } from '@/models/common';
import UpdateTextConfig from "./updateTextConfig";
import UpdateFileConfig from "./updateFileConfig";
import { ConnectState } from '@/models/connect';

export interface ConfigPanelProps {
  mode: VersionStatus;
  globalConfigList: TemplateGlobalConfig[];
  gitList: TemplateVersionGit[];
  templateId: string;
  templateVersionId: string;
  activeKey: string;
  gitInfo: GitInfo | null;
  currentVersion: TemplateVersion;
  dispatch: Dispatch;
}
interface State {
  fileContent: string;
  showAddGitSource: boolean;
  currentBranch: string;
  currentConfig: TemplateConfig | null;
  activeKey: string;
  gitInfo: GitInfo | null;

}

class GitConfigPanel extends React.Component<ConfigPanelProps, State> {
  globalConfigMap: { [propName: string]: TemplateGlobalConfig } = {};
  constructor(props: ConfigPanelProps) {
    super(props);
    this.state = {
      fileContent: "",
      currentBranch: "",
      showAddGitSource: false,
      currentConfig: null,
      activeKey: "",
      gitInfo: null,

    };
    this.onEdit = this.onEdit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.remove = this.remove.bind(this);
    this.hideAddGitSource = this.hideAddGitSource.bind(this);
    this.onCancelUpdateConfig = this.onCancelUpdateConfig.bind(this);
    this.afterUpdateConfig = this.afterUpdateConfig.bind(this);
    this.selectGitVersion = this.selectGitVersion.bind(this);
    this.selectGitBranch = this.selectGitBranch.bind(this);
  }

  componentDidMount () {
    if (this.props.activeKey && this.props.currentVersion) {
      this.getGitInfo(this.props.activeKey)
    }
  }

  //获取git版本数据
  getGitInfo(id: string) {
    const gitList = util.clone(this.props.currentVersion.gitList)!
    const currentGit = gitList.filter(item => item.id == id)[0]      
    this.props.dispatch({
      type: 'git/getInfo',
      payload: currentGit.gitSourceId
    });
  }
  
  onChange(activeKey: string) {
    this.setState({
      currentBranch: ""
    })
    this.getGitInfo(activeKey)
    this.props.dispatch({
      type: "template/setCurrentGitId",
      payload: activeKey
    })
  }

  selectGitBranch (value: string) {
    this.setState({
      currentBranch: value
    })
  }
  
  selectGitVersion ( value: string ) {
    // this.props.afterSelectGitVersion( value )
    let versionData: GitVersion
    for (const branch of this.props.gitInfo!.branchList) {
      for (const version of branch.versionList) {
        if (version.id == value) {
          versionData = version
          break
        }
      }
    }
    const currentVersion = util.clone(this.props.currentVersion)
    const data = {}
    if (currentVersion) {
      currentVersion.gitList.map( git => {
        if ( git.id === this.props.activeKey){
          data['id'] = git.id
          data['gitSourceVersionId'] = versionData?.id
          data['configList'] = []
          versionData?.configs.map( config => {
            data['configList'].push({
              templateId: git.templateId,
              templateVersionId: git.templateVersionId,
              templateVersionGitId: git.id,
              gitSourceConfigId: config.id,
              targetValue: config.targetValue,
            })
          })
        }
      })
    }
    this.props.dispatch({
      type: "template/changeGitVersion",
      payload: data,
      callback: (res: boolean) => {
        if( res) {
          message.success("git切换成功")
        } else {
          message.error("git切换失败")
        }
      }
    })
  }

  
  onEdit(targetKey: any, action: any) {
    this[action](targetKey);
  }

  // 显示添加gitSource
  add = () => {
    this.setState({
      currentBranch: "",
      showAddGitSource: true,
    });
  };

  //隐藏添加gitSource
  hideAddGitSource() {
    this.setState({
      showAddGitSource: false,
    });
  }

  //删除gitSource
  remove(targetKey: string) {
    this.props.dispatch({
      type: 'template/delVersionGit',
      payload: targetKey,
      callback: (res: boolean) => {
        if (res) {
          message.success({
            content: "git删除成功",
            duration: 0.5
          })
          this.setState({
            currentBranch: ""
          })
        } else {
          message.error({
            content: "git删除失败",
            duration: 0.5
          })
        }
      }
    });
  }
  
  //配置修改
  onChangeConfig(config: TemplateConfig, type: string, value: any) {
    switch (type) {
      case 'globalConfig': {
        this.props.dispatch({
          type: "template/updateConfigGlobalConfig",
          payload: {
            id: config.id,
            globalConfigId: value === "0" ? null : value,
          },
          callback: (res: boolean) => {
            if (res) {
              message.success({
                content: "全局配置属性修改成功",
                duration: 0.5
              })
            } else {
              message.error({
                content: "全局配置属性修改失败",
                duration: 0.5
              })
            }
          }
        })
        break;
      }
      case 'hidden': {
        this.props.dispatch({
          type: 'template/updateConfigStatus',
          payload: {
            id: config.id,
            status: Number(!config.isHidden)
          },
          callback: (res: boolean) => {
            if (res) {
              message.success({
                content: "修改属性成功",
                duration: 0.5
              })
            } else {
              message.error({
                content: "修改属性失败",
                duration: 0.5
              })
            }
          }
        })
        break;
      }
      case "edit": {
        this.props.dispatch({
          type: 'git/getFileContent',
          payload: config.filePath,
          callback: fileContent => {
            this.setState({
              fileContent,
              currentConfig: config
            })
          }
        })
        return 
      }
    }
  }

  onCancelUpdateConfig () {
    this.setState({
      currentConfig: null
    })
  }

  afterUpdateConfig (formData: any){
    const form = new FormData()
    for (let key of Object.keys(formData)) {
      if (key == 'file') {
        form.append("files", formData[key]['file'])
      } else {
        form.append(key, formData[key])
      }
    }
    form.append("configId", this.state.currentConfig!.id)
    this.props.dispatch({
      type: 'template/updateConfig',
      payload: form,
      callback: (res: boolean) => {
        if(res) {
          message.success({
            content: "配置修改成功",
            duration: 0.5
          })
          this.setState({
            currentConfig: null
          })
        } else {
          message.error({
            content: "配置修改失败",
            duration: 0.5
          })
        }
        
      }
    })
  }

  render() {
    this.props.globalConfigList?.map((item: any) => (this.globalConfigMap[String(item.id)] = item))
    const columns: ColumnProps<TemplateConfig>[] = [
      { title: '文件位置', ellipsis: true, dataIndex: 'filePath', fixed: 'left' },
      {
        title: '默认值',
        ellipsis: true,
        render: (record: TemplateConfig) => {
          if (record.typeId == TypeMode.text) {
            return record.targetValue
          }else {
            return JSON.parse(record.targetValue)['originalFilename']
          }
        },
      },
      {
        title: "全局配置",
        ellipsis: true,
        render: (record: TemplateConfig) => {
          return (
            <Select
              disabled={this.props.mode != VersionStatus.normal || !!record.isHidden}
              defaultValue={this.globalConfigMap[record.globalConfigId]?.name || "无"}
              style={{ width: '100px' }}
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>{
                  return option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              }
              onChange={this.onChangeConfig.bind(this, record, 'globalConfig')}
            >
              <Select.Option value="0" key="0" title="无">无</Select.Option>
              {this.props.globalConfigList!.map((git) => {
                return (
                  <Select.Option value={git.id} key={git.id} title={git.name}>
                    {git.name}
                  </Select.Option>
                );
              })}
            </Select>
          )
        }
      },
      { title: '描述',  dataIndex: 'description' , ellipsis: true },
      {
        title: '类型',
        dataIndex: 'typeId',
        render(value) {
          if (value === 0) return <span>文本</span>;
          if (value === 1) return <span>文件</span>;
          if (value === 2) return <span>json</span>;
        },
      },
      {
        title: '匹配规则',
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
        width: "20%",
        fixed: 'right',
        render: (value: any, record: TemplateConfig) => {
          return (
            <div>
              <Button   
                disabled={this.props.mode != VersionStatus.normal || !!record.isHidden}
                onClick={this.onChangeConfig.bind(this, record , 'edit')}>编辑</Button>
              <Button
                disabled={this.props.mode != VersionStatus.normal}
                style={{ marginLeft: '5px', color: record.isHidden ? 'rgba(0,0,0,0,.5)' : '' }}
                onClick={this.onChangeConfig.bind(this, record, 'hidden')}
              >
                {record.isHidden ? '启用' : '隐藏'}
              </Button>
            </div>
          );
        },
      },
    ];
    const gitList = this.props.gitList;
    const {currentConfig} = this.state;
    return (
      <div className={styles.templateConfigPanel}>
        {
          currentConfig && ((()=>{
            let res = null
            switch(currentConfig.typeId) {
              case TypeMode.text:
                res = <UpdateTextConfig
                  mode={EditMode.update}
                  config={currentConfig}
                  gitId={this.props.gitList.filter(git => currentConfig.templateVersionGitId == git.id)[0]['gitSourceId']}
                  gitVersionId={this.props.gitList.filter(git => currentConfig.templateVersionGitId == git.id)[0]['gitSourceVersionId']}
                  onCancel={this.onCancelUpdateConfig}
                  onSubmit={this.afterUpdateConfig}
                ></UpdateTextConfig>
                break
              case TypeMode.file:
                res = <UpdateFileConfig
                  mode={EditMode.update}
                  config={currentConfig}
                  onCancel={this.onCancelUpdateConfig}
                  onSubmit={this.afterUpdateConfig}
                ></UpdateFileConfig>
                break
              default:
                console.warn('无法识别的配置类型', currentConfig.typeId)
            }
            return res
          })())
        }
        
        {
          //显示添加git
          this.state.showAddGitSource && <AddTemplateGitSourse 
            existGits={this.props.gitList}
            templateId={this.props.templateId}
            templateVersionId={this.props.templateVersionId}
            onCancel={this.hideAddGitSource} />
          }
        { !this.props.activeKey ? (
          <Tabs type='card' className={styles.cardBg} >
            <Tabs.TabPane tab="引导页" className={styles.initTabs}>
              <Empty></Empty>
              {
                this.props.mode == VersionStatus.normal &&
                <Button type="primary" onClick={this.add}>添加git</Button>
              }
            </Tabs.TabPane>
          </Tabs>
        ) : (
          <Tabs
            type={this.props.mode == VersionStatus.normal ? 'editable-card' : 'card'}
            className={styles.cardBg}
            onChange={this.onChange}
            activeKey={this.props.activeKey}
            onEdit={this.onEdit}>
            {gitList.map((item, index) => {
              return (
                
                <Tabs.TabPane className={styles.tabPanel}  tab={`${item.name}-${item.branchName}-${item.version}`} key={item.id}>
                  {
                    this.props.mode == VersionStatus.normal &&  (
                      <div>
                        <Select 
                          placeholder={"切换branch"}
                          size="small" 
                          className={styles.tabHandle} 
                          onChange={this.selectGitBranch}>
                          {
                            !this.props.gitInfo ? (
                              <Select.Option value="" >
                                <Skeleton active></Skeleton>
                              </Select.Option>
                            ): 
                            this.props.gitInfo.branchList.map( item => (
                              <Select.Option 
                                className={styles.VersionDesc}
                                key={item.id}
                                value={item.id}
                              >
                                {this.props.gitInfo?.name} - {item.name}
                                <div>
                                  {item.description}
                                </div>
                              </Select.Option>
                            ))   
                          }
                        </Select>
                        <Select
                          placeholder={"切换version"}
                          size="small"
                          className={styles.tabHandle}
                          onChange={this.selectGitVersion}
                        >
                          {
                            !this.state.currentBranch ? (
                              <Select.Option value="" >
                                <Skeleton active></Skeleton>
                              </Select.Option>
                            ): 
                              this.props.gitInfo?.branchList.filter(item => item.id == this.state.currentBranch)[0].versionList.map( item => (
                              item.status == VersionStatus.placeOnFile && 
                              <Select.Option className={styles.versionDesc} key={item.id} value={item.id}>
                                {this.props.gitInfo?.branchList.filter(item => item.id == this.state.currentBranch)[0].name} -{item.name}
                                <div>
                                  {item.description}
                                </div>
                              </Select.Option>
                            ))   
                          }
                        </Select>
                      </div>
                    )
                  }
                  
                  <Table
                    columns={columns}
                    rowKey="id"
                    dataSource={item.configList}
                    rowClassName={ (record) => record.isHidden ? styles.disable : ""}
                    pagination={{
                      pageSize: 3,
                      showTotal(totle: number) {
                        return `总记录数${totle}`;
                      },
                    }}/>
                </Tabs.TabPane>
              )
            })}
          </Tabs>
        )}
      </div>
    );
  }
}
export default connect(({template, git}: ConnectState) => {  
  return {
    gitInfo: git.currentGit!,
    currentVersion: template.currentVersion!,
    mode: template.currentVersion?.status!,
    activeKey: template.currentGitId!,
    templateId: template.currentVersion?.templateId!,
    templateVersionId: template.currentVersion?.id!,
    gitList: template.currentVersion?.gitList!,
    globalConfigList: template.currentVersion?.globalConfigList!
  }
})(GitConfigPanel);
