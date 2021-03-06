import React , { Component } from 'react'
import { Route } from 'react-router-dom'
import Nav from './nav'
import Subject from './subjects'
import Option from './option'
import Practice from './practice'
import Test from './test'

class Home extends Component {
  render() {
    return (
      <div className='main'>
        <Nav></Nav>
        <div className="main-box">
         <Route path='/home/subjects' component={Subject}></Route>
         <Route path='/home/option/:id' component={Option}></Route>
         <Route path='/home/practice/:subject/:model/:question' component={Practice}></Route>
         <Route path='/home/test/:subject/:question' component={Test}></Route>
        </div>
      </div>
    )
  }
}

export default Home