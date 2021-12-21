/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-05 20:08:04
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-17 18:39:00
 */
import util from '@/utils/utils';
import * as React from 'react';
import './styles/fileEditor.less'

interface Props {
  content: string;
  reg: RegExp;
  matchIndex: number | null;
}
interface State {}

class GitFileEditor extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {}
  }

  renderContent () {
    if (!this.props.content || !this.props.reg || parseInt(String(this.props.matchIndex)).toString() == "NaN") {
      return this.props.content
    }
    
    if (parseInt(String(this.props.matchIndex)).toString() != "NaN" && this.props.reg) {
      const content = this.props.content
      const ignoreCase = this.props.reg.ignoreCase
      const reg = new RegExp(this.props.reg.source, ignoreCase ? "i" : "")
      const isGlobal = this.props.reg.global
      const res = this.matchContent(content, reg, this.props.matchIndex!, isGlobal)

      return util.isArray(res) ? (
        res.map( (item: any,i:number) => {
          return <span key={i}>{item}</span>
        }) 
      ): res
    }
  }
  matchCount () {
    if (!this.props.content || !this.props.reg || parseInt(String(this.props.matchIndex)).toString() == "NaN") return
    const content = this.props.content
    const isGlobal = this.props.reg.global
    const ignoreCase = this.props.reg.ignoreCase
    const reg = new RegExp(this.props.reg.source, `${ignoreCase ? 'i' : ''}${isGlobal ? 'g' : ""}`)

    const match = content.match(reg)
    if (isGlobal) {
      return match ? match.length : 0
    } else {
      return  match ? match.length > 1 ? match.length -1 : match.length : 0
    }
  }
  matchContent (content: string, reg: RegExp, matchIndex: number, isGlobal: boolean): any {
    if (!reg.test(content)) {return content }
    const matchs = content.match(reg)
    if (!matchs) return content
    const oldVal = matchs![0] //第一个匹配的完整内容
    const beginIndex = content.indexOf(oldVal) //匹配内容在文本内容中第一个匹配项的开始索引
    const endIndex = beginIndex + oldVal.length //匹配内容在文本内容中第一个匹配项的结束索引
    const chunkA = content.substring(0, beginIndex)
    const res = this.createHightLightElement(oldVal, matchs[matchIndex])

    if (isGlobal){
      return [chunkA , res , ...this.matchContent(content.substring(endIndex), reg, matchIndex, isGlobal)]
    } else {
      return [ chunkA , res , content.substring(endIndex)]
    }
    
  }

  createHightLightElement (content: string, targetValue: string) {    
    const beginIndex = content.indexOf(targetValue)
    const endIndex = beginIndex + targetValue.length
    return (
      <span className="editor-match">
        {content.substring(0,beginIndex)}
        <span className="editor-match-group">
          {content.substring(beginIndex, endIndex)}
        </span>
        {content.substring(endIndex, content.length)}
      </span>
    )
  }

    
  render () {
    return (
      <div className="git-file-editor">
        {
          this.renderContent()
        }
      <div className="editor-find-bar">match( {this.matchCount() })</div>

      </div>
    )
  }
}

export default GitFileEditor