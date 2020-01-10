import * as React from 'react'
import './app.less'
import ajax from './utils/ajax'
class App extends React.Component{
  componentWillMount () {
    ajax({
      url: '/api/sys/test'
    })
  }
  render () {
    return (
      <div>hello react</div>
    )
  }
}
export default App