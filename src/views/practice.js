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
    questionId: 1, // 当前这道题的ID
    questionType: 0, // 当前这道题的类型
    questionAnswer: [], // 当前这道题的答案
    selectedAnswer: [], // 选中的答案
    selectedClassName: [], // 在答题模式会渲染该数组的类名到选项上
    subjectId: '', // 科目ID
    model: 1, // 答题模式，默认是顺序刷题
    questionList: [], // 当前科目所有的题目
    read: false,  // 是否开启阅读模式
    questionLockerShow: false, // 打开题目列表抽屉 
    questionLockerPos: [],
    multipleChoiceDisabled: true, // 是否禁用多选的提交按钮
    clickSelect: true, // 是否允许进行选择
    switchBtn: { // 上一页和下一页的按钮
      prev: false,
      next: false
    }
  }
  componentWillMount() {
    // 查找试题
    const subjectId = parseInt(this.props.match.params.subject);
    const model = parseInt(this.props.match.params.model);
    const questionId = parseInt(this.props.match.params.question);
    // 默认的模式为顺序刷题
    let questionLocalData = JSON.parse(localStorage.getItem(`questioninfo_${subjectId}`)).question;
    if (model === 2) {
      // 乱序刷题
      questionLocalData = this.shuffle(questionLocalData);
    } else if (model === 3) {
      // 错题模式
      const errorQuestion = JSON.parse(localStorage.getItem(`questionerror_${subjectId}`));
      questionLocalData = errorQuestion;
    }
    
    if (questionLocalData) {
      this.setState({
        questionList: questionLocalData,
        subjectId,
        model
      }, () => {
        this.init(questionId);
        // 只有在顺序刷题的时候才会出现题目分类
        if (model === 1) {
          let singleArr = [],
              multipleArr = [],
              judgeArr = [];
          questionLocalData.forEach(element => {
            switch (parseInt(element.type)) {
              case 0:
                singleArr.push(element.id);
                break;
              case 1:
                multipleArr.push(element.id);
                break;
              case 2:
                judgeArr.push(element.id);
                break;
              default: 
                singleArr.push(element.id);
                break;
            }
          });
          let questionLockerPos = [];
          questionLockerPos.push(judgeArr)
          questionLockerPos.push(singleArr)
          questionLockerPos.push(multipleArr);
          this.setState({ questionLockerPos });
        }
      })
    } else {
      message.error('没有找到试题', 2)
        .then(() => window.location.href = '#/home/subjects');
    }
  }
  // 打乱数组
  shuffle = (array) => {
    var arr = array;
    var m = arr.length,
        t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = arr[m];
      arr[m] = arr[i];
      arr[i] = t;
    }
    return arr;
  }
  // 根据问题ID来切换问题
  init = (questionId) => {
    this.setState({
      questionId
    }, () => {
      // 筛选当前答案列表
      const nowAnswer = [];
      JSON.parse(this.state.questionList[questionId - 1].answer).map(element =>            nowAnswer.push(element.selected)
      )
      this.setState({
        questionType: this.state.questionList[questionId - 1].type,
        questionAnswer: nowAnswer,
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
  // 点击抽屉的问题列表进行跳转
  jumpQuestionList = (id) => {
    window.location.href = `#/home/practice/${this.state.subjectId}/${this.state.model}/${id}`;
    this.setState({
      questionLockerShow: false
    })
  }
  // 题目抽屉中单个元素的dom
  questionListSingle = (element, index) => {
    let questionClassName = '';
    if (element.state !== null) {
      questionClassName = parseInt(element.state) ? 'correct' : 'error'
    }
    return (
      <p 
      className={questionClassName}
      key={index}
      onClick={() => this.jumpQuestionList(index + 1)}>{index + 1}</p>
    )
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
        <div className='question-list-drawer'>
          {
            this.state.questionList.map((element, index) => 
              this.questionListSingle(element, index)
            )
          }
        </div>
      </Drawer>
    )
  }
  // 生成选中的类名
  createSelectClass = () => {
    // 提交后首先禁用提交按钮和禁止再次提交
    this.setState({
      multipleChoiceDisabled: true,
      clickSelect: false
    });
    const lsArr = [];
    const lsSelectedAnswer = this.state.selectedAnswer;
    let selectedWrong = false;
    if (lsSelectedAnswer.length === 0) {
      message.error('至少选一个吧～', 2);
      return;
    }
    for (let index = 0; index < this.state.questionAnswer.length; index++) {
      if (this.state.questionAnswer[index]) {
        // 如果循环到的正确答案是对的，但是已经没有已选答案的话，那么肯定是遗漏的
        if (lsSelectedAnswer.length === 0) {
          selectedWrong = true;
          lsArr.push('missing')
        } else {
          let answerPos = lsSelectedAnswer.indexOf(index);
          if (answerPos > -1) {
            // 当前的正确答案如果能匹配到已选答案，那就是选择正确
            lsSelectedAnswer.splice(answerPos, 1);
            lsArr.push('correct');
          } else {
            selectedWrong = true;
            // 当前的正确答案如果不能匹配到已选答案，且已选答案还有的话，那就是遗漏的
            lsArr.push('missing')
          }
        }
      } else {
        lsArr.push('');
      }
    }
    // 正确答案已经循环完毕，但是已选答案并未完全扣除，那么剩下的就都是错误的
    if (lsSelectedAnswer.length > 0) {
      selectedWrong = true;
      for (let index = 0; index < lsSelectedAnswer.length; index++) {
        lsArr[lsSelectedAnswer[index]] = 'error';
      }
    }
    if (selectedWrong) {
      message.error('错啦', 2);
      // 记录错题到本地
      let errorQuestion = this.state.questionList[this.state.questionId - 1];
      let errorQuestionArr = JSON.parse(localStorage.getItem(`questionerror_${this.state.subjectId}`));
      if (errorQuestionArr) {
        if (!this.validationQuestion(errorQuestion.id, errorQuestionArr)) {
          errorQuestionArr.push(errorQuestion);
          localStorage.setItem(`questionerror_${this.state.subjectId}`, JSON.stringify(errorQuestionArr));
        }
      } else {
        errorQuestionArr = [];
        errorQuestionArr.push(errorQuestion);
        localStorage.setItem(`questionerror_${this.state.subjectId}`, JSON.stringify(errorQuestionArr));
      }
      
    } else {
      // 错题和普通答题的反馈是不一样的
      const feedbackText = this.state.model === 3 ? '回答正确，再仔细看看哈 😄' : '回答正确，下一题';
      message.success(feedbackText, 1, () => {
        if (this.state.model === 3) {
          // 如果错题回答正确则将这道题目从错题表里面删除
          let oldErrorQuestion = JSON.parse(localStorage.getItem(`questionerror_${this.state.subjectId}`));
          oldErrorQuestion[this.state.questionId - 1].state = true;
          localStorage.setItem(`questionerror_${this.state.subjectId}`, JSON.stringify(oldErrorQuestion));
        } else {
          this.switchQuestion(this.state.switchBtn.next);
        }
      });
    }
    this.setState({
      selectedClassName: lsArr
    })
  }
  // 验证该题是否在指定题库内
  validationQuestion = (id, array) => {
    let exist = false;
    array.forEach(element => {
      if (element.id === id) {
        exist = true;
        return;
      }
    });
    return exist;
  }
  // 点击选择项
  clickQuestion = (selectedIndex) => {
    // 获取用户选择的答案
    if (this.state.clickSelect) {
      // 首先判断当前选项是否是已经选择过的
      const selectedAnswer = this.state.selectedAnswer;
      const lsArr = this.state.selectedClassName;
      const selectedPos = selectedAnswer.indexOf(selectedIndex);
      let multipleChoiceBtnState = true;
      if (selectedPos >= 0) {
        selectedAnswer.splice(selectedPos, 1);
        lsArr[selectedIndex] = '';
        if (selectedAnswer.length > 0) {
          multipleChoiceBtnState = false;
        }
      } else {
        selectedAnswer.push(selectedIndex);
        lsArr[selectedIndex] = 'correct';
        multipleChoiceBtnState = false;
      }
      
      this.setState({
        selectedAnswer,
        selectedClassName: lsArr,
        multipleChoiceDisabled: multipleChoiceBtnState
      }, () => {
        if (this.state.selectedAnswer.length === 1) {
          if (parseInt(this.state.questionType) === 0 
           || parseInt(this.state.questionType) === 2
           || parseInt(this.state.questionType) === 3) {
            this.createSelectClass();
          }
        }
      })
    }
  }
  // 选择项的dom渲染
  optionDom = (data) => {
    const answerArr = ['A', 'B', 'C', 'D', 'E', 'F'];
    if (this.state.read) {
      // 阅读模式
      return (
        <p 
          className={data[0].selected ? 'correct' : ''}
          >{answerArr[data[1]]}: {data[0].content}
        </p>
      )
    } else {
      // 答题模式
      return (
        <p
          className={this.state.selectedClassName[data[1]]}
          onClick={() => this.clickQuestion(data[1])}
        >{answerArr[data[1]]}: {data[0].content}</p>
      )
    }
  }
  // 选项的DOM
  optionListDom = (data) => {
    data = JSON.parse(data);
    return (
      <div className="options-list">
        {
          data.map((element, index) => 
            <div key={index}>
              {this.optionDom([element, index])}
            </div>
          )
        }
      </div>
    )
  }
  // 控制多选题时提交按钮的显示
  multipleChoiceBtn = (type) => {
    if (parseInt(type) === 1 && !this.state.read) {
      return (
        <Button 
        onClick={() => this.createSelectClass()} 
        type='primary'
        disabled={this.state.multipleChoiceDisabled}>提交</Button>
      );
    }
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
    if (id) {
      this.setState({
        questionAnswer: [],
        selectedAnswer: [],
        selectedClassName: [],
        multipleChoiceDisabled: true,
        clickSelect: true
      })
      window.location.href = `#/home/practice/${this.state.subjectId}/${this.state.model}/${id}`
    } else {
      message.destroy();
      message.success('做完啦 🎉🎉🎉');
    }
  }
  // 获取题目类型
  getQuestionType = (type) => {
    switch (type) {
      case 0:
        return '单选';
      case 1:
        return '多选';
      case 2: 
        return '判断'
      default:
        return '单选'
    }
  }
  render() {
    const nowQuestion = this.state.questionList[this.state.questionId - 1];
    return (
      <div className='practice-main'>
        <div className="question-box">
          <header>
            <h3>
              <small>{this.getQuestionType(parseInt(nowQuestion.type))}</small>
              {nowQuestion.question_text}
            </h3>
            {this.Commit(nowQuestion.commit)}
          </header>
          {this.optionListDom(nowQuestion.answer)}
          {this.multipleChoiceBtn(nowQuestion.type)}
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
            <i className='pos'>{`${this.state.questionId}/${this.state.questionList.length}`}</i>
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