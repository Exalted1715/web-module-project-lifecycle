
import React from 'react'
import axios  from 'axios'
import Form from './Form'
import TodoList from './TodoList'


const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleted: true,
  }
  
  onTodoNameInputChange = evt =>{
    const {value} = evt.target
    //here we are extracting the value as the event target provided by the user
    this.setState({...this.state, todoNameInput: value})
    //then shoving that value here with todoNameInput: value
  }

  resetForm = () => {
    this.setState({...this.state, todoNameInput: ''})
  }

  setAxiosResponseError = err =>this.setState({...this.state, error: err.response.data.message}) 

  postnewTodo = () => {
    axios.post(URL, {name: this.state.todoNameInput})
    .then (res => {
      this.setState({...this.state, todos: this.state.todos.concat(res.data.data)})
      this.resetForm()
    })
    .catch(this.setAxiosResponseError)
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
    .catch(this.setAxiosResponseError)
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
      .then(res =>{
        this.setState({...this.state, todos: this.state.todos.map(td =>{
          if(td.id !== id) return td 
          return res.data.data
        })
        })
      })
      .catch(this.setAxiosResponseError)
  }

  toggleDisplayCompleted = () => {
    this.setState({...this.state, displayCompleted: !this.state.displayCompleted})
  }

  componentDidMount(){
    /// fetch all todos from sever
    this.fetchAllTodos()
  }


  render() {
    return (
      <div>
        <div id='error'>{this.state.error}</div>

        <TodoList
        todos={this.state.todos}
        displayCompleted={this.state.displayCompleted}
        toggleCompleted={this.toggleCompleted}
        />
        
        <Form
        onTodoFormSubmit = {this.onTodoFormSubmit}
        todoNameInput = {this.state.todoNameInput}
        displayCompleted = {this.state.displayCompleted}
        onTodoNameInputChange = {this.onTodoNameInputChange}
        toggleDisplayCompleted = {this.toggleDisplayCompleted}
        />
   </div>
    )
  }
}
