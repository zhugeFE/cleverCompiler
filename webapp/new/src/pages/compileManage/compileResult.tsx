/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-10-15 14:31:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-10-15 15:22:47
 */

import React from 'react'
interface States {

}

interface Props{
  resultData: {
    title: string;
    subTitle: string;
    fileaddr: string;
    successGitNames: string[];
  }
}

class CompileResult extends React.Component<Props,States> {
  constructor (props: Props) {
    super(props)
    
  }
  render() {
    return (
      <div>
        <img src="https://img1.baidu.com/it/u=1805842775,546188332&fm=26&fmt=auto" alt="" height="100"/>
        <p>{this.props.resultData.title}</p>
        <p>{this.props.resultData.subTitle}</p>
      </div>
    );
  }
}

export default CompileResult