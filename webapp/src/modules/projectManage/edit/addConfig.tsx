import * as React from 'react';
import { Modal, message, Card, Row, Col } from 'antd';
import { RootState } from '../../../store/state/index';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import ajax from '../../../utils/ajax';
import api from '../../../store/api';
import { ApiResult } from '../../../utils/ajax';
import { ConfigType } from '../../../store/state/common';
import { baseActions } from '../../../store/actionTypes';
import './styles/addConfig.less'
import GitTextConfig from './textConfig';
import GitFileConfig from './fileConfig';
import GitJsonConfig from './jsonConfig';

interface Props {
  gitId: string;
  mode: string;
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
  }
  componentDidMount () {
    this.props.getConfigTypes()
  }
  onClickType (configType: ConfigType) {
    this.setState({
      type: configType
    })
  }
  render () {
    let title = this.props.mode === 'add' ? '添加配置' : '修改配置'
    if (this.state.type) {
      switch (this.state.type.key) {
        case 'text':
          return (
            <GitTextConfig gitId={this.props.gitId}></GitTextConfig>
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
            <div>???</div>
          )
      }
    } else {
      return (
        <Modal title={title} visible={true} className="add-git-config-modal">
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