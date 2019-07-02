import React , { Component } from 'react'
import __post from '../api'
import '../scss/option.scss'
import { message } from 'antd'

class Option extends Component {
  state = {
    name: '加载中...',
    question: []
  }
  componentWillMount() {
    this.getQuestionList();
    // 刚进来的时候或者是从错题退出出来的时候就去检查刚才做对的错题，将其从错题库中删除
    let errorQuestion = localStorage.getItem(`questionerror_${this.props.match.params.id}`);
    if (errorQuestion && JSON.parse(errorQuestion).length > 0) {
      errorQuestion = JSON.parse(errorQuestion);
      let lsErrorQuestion = [];
      errorQuestion.forEach(element => {
        if (!element.state) {
          lsErrorQuestion.push(element);
        }
      });
      localStorage.setItem(`questionerror_${this.props.match.params.id}`, JSON.stringify(lsErrorQuestion));
    }
  }
  // 拉取题目
  getQuestionList = () => {
    __post('question/getQuestionList', {
      id: parseInt(this.props.match.params.id)
    }).then(res => {
      const allData = res.data.judge.concat(res.data.single, res.data.multiple);
      this.setState({
        question: allData,
        name: res.name
      }, () => {
        // 这里拉下拉的题目是按照ID升序排列的
        const questionInfo = {
          sort: res.data,
          name: this.state.name,
          question: this.state.question
        }
        localStorage.setItem(`questioninfo_${this.props.match.params.id}`, JSON.stringify(questionInfo));
      });
    })
  }
  readError = () => {
    // 查看错题
    const errorQuestion = localStorage.getItem(`questionerror_${this.props.match.params.id}`);
    if (errorQuestion && JSON.parse(errorQuestion).length > 0) {
      window.location.href = `#/home/practice/${this.props.match.params.id}/3/1`
    } else {
      message.success('没有发现做错的题目 🎉🎉🎉');
    }
  }
  testModel = () => {
    // 开始模拟考试
    window.location.href = `#/home/test/${this.props.match.params.id}/1`
  }
  render() {
    return (
      <div className='option-main'>
        <header>
          <h3>{this.state.name}</h3>
        </header>
        <section>
          <div
          onClick={() => window.location.href = `#/home/practice/${this.props.match.params.id}/1/1`}>
            <i></i>
            <p>顺序练习</p>
          </div>
          <div
          onClick={() => window.location.href = `#/home/practice/${this.props.match.params.id}/2/1`}>
            <i></i>
            <p>随机练习</p>
          </div>
          <div
          onClick={() => this.readError()}>
            <i></i>
            <p>查看错题</p>
          </div>
          <div
          onClick={() => this.testModel()}>
            <i></i>
            <p>模拟考试</p>
          </div>
        </section>
      </div>
    )
  }
}

export default Option