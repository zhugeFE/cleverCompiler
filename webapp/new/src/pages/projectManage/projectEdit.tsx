/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:54:38
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-26 19:02:46
 */
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';
import { Form, Input, Progress } from 'antd';
import { Dispatch } from 'dva';
import React from 'react';
import { connect, IRouteComponentProps, withRouter } from 'umi';
import styles from './styles/projectEdit.less';

interface Props extends IRouteComponentProps<{
  id: string;
}>{
  dispatch: Dispatch;
}

interface States {
  savePercent: number;
}

class ProjectEdit extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      savePercent: 0
    }
  }

  render() {
    return (
      <div className={styles.projectEditPanel}>
         <div className={styles.customerPanelTop}>
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

        <div>
            <Form
              labelCol={{span:4}}
            >
              <Form.Item label="名称" name="name"> <Input/> </Form.Item>

              <Form.Item label="模板" name="template"> <Input></Input> </Form.Item>

              <Form.Item label="编译类型" name="name"> <Input/> </Form.Item>
            </Form>
        </div>
      </div>
    )
  }
}


export default connect()(withRouter(ProjectEdit))