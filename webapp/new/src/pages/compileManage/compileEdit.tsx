/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-25 14:55:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-09-02 23:14:57
 */
import { ConnectState } from '@/models/connect'
import { LeftOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Radio, Select } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect, Dispatch, IRouteComponentProps, ProjectInfo, ProjectInstance } from 'umi'

interface Props extends IRouteComponentProps{
  projectInfo: ProjectInfo | null ;
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
    this.selectProject = this.selectProject.bind(this)
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this)
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

  selectProject (value: string) {
    console.log(value)
    this.props.dispatch({
      type: "project/getProjectInfo",
      payload: value
    })
  }

  onCheckBoxChange (checkedValues: CheckboxValueType[]) {
    console.log(checkedValues)
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
    const checkboxOptions: string[] = []
    if (this.props.projectInfo) {
      this.props.projectInfo.gitList.map( item => {
        checkboxOptions.push(item.name)
      })
    }
    
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
             <Select onChange={this.selectProject}>
                {
                  this.props.projectList?.map( item => {
                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  })
                }
              </Select>
          </Form.Item>

          {
            this.props.projectInfo && (
              <>
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
                  <Checkbox.Group options={checkboxOptions}  onChange={this.onCheckBoxChange} />
                </Form.Item>

                <Form.Item label="描述">
                  <TextArea rows={6}></TextArea>
                </Form.Item>
                <Button type="primary">编译</Button>
              </>
            )
          }
        </Form>
        
        
      </div>
    )
  }
}


export default connect( ( {project}: ConnectState) => {
  return {
    projectList: project.projectList,
    projectInfo: project.projectInfo,
  }
})(withRouter(CompileEdit))