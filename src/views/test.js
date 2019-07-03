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

class TestComponent extends Component {
  state = {
    questionId: 1, // 当前这道题的ID
    questionType: 0, // 当前这道题的类型
    questionAnswer: [], // 当前这道题的答案
    selectedAnswer: [], // 选中的答案
    selectedClassName: [], // 在答题模式会渲染该数组的类名到选项上
    subjectId: '', // 科目ID
    questionList: [], // 当前科目所有的题目
    questionLockerShow: false, // 打开题目列表抽屉 
    questionLockerPos: [],
    multipleChoiceDisabled: true, // 是否禁用多选的提交按钮
    clickSelect: true, // 是否允许进行选择
    switchBtn: { // 上一页和下一页的按钮
      prev: false,
      next: false
    },
    answerList: [],
    countTime: '',
    countString: ''
  }
  
  componentWillMount() {
    // 查找试题
    const subjectId = parseInt(this.props.match.params.subject);
    const questionId = parseInt(this.props.match.params.question);
    // 查找本地的题目，整理试卷
    let questionLocalData = JSON.parse(localStorage.getItem(`questioninfo_${subjectId}`));
    
    if (questionLocalData) {
      let judgeArr = this.shuffle(questionLocalData.sort.judge, 10);
      let singleArr = this.shuffle(questionLocalData.sort.single, 25);
      let multipleArr = this.shuffle(questionLocalData.sort.multiple, 15);
      const testQuestion = judgeArr.concat(singleArr, multipleArr);
      this.setState({
        questionList: testQuestion,
        subjectId
      }, () => {
        this.init(questionId);
        this.count();
      })
    } else {
      message.error('没有找到试题', 2)
        .then(() => window.location.href = '#/home/subjects');
    }
  }
  // 从指定数组中随机取出指定数量的对象
  shuffle = (arr, num) => {
    //新建一个数组,将传入的数组复制过来,用于运算,而不直接操作传入的数组;
    var copyArr = [];
    for (var index in arr) {
        copyArr.push(arr[index]);
    }
    //取出的数值项,保存在此数组返回
    var resultArr = [];
    for (var i = 0; i<num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (copyArr.length>0) {
            //在数组中产生一个随机索引
            var arrIndex = Math.floor(Math.random()*copyArr.length);
            //将此随机索引的对应的数组元素值复制出来
            resultArr[i] = copyArr[arrIndex];
            //然后删掉此索引的数组元素,这时候 copyArr 变为新的数组
            copyArr.splice(arrIndex, 1);
        } else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return resultArr;
  }

  // 根据问题ID来切换问题
  init = (questionId) => {
    this.setState({
      questionId
    }, () => {
      // 筛选当前答案列表
      const nowAnswer = [];
      JSON.parse(this.state.questionList[questionId - 1].answer).forEach(element => 
        nowAnswer.push(element.selected)
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
    window.location.href = `#/home/test/${this.state.subjectId}/${id}`;
    this.setState({
      questionLockerShow: false
    })
  }
  // 题目抽屉中单个元素的dom
  questionListSingle = (element, index) => {
    let questionClassName = '';
    questionClassName = this.state.answerList[index] === undefined ? '' : 'correct';
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
          <div className="judge-box">
            {
              this.state.questionList.map((element, index) => 
                this.questionListSingle(element, index)
              )
            }
          </div>
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
        } else {
          let answerPos = lsSelectedAnswer.indexOf(index);
          if (answerPos > -1) {
            // 当前的正确答案如果能匹配到已选答案，那就是选择正确
            lsSelectedAnswer.splice(answerPos, 1);
          } else {
            selectedWrong = true;
          }
        }
      }
    }
    // 正确答案已经循环完毕，但是已选答案并未完全扣除，那么剩下的就都是错误的
    if (lsSelectedAnswer.length > 0) {
      selectedWrong = true;
    }
    if (selectedWrong) {
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
    }
    let lsArr = this.state.answerList;
    lsArr[this.state.questionId - 1] = selectedWrong ? false : true;
    
    this.setState({
      answerList: lsArr
    });
    message.success('下一题', 1, () => {
      this.switchQuestion(this.state.switchBtn.next);
    });
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
      })
    }
  }
  // 选择项的dom渲染
  optionDom = (data) => {
    const answerArr = ['A', 'B', 'C', 'D', 'E', 'F'];
    return (
      <p
        className={this.state.selectedClassName[data[1]]}
        onClick={() => this.clickQuestion(data[1])}
      >{answerArr[data[1]]}: {data[0].content}</p>
    )
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
    return (
      <Button 
      onClick={() => this.createSelectClass()} 
      type='primary'
      disabled={this.state.multipleChoiceDisabled}>提交</Button>
    );
  }
  calculatingScore = () => {
    this.count(true);
    let score = 0;
    this.state.answerList.forEach(element => {
      if (element) {
        score += 2;
      }
    })
    alert(`本次得分${score}`);
    window.location.href = '#/home/subjects';
  }
  // 提交试卷
  testEnd = () => {
    const _this = this;
    Modal.confirm({
      title: '确定要交卷吗？',
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() { 
        _this.calculatingScore();
      },
      onCancel() {},
    });
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
      window.location.href = `#/home/test/${this.state.subjectId}/${id}`
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
  // 倒计时
  count = (clear) => {
    let countTime = 5400;    
    let countFun = setInterval(() => {
      if (countTime) {
        let MM = Math.floor(countTime / 60);
        let SS = countTime % 60;
        if (SS < 10) {
          SS = `0${SS}`;
        }
        this.setState({
          countString: `${MM}:${SS}`
        });
        countTime--;
      } else {
        this.calculatingScore();
        clearInterval(countFun);
      }
    }, 1000);
    if (clear) {
      clearInterval(countFun);
    }
  }
  render() {
    const nowQuestion = this.state.questionList[this.state.questionId - 1];
    return (
      <div className='practice-main'>
        <div className='count'>{this.state.countString}</div>
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
          className='logout'
          type="cloud-upload"
          onClick={() => this.testEnd()} />
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

export default TestComponent