import * as React from 'react';
import { Modal, message, Card, Row, Col } from 'antd';
import { RootState } from '../../../store/state/index';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import ajax from '../../../utils/ajax';
import api from '../../../store/api';
import { ApiResult } from '../../../utils/ajax';
import { ConfigType, Version } from '../../../store/state/common';
import { baseActions } from '../../../store/actionTypes';
import './styles/addConfig.less'
import GitTextConfig from './textConfig';
import GitFileConfig from './fileConfig';
import GitJsonConfig from './jsonConfig';

interface Props {
  gitId: string;
  mode: string;
  version: Version;
  configTypes: ConfigType[];
  getConfigTypes (): void;
  onClose ?(): void;
  onSubmit ?(): void;
}
interface State {
  type: ConfigType;
}
class GitAddConfig extends React.Component<Props, State> {
  static defaultProps = {
    mode: 'add'
  }
  constructor (props: Props) {
    super(props)
    this.state = {
      type: null
    }
    this.onSubmit = this.onSubmit.bind(this)
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
    console.log('>>>>>form data', {
      sourceId: this.props.gitId,
      versionId: this.props.version.id,
      typeId: this.state.type.id,
      param: formData
    })
  }
  onCancel () {
    if (this.props.onClose) this.props.onClose()
  }
  onBack () {
    this.setState({
      type: null
    })
  }
  onSubmit () {
    if (this.props.onSubmit) this.props.onSubmit()
  }
  render () {
    let title = this.props.mode === 'add' ? '添加配置' : '修改配置'
    if (this.state.type) {
      switch (this.state.type.key) {
        case 'text':
          return (
            <GitTextConfig 
              gitId={this.props.gitId}
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
          onOk={this.onSubmit}
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
}
const mapStateToProps = (state: RootState) => {
  return {
    configTypes: state.base.configTypes
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getConfigTypes: () => {
      ajax({
        url: api.base.queryConfigTypes,
        method: 'GET'
      })
      .then((res: ApiResult<ConfigType[]>) => {
        dispatch({
          type: baseActions.SET_CONFIG_LIST,
          value: res.data
        })
      })
      .catch(err => {
        message.error('获取配置类型数据失败')
        console.error('获取配置类型数据失败', err)
      })
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GitAddConfig)