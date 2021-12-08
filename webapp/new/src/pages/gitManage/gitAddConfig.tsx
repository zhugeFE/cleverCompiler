import * as React from 'react';
import { Modal, Card, Row, Col } from 'antd';
import GitTextConfig from './gitTextConfig';
import GitFileConfig from './gitFileConfig';
import styles from './styles/gitAddConfig.less'
import { ConfigType, EditMode } from '@/models/common';
import { connect } from 'dva'
import { GitConfig } from '@/models/git';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { ConnectState } from '@/models/connect';

interface Props {
  gitId: string;
  versionId: string;
  branchId: string;
  configTypes: ConfigType[];
  dispatch: Dispatch;
  onClose ?(): void;
  onSubmit ?(config: GitConfig): void;
}
interface State {
  type?: ConfigType;
}
class GitAddConfig extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)
    this.state = {}
    this.onSubmitForm = this.onSubmitForm.bind(this)
    this.onBack = this.onBack.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  componentDidMount () {
    this.queryConfigTypes()
  }

  queryConfigTypes () {
    this.props.dispatch({
      type: 'sys/queryConfigTypes'
    })
  }

  onClickType (configType: ConfigType) {
    this.setState({
      type: configType
    })
  }

  onSubmitForm (formData: any) {
    const form = new FormData()
    for (let key of Object.keys(formData)) {
      if (key == 'file') {
        form.append("files", formData[key]['file'])
      } else {
        form.append(key, formData[key])
      }
    }
    form.append("sourceId", this.props.gitId)
    form.append("versionId", this.props.versionId)
    form.append("typeId", String(this.state.type!.id))
    form.append("branchId", this.props.branchId)
    this.props.dispatch({
      type: 'git/addConfig',
      payload: form,
      callback: (config: GitConfig) => {
        if (this.props.onSubmit) this.props.onSubmit(config)
      }
    })
  }

  onCancel () {
    if (this.props.onClose) this.props.onClose()
  }

  onBack () {
    this.setState({
      type: undefined
    })
  }

  render () {
    if (this.state.type) {
      switch (this.state.type.key) {
        case 'text':
          return (
            <GitTextConfig 
              mode={EditMode.create}
              gitId={this.props.gitId}
              gitVersionId={this.props.versionId}
              onSubmit={this.onSubmitForm}
              onBack={this.onBack}
              onCancel={this.onCancel}></GitTextConfig>
          )
        case 'file':
          return (
            <GitFileConfig
              mode={EditMode.create}
              gitId={this.props.gitId}
              gitVersionId={this.props.versionId}
              onSubmit={this.onSubmitForm}
              onBack={this.onBack}
              onCancel={this.onCancel}
            ></GitFileConfig>
            // 'git file config'
          )
        case 'json':
          return (
            // <GitJsonConfig></GitJsonConfig>
            'git json config'
          )
        default:
          return (
            <div>未知配置类型</div>
          )
      }
    } else {
      return (
        <Modal 
          title="添加配置"
          visible={true} 
          className={styles.addGitConfigModal}
          footer={null}
          onCancel={this.onCancel}>
          <Row gutter={16}>
            {this.props.configTypes.map(config => {
              return (
                <Col span={12} key={config.id}>
                  <Card className={styles.configItem} onClick={this.onClickType.bind(this, config)}>{config.label}</Card>
                </Col>
              )
            })}
          </Row>
        </Modal>
      )
    }
  }
}

export default connect(({sys}: ConnectState) => {
  return {
    configTypes: sys.configTypes
  }
})(GitAddConfig)