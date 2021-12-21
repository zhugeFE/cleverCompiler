/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-23 17:31:08
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-21 15:09:58
 */

import { LeftOutlined } from '@ant-design/icons';
import { IRouteComponentProps } from '@umijs/renderer-react';
import { Dispatch } from 'dva';
import React from 'react';
import { BranchUpdateDocInfo, connect } from 'umi';
import style from "./styles/versionUpdate.less";
import * as ReactMarkdown from 'react-markdown'
import { Collapse, Skeleton } from 'antd';

interface Props extends IRouteComponentProps<{
  id: string;
}> {
  dispatch: Dispatch
}

interface State {
  data: BranchUpdateDocInfo[] | null;
}

class VersionUpdate extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      data: null
    }
  }

  componentDidMount () {
    this.getVersionDoc(this.props.match.params.id)
  }

  getVersionDoc (id: string) {
    this.props.dispatch({
      type: "git/getBranchUpdateInfo",
      payload: id,
      callback: (data: BranchUpdateDocInfo[]) => {
        this.setState({
          data
        })
      }
    })
  }
  render () {
    return (
      /**
       * 改为 左侧树图显示分支和小版本
       * 右侧改为 版本内容显示
       */
      <div className={style.versionUpdatePanel}>
        <div className={style.goback}>
          <a onClick={() => {this.props.history.goBack()}}><LeftOutlined/>返回</a>
        </div>
        <div className={style.content}>
          {
            this.state.data ? (
              <Collapse accordion>
                {
                  this.state.data.map( branch => {
                    return <Collapse.Panel header={branch.name} key={branch.id}>
                      <span>{branch.createTime} {branch.description}</span>
                      {
                        branch.children.map (info => {
                          return <div className={style.versionItem} key={info.id}>
                            <p className={style.title}>{this.props.location.query.title}-v{info.version}</p>
                            <p className={style.subTitle}>版本描述：{info.description}</p>
                            <ReactMarkdown children={info.updateDoc}></ReactMarkdown>
                          </div>
                        })
                      }
                    </Collapse.Panel>
                  })
                }
              </Collapse>
            ) : <Skeleton active></Skeleton>
          }
        </div>
      </div>
    )
  }
}

export default connect()(VersionUpdate)