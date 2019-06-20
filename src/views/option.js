import React , { Component } from 'react'
import '../scss/option.scss'

class Option extends Component {
  render() {
    return (
      <div className='option-main'>
        <header>
          <h3>测试标题</h3>
        </header>
        <section>
          <div>
            <i></i>
            <p>顺序练习</p>
          </div>
          <div>
            <i></i>
            <p>随机练习</p>
          </div>
          <div>
            <i></i>
            <p>查看错题</p>
          </div>
          <div>
            <i></i>
            <p>模拟考试</p>
          </div>
        </section>
      </div>
    )
  }
}

export default Option