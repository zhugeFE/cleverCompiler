/*
 * @Descripttion:
 * @version:
 * @Author: Adxiong
 * @Date: 2021-08-12 08:30:26
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-25 18:06:41
 */
import * as React from 'react';
import { Modal, Card, Row, Col, message } from 'antd';
import AddTextConfig from './addTemplateGlobalTextConfig';
import AddFileConfig from './addTemplateGlobalFileConfig';
import styles from './styles/templateAddConfig.less';
import type { ConfigType} from '@/models/common';
import { EditMode } from '@/models/common';
import { connect } from 'dva';
import type { Dispatch } from '@/.umi/plugin-dva/connect';
import type { ConnectState } from '@/models/connect';

interface Props {
  templateId: string;
  versionId: string;
  configTypes: ConfigType[];
  dispatch: Dispatch;
  onClose?: () => void;
}
interface State {
  type?: ConfigType;
}
class AddTemplateGlobalConfig extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
    this.onBack = this.onBack.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    this.queryConfigTypes();
  }

  queryConfigTypes() {
    this.props.dispatch({
      type: 'sys/queryConfigTypes',
    });
  }

  onClickType(configType: ConfigType) {
    this.setState({
      type: configType,
    });
  }

  onSubmitForm (formData: any) {
    const form = new FormData()
    for (const key of Object.keys(formData)) {
      if (key == 'file') {
        form.append("files", formData[key].file)
      } else {
        form.append(key, formData[key])
      }
    }
    form.append("templateId", this.props.templateId)
    form.append("templateVersionId", this.props.versionId)
    form.append("type", String(this.state.type!.id))
    this.props.dispatch({
      type: 'template/addGlobalConfig',
      payload: form,
      callback: (res: boolean)=>{
        if (!res){
          message.error("添加失败")
        } else {
          message.success("添加成功")
        }
        if (this.props.onClose) this.props.onClose()
      }
    })
  }

  onCancel() {
    if (this.props.onClose) this.props.onClose();
  }

  onBack() {
    this.setState({
      type: undefined,
    });
  }

  render() {
    if (this.state.type) {
      switch (this.state.type.key) {
        case 'text':
          return (
            <AddTextConfig
              mode={EditMode.create}
              templateId={this.props.templateId}
              templateVersionId={this.props.versionId}
              onSubmit={this.onSubmitForm}
              onCancel={this.onCancel}
              onBack={this.onBack}/>
          );
        case 'file':
          return (
            <AddFileConfig
              mode={EditMode.create}
              templateId={this.props.templateId}
              templateVersionId={this.props.versionId}
              onSubmit={this.onSubmitForm}
              onCancel={this.onCancel}
              onBack={this.onBack}/>
          );
        case 'json':
          return (
            // <GitJsonConfig></GitJsonConfig>
            'git json config'
          );
        default:
          return <div>未知配置类型</div>;
      }
    } else {
      return (
        <Modal
          title="添加配置"
          visible={true}
          centered
          className={styles.addTemplateConfigModal}
          footer={null}
          onCancel={this.onCancel}>
          <Row gutter={16}>
            {this.props.configTypes.map((config) => {
              return (
                <Col span={12} key={config.id}>
                  <Card className={styles.configItem} onClick={this.onClickType.bind(this, config)}>
                    {config.label}
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Modal>
      );
    }
  }
}

export default connect(({ sys, template }: ConnectState) => {
  return {
    configTypes: sys.configTypes,
    templateId: template.templateInfo!.id!,
    versionId: template.currentVersion!.id!
  };
})(AddTemplateGlobalConfig);
