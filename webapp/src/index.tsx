import * as React from 'react'
import * as ReactDom from 'react-dom'
import App from './App'
import { Route, Switch} from 'react-router-dom'
import InitGuide from './modules/initGuide/guide';
import './index.less'
import { Router } from 'react-router';
import history from './utils/history';
import Login from './modules/login/login';
import { Provider } from 'react-redux';
import store from './store/store';

ReactDom.render((
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/init">
          <InitGuide></InitGuide>
        </Route>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/">
          <App></App>
        </Route>
      </Switch>
    </Router>
  </Provider>
), document.getElementById('root'))