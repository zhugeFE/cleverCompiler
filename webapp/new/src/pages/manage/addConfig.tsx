import { ConfigType, Version } from '@/models/common'
import { GitConfig } from '@/models/git'
import { Card, Col, Modal, Row } from 'antd'
import { connect } from 'dva'
import React from 'react'

export interface GitAddConfigProps {
  gitId: string;
  mode: string;
  version: Version;
  configTypes: ConfigType[];
  getConfigTypes (): void;
  onClose ?(): void;
  onSubmit ?(config: GitConfig): void;
}

interface State {
  type: ConfigType | null;
}

class GitAddConfig extends React.Component<GitAddConfigProps, State> {
  constructor (props: GitAddConfigProps) {
    super(props)
    this.state = {
      type: null
    }

    this.onSubmitForm = this.onSubmitForm.bind(this)
    this.onBack = this.onBack.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  componentDidMount () {
    this.props.getConfigTypes()
  }
  onClickType (configType: ConfigType) {
    this.setState({
      type: configType
    })
  }

  onSubmitForm (formData: any) {
    
  }
  
  onCancel () {
    if (this.props.onClose) this.props.onClose()
  }

  onBack () {
    this.setState({
      type: null
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
            <GitFileConfig></GitFileConfig>
          )
        case 'json':
          return (
            <GitJsonConfig></GitJsonConfig>
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
          className="add-git-config-modal"
          footer={null}
          onCancel={this.onCancel}>
          <Row gutter={16}>
            {this.props.configTypes.map(config => {
              return (
                <Col span={8} key={config.id}>
                  <Card className="config-item" onClick={this.onClickType.bind(this, config)}>{config.label}</Card>
                </Col>
              )
            })}
          </Row>
        </Modal>
      )
  }
}

export default connect()(GitAddConfig)