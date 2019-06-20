import React , { Component } from 'react'
import __post from '../api'
import '../scss/subject.scss'

function SubjectModule(props) {
  let subjectDom = props.data.map((element, index) => 
    <section key={index} className='subject' onClick={props.goQuestion.bind(this, element.id)}>
      <header>
        <h3>{element.name}</h3>
        <small>{element.commit}</small>
      </header>
      <footer>
        <p>单选 - {element.single}</p>
        <p>多选 - {element.multiple}</p>
        <p>判断 - {element.judge}</p>
      </footer>
    </section>
  )
  return subjectDom;
}

class Subject extends Component {
  state = {
    subjectsData: []
  }
  componentWillMount() {
    this.getQuestionList();
  }
  getQuestionList = () => {
    __post('subject/getSubjectList', {}).then(res => {
      this.setState({
        subjectsData: res
      });
    })
  }
  goQuestion = () => {

  }
  render() {
    return (
      <div className='subject-main'>
        <SubjectModule 
        data={this.state.subjectsData}
        goQuestion={() => this.goQuestion}/>
      </div>
    )
  }
}

export default Subject