import React, { Component } from 'react';
import { 
  HashRouter as Router, 
  Route } from 'react-router-dom'
import './scss/index.scss'
import Home from './views/home'
import Login from './views/login'
import './scss/index.scss'

class App extends Component {
  render() {
    return (
      <Router>
        <Route path='/' exact component={Login}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/home" component={Home}></Route>
      </Router>
    )
  }
}

export default App;
