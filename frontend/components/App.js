
import React from 'react'
import axios  from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
  }
  
  onTodoNameInputChange = evt =>{
    const {value} = evt.target
    //here we are extracting the value as the event target provided by the user
    this.setState({...this.state, todoNameInput: value})
    //then shoving that value here with todoNameInput: value
  }

  postnewTodo = () => {
    axios.post(URL, {name: this.state.todoNameInput})
    .then (res => {
      this.fetchAllTodos()
      this.setState({...this.state, todoNameInput: ''})
    })
    .catch(err => {
      this.setState({...this.state, error: err.response.data.message})
    })
  }

  onTodoFormSubmit = evt => {
    evt.preventDefault()
    this.postnewTodo()
  }

  fetchAllTodos = () =>{
    axios.get(URL)
    .then(res => {
      this.setState({...this.state, todos: res.data.data})
    })
    .catch(err => {
     this.setState({...this.state, error: err.response.data.message})
    })
  }

  componentDidMount(){
    /// fetch all todos from sever
    this.fetchAllTodos()
  }


  render() {
    return (
      <div>
        <div id='error'>{this.state.error}</div>
        <div id='todos'>
          <h2>Todos:</h2>
          {
            this.state.todos.map(td => {
              return<div key={td.key}>{td.name}</div>
            })
          } 
        </div>
      <form id="todoForm" onSubmit={this.onTodoFormSubmit}>
        <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type="text" placeholder='Type todo'></input>
        <input type='submit'></input>
        <button>Clear Completed</button>
      </form>
      </div>
    )
  }
}
