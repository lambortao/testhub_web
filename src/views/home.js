import React , { Component } from 'react'
import { Route } from 'react-router-dom'
import Nav from './nav'
import Subject from './subjects'
import Option from './option'
import Practice from './practice'
class Home extends Component {
  render() {
    return (
      <div className='main'>
        <Nav></Nav>
        <div className="main-box">
         <Route path='/home/subjects' component={Subject}></Route>
         <Route path='/home/option' component={Option}></Route>
         <Route path='/home/practice' component={Practice}></Route>
        </div>
      </div>
    )
  }
}

export default Home