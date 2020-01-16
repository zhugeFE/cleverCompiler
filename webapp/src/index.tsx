import * as React from 'react'
import * as ReactDom from 'react-dom'
import App from './App'
import { BrowserRouter, Route, Switch} from 'react-router-dom'
import InitGuide from './modules/initGuide/guide';
import './index.less'
ReactDom.render((
  <BrowserRouter>
    <Switch>
      <Route path="/init">
        <InitGuide></InitGuide>
      </Route>
      <Route path="/">
        <App></App>
      </Route>
    </Switch>
  </BrowserRouter>
), document.getElementById('root'))