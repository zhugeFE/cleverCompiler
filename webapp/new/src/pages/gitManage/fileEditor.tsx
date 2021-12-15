/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-05 20:08:04
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-12-15 19:22:09
 */
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
    if (!this.props.content || !this.props.reg) {
      return <div className="git-file-editor">{this.props.content}</div>
    }
    const content = this.props.content
    const reg = this.props.reg
    const matchs = content.match(reg) 
    
    const splitStr = `<<<<You must not guess it's me>>>>`
    const chunks = content.replace(reg, splitStr).split(splitStr)

    return (
      parseInt(String(this.props.matchIndex)).toString() != "NaN" ?
      <div className="git-file-editor">
        
        {chunks.map((item, i) => {  
                          
          return (
              <span key={item + i}>{item}{
                matchs && matchs[i] && matchs[this.props.matchIndex!] && item =="" ? 
                <span className="editor-match">{matchs[i].substring(0, matchs[i].indexOf(matchs[this.props.matchIndex!]))}
                  <span className="editor-match-group">
                   {matchs[this.props.matchIndex!]}
                  </span>
                  <span>
                    {
                      matchs[i].substring(matchs[i].indexOf(matchs[this.props.matchIndex!])+matchs[this.props.matchIndex!].length)
                    }
                  </span>
                </span>
               : null
              }</span>
          )   
        })}
        {reg.source !== '(?:)' ? <div className="editor-find-bar">match( {matchs ? matchs.length : 0} )</div> : null}
      </div>
      :
      <div className="git-file-editor">
        {content}
      </div>
    )
  }
}

export default GitFileEditor