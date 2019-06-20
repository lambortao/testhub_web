import React , { Component } from 'react'
import { Input, Button } from 'antd'
import '../scss/login.scss'

class Login extends Component {
  render() {
    return (
      <div className='login-main'>
        <div className="login-box">
          <h1>TEST HUB</h1>
          <Input placeholder='请输入姓名' />
          <Input placeholder='请输入手机号' />
          <Button type="primary">提交</Button>
        </div>
      </div>
    )
  }
}

export default Login