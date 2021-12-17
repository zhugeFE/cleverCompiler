/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-05 20:08:04
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-17 17:04:39
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
  renderContent () {
    if (!this.props.content || !this.props.reg || parseInt(String(this.props.matchIndex)).toString() == "NaN") {
      return <div className="git-file-editor">{this.props.content}</div>
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
    const oldVal = matchs![0] //第一个匹配的完整内容
    const beginIndex = content.indexOf(oldVal) //匹配内容在文本内容中第一个匹配项的开始索引
    const endIndex = beginIndex + oldVal.length //匹配内容在文本内容中第一个匹配项的结束索引
    const chunkA = content.substring(0, beginIndex)
    const res = this.createHightLightElement(oldVal, matchs![matchIndex])

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


  render1 () {
    if (!this.props.content || !this.props.reg) {
      return <div className="git-file-editor">{this.props.content}</div>
    }
    const content = this.props.content
    const reg = this.props.reg
    const matchs = content.match(reg)
    
    console.log(matchs);
    
    const splitStr = `<<<<You must not guess it's me>>>>`
    
    const chunks = content.replace(reg, splitStr).split(splitStr)
    


    

    return (
      parseInt(String(this.props.matchIndex)).toString() != "NaN" ?
      <div className="git-file-editor">

        {chunks.map((item, i) => {  
          // console.log(item,i);
          
          return (

              <span key={item + i}>{item}{
                matchs && matchs[i] && matchs[this.props.matchIndex!] ? 
                <span className="editor-match">
                  {i!= matchs.length-1 && matchs[i]}
                  {/* {matchs[i].substring(0, matchs[i].indexOf(matchs[this.props.matchIndex!]))}
                  <span className="editor-match-group">
                    {i!= chunks.length -1 && matchs[this.props.matchIndex!]}
                  </span>
                  <span>
                    {
                       matchs[i].substring(matchs[i].indexOf(matchs[this.props.matchIndex!])+matchs[this.props.matchIndex!].length)
                    }
                  </span> */}
                </span>
               : null
              }</span>
          )   
        })}
        {reg.source !== '(?:)' ? <div className="editor-find-bar">match( {matchs ? [...new Set(matchs)].length > 1 ? matchs.length -1 : matchs.length : 0} )</div> : null}
      </div>
      :
      <div className="git-file-editor">
        {content}
      </div>
    )
  }
}

export default GitFileEditor