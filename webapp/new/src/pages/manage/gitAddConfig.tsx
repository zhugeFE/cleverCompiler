import * as React from 'react';
import { Modal, Card, Row, Col } from 'antd';
import GitTextConfig from './gitTextConfig'
import styles from './styles/gitAddConfig.less'
import { ConfigType, Version } from '@/models/common';
import { connect } from 'dva'
import { GitConfig } from '@/models/git';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { ConnectState } from '@/models/connect';

interface Props {
  gitId: string;
  mode: string;
  version: Version;
  configTypes: ConfigType[];
  dispatch: Dispatch;
  getConfigTypes (): void;
  onClose ?(): void;
  onSubmit ?(config: GitConfig): void;
}
interface State {
  type?: ConfigType;
}
class GitAddConfig extends React.Component<Props, State> {
  static defaultProps = {
    mode: 'add'
  }

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
    // ajax({
    //   url: api.git.addConfig,
    //   method: 'POST',
    //   data: {
    //     sourceId: this.props.gitId,
    //     versionId: this.props.version.id,
    //     typeId: this.state.type.id,
    //     ...formData
    //   }
    // })
    // .then((res: ApiResult<GitConfig>) => {
    //   if (this.props.onSubmit) {
    //     this.props.onSubmit(res.data)
    //   }
    // })
    // .catch(err => {
    //   message.error('保存失败')
    //   console.error('保存配置失败', err)
    // })
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
    let title = this.props.mode === 'add' ? '添加配置' : '修改配置'
    if (this.state.type) {
      switch (this.state.type.key) {
        case 'text':
          return (
            <GitTextConfig 
              gitId={this.props.gitId}
              versionId={this.props.version.id}
              onSubmit={this.onSubmitForm}
              onBack={this.onBack}
              onCancel={this.onCancel}></GitTextConfig>
          )
        case 'file':
          return (
            // <GitFileConfig></GitFileConfig>
            'git file config'
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
          title={title} 
          visible={true} 
          className={styles.addGitConfigModal}
          footer={null}
          onCancel={this.onCancel}>
          <Row gutter={16}>
            {this.props.configTypes.map(config => {
              return (
                <Col span={8} key={config.id}>
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