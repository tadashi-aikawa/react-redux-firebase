import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, Link, browserHistory } from 'react-router'
import Home from './Page'
import Layout from './Layout'
import configureStore from './store'

const initialState = window.__INITIAL_STATE__ || { firebase: { authError: null } }
const store = configureStore(initialState)

export default () => (
  <Provider store={store}>
    <Router history={browserHistory}>
     <Route path="/">
       <Route path="projects" component={Layout}>
         <Route path=":id" component={Home} />
       </Route>
     </Route>
   </Router>
  </Provider>
)
