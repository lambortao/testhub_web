import React , { Component } from 'react'
import { Icon } from 'antd'

class Practice extends Component {
  state = {

  }
  render() {
    return (
      <div className='practice-main'>
        <div className="question-box">
          <header>
            <h3>这是一个问题</h3>
            <small>这是一句注释这是一句注释这是一句注释这是一句注释这是一句注释这是一句注释这是一句注释这是一句注释这是一句注释这是一句注释</small>
          </header>
          <div className="options-list">
            <div><p>选项一</p></div>
            <div><p>选项一</p></div>
            <div><p>选项一</p></div>
            <div><p>选项一</p></div>
          </div>
        </div>
        <div className="tools-box">
          <Icon type="appstore" />
          <Icon type="eye-invisible" />
          <Icon type="logout" />
          <Icon type="swap-left" />
          <Icon type="swap-right" />
        </div>
      </div>
    )
  }
}

export default Practice