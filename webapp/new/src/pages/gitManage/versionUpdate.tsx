/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-23 17:31:08
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-24 14:20:44
 */

import { LeftOutlined } from '@ant-design/icons';
import { IRouteComponentProps } from '@umijs/renderer-react';
import { Dispatch } from 'dva';
import React from 'react';
import { connect, VersionUpdateDocInfo } from 'umi';
import style from "./styles/versionUpdate.less";
import * as ReactMarkdown from 'react-markdown'
import { Skeleton, Timeline } from 'antd';

interface Props extends IRouteComponentProps<{
  id: string;
}> {
  dispatch: Dispatch
}

interface State {
  versionInfo: VersionUpdateDocInfo[] | null;
}

class VersionUpdate extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      versionInfo: null
    }
  }

  componentDidMount () {
    this.getVersionDoc(this.props.match.params.id)
  }

  getVersionDoc (id: string) {
    this.props.dispatch({
      type: "git/getVersionUpdateInfo",
      payload: id,
      callback: (data: VersionUpdateDocInfo[]) => {
        this.setState({
          versionInfo: data
        })
      }
    })
  }
  render () {
    return (
      <div className={style.versionUpdatePanel}>
        <div className={style.goback}>
          <a onClick={() => {this.props.history.goBack()}}><LeftOutlined/>返回</a>
        </div>
        <div className={style.content}>
          {
            this.state.versionInfo  ? (
              this.state.versionInfo?.map( info => {
                return <div className={style.versionItem} key={info.id}>
                  <p className={style.title}>{this.props.location.query.title}-v{info.version}</p>
                  <p className={style.subTitle}>版本描述：{info.description}</p>
                  <ReactMarkdown children={info.updateDoc}></ReactMarkdown>
                </div>
              })
            ) : <Skeleton active></Skeleton>
          }
        </div>
      </div>
    )
  }
}

export default connect()(VersionUpdate)