/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:55:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-08-30 22:35:26
 */
import { ConnectState } from '@/models/connect'
import { LeftOutlined } from '@ant-design/icons'
import { Button, Form, Input, Radio, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect, Dispatch, IRouteComponentProps, ProjectInstance } from 'umi'

interface Props extends IRouteComponentProps{
  projectList: ProjectInstance[] | null;
  dispatch: Dispatch;
}
interface States {
  publicType: number;
}

class CompileEdit extends React.Component<Props, States> {
  constructor(prop: Props){
    super(prop)
    this.state = {
      publicType: 0,
    }
    this.onRadioChange = this.onRadioChange.bind(this)
  }

  componentDidMount () {
    this.props.dispatch({
      type: "project/getProjectList"
    })
  }

  onRadioChange (e: any) {
    this.setState({
      publicType: e.target.value
    })
  }
  render() {
    const publicType = [
      {
        id: 0,
        text: "发布到云端"
      },
      {
        id: 1,
        text: "打包下载"
      },
      {
        id: 2,
        text: "分别下载"
      },
      {
        id: 3,
        text: "自动"
      }
    ]
    return (
      <div>
        <div >
          <a
            onClick={() => {
              this.props.history.goBack();
            }}>
            <LeftOutlined />
            返回
          </a>
        </div> 
        <Form
          labelCol={{span:4}}
          wrapperCol={{span:16}}
        >
          <Form.Item 
            label="配置名称"
          >
            <Input></Input>
          </Form.Item>

          <Form.Item 
            label="发布方式"
          >
            <Radio.Group onChange={this.onRadioChange} defaultValue={this.state.publicType}>
              {
                publicType.map( item => {
                  return <Radio key={item.id} value={item.id}>{item.text}</Radio>
                })
              }
            </Radio.Group>

          </Form.Item>

          <Form.Item label="要编译的项目">
              <Select>
                {
                  this.props.projectList?.map( item => {
                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  })
                }
              </Select>
          </Form.Item>

          <Form.Item label="描述">
            <TextArea rows={6}></TextArea>
          </Form.Item>
        </Form>
        <Button type="primary">编译</Button>
        
      </div>
    )
  }
}


export default connect( ( {project}: ConnectState) => {
  return {
    projectList: project.projectList
  }
})(withRouter(CompileEdit))