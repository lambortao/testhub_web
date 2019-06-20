import React , { Component } from 'react'
import { Button, Icon, Collapse } from 'antd'
import '../scss/practice.scss'

const Panel = Collapse.Panel;
class Practice extends Component {
  state = {
    question: '1、这是标题这是标题这是标题这是标题这是标题这是标题这是标题这是标题这是标题这是标题',
    commit: '这是一段注释',
    option: [],
    bottom: 0
  }

  Commit = () => {
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    }
    return (
      <Collapse
      bordered={false}>
        <Panel 
        header="点击展开案例"
        style={customPanelStyle}>
          <p>{this.state.commit}</p>
        </Panel>
      </Collapse>
    )
  }

  render() {
    return (
      <div className='practice-main'>
        <div className="question-box">
          <header>
            <h3>{this.state.question}</h3>
            {/* {this.Commit()} */}
          </header>
          <div className="options-list">
            <div><p className='error'>A: 选项一</p></div>
            <div><p>B: 选项一</p></div>
            <div><p className='correct'>C: 选项一</p></div>
            <div><p>D: 选项一</p></div>
          </div>
        </div>
        <div className="tools-box">
          <Icon type="appstore" theme="twoTone" />
          <Icon type="eye-invisible" theme="twoTone" />
          <Icon className='logout' type="logout" />
        </div>
        <footer className="btn-box">
          <Button.Group size='large'>
            <Button type="primary">
              <Icon type="swap-left" />
              上一题
            </Button>
            <Button type="primary">
              下一题
              <Icon type="swap-right" />
            </Button>
          </Button.Group>
        </footer>
      </div>
    )
  }
}

export default Practice