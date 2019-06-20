import React , { Component } from 'react'
import { 
  Button, 
  Icon, 
  Collapse, 
  message, 
  Modal,
  Drawer } from 'antd'
import '../scss/practice.scss'

const Panel = Collapse.Panel;
class Practice extends Component {
  state = {
    questionId: 1,
    subjectId: '',
    model: 1,
    questionList: [],
    read: true,
    questionLockerShow: false,
    switchBtn: {
      prev: false,
      next: false
    }
  }
  componentWillMount() {
    // 查找试题
    const subjectId = parseInt(this.props.match.params.subject);
    const model = parseInt(this.props.match.params.model);
    const questionId = parseInt(this.props.match.params.question);
    const localData = localStorage.getItem(`questioninfo_${subjectId}`);
    if (localData) {
      this.setState({
        questionList: JSON.parse(localData).question,
        subjectId,
        model
      }, () => {
        this.init(questionId);
      })
    } else {
      message.error('没有找到试题', 2)
        .then(() => window.location.href = '#/home/subjects');
    }
  }
  // 根据问题ID来切换问题
  init = (questionId) => {
    this.setState({
      questionId
    }, () => {
      this.setState({
        switchBtn: {
          prev: questionId === 1 ? false : (questionId - 1),
          next: questionId === (this.state.questionList.length) ? false : (questionId + 1)
        }
      })
    })
  }
  // 监听URL参数的变化
  componentWillReceiveProps(nextProps) {
    const questionId = parseInt(nextProps.match.params.question);
    this.init(questionId);
  }
  // 判断是否显示注释内容
  Commit = (commit) => {
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    }
    if (commit) {
      return (
        <Collapse
        bordered={false}>
          <Panel 
          header="点击展开案例"
          style={customPanelStyle}>
            <p>{commit}</p>
          </Panel>
        </Collapse>
      )
    } else {
      return false
    }
  }
  // 全部题目的抽屉
  questionListDom = () => {
    return (
      <Drawer
        title="全部题目"
        placement='bottom'
        maskClosable={true}
        closable={true}
        onClose={() => this.setState({questionLockerShow: false})}
        height='80vh'
        visible={this.state.questionLockerShow}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    )
  }
  // 选项的DOM
  optionDom = () => {
    
  }
  // 是否退出
  showConfirm = () => {
    const _this = this;
    Modal.confirm({
      title: '确定要退出吗？',
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() { 
        window.location.href = `#/home/option/${_this.state.subjectId}` 
      },
      onCancel() {},
    });
  }
  // 切换阅读和答题模式
  switchRead = () => {
    this.setState({
      read: !this.state.read
    }, () => {
      const modelText = this.state.read ? '阅读模式已启动' : '答题模式已启动'
      message.success(modelText, 1);
    })
  }
  // 切换上一题和下一题
  switchQuestion = (id) => {
    window.location.href = `#/home/practice/${this.state.subjectId}/${this.state.model}/${id}`
  }
  render() {
    return (
      <div className='practice-main'>
        <div className="question-box">
          <header>
            <h3>{`${this.state.questionId}、${this.state.questionList[this.state.questionId - 1].question_text}`}</h3>
            {this.Commit(this.state.questionList[this.state.questionId - 1].commit)}
          </header>
          <div className="options-list">
            <div><p className='error'>A: 选项一</p></div>
            <div><p>B: 选项一</p></div>
            <div><p className='correct'>C: 选项一</p></div>
            <div><p>D: 选项一</p></div>
          </div>
        </div>
        <div className="tools-box">
          <Icon 
          type="appstore" 
          theme="twoTone"
          onClick={() => this.setState({questionLockerShow: true})} />
          <Icon 
          type={this.state.read ? 'eye' : 'eye-invisible'} 
          theme={this.state.read ? 'twoTone' : ''}
          onClick={() => this.switchRead()} />
          <Icon 
          className='logout'
          type="logout"
          onClick={() => this.showConfirm()} />
        </div>
        <footer className="btn-box">
          <Button.Group size='large'>
            <Button 
            type="primary"
            disabled={!this.state.switchBtn.prev}
            onClick={() => this.switchQuestion(this.state.switchBtn.prev)}>
              <Icon type="swap-left" />
              上一题
            </Button>
            <Button 
            type="primary"
            disabled={!this.state.switchBtn.next}
            onClick={() => this.switchQuestion(this.state.switchBtn.next)}>
              下一题
              <Icon type="swap-right" />
            </Button>
          </Button.Group>
        </footer>
        {this.questionListDom()}
      </div>
    )
  }
}

export default Practice