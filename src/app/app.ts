  import { Component, OnInit } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { TaskService } from './services/task';
  import { ApiTodo } from './models/api-todo';
  import {CreateTodo} from './models/create-todo'

    type Task = {
    text: string;
    completed: boolean;
  }

  @Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
    imports: [
    FormsModule
  ],
  })

  export class App implements OnInit {
    title = "Task Manager Angular"

    tasks: Task[] = []
    apiTasks: ApiTodo[] = []
    taskText = ""
    searchText = ""
    editingIndex = -1
    editingText = ""
    currentFilter = "all"
    darkMode = false
    
    constructor(private taskService: TaskService){

    }

    ngOnInit(){
    /**
      const newTodo: CreateTodo = {
        userId: 1,
        title: "Aprender POST",
        completed: false
        }
    this.taskService.createApiTask(newTodo).subscribe(data =>{
      
    })
    ------------------prueba delete/PUT
    const todo = this.apiTasks[0]
 
    this.taskService.deleteApiTask(todo.id).subscribe(data =>{
      console.log(data)
   })
    */
   this.tasks = this.taskService.getTasks()

   this.taskService.getApiTasks().subscribe(data =>{
     this.apiTasks = data
    })
   
    this.darkMode = this.taskService.getDarkMode()
  }



    hasTasks(){
      return this.tasks.length > 0
    }

    onInput(texto: string){
      this.taskText = texto
    }

    addTask(){
      if (this.taskText == ""){
        return
      }
      
      this.tasks.push({
        text: this.taskText,
        completed: false
      })

      const todo: CreateTodo = {
        userId: 1,
        title: this.taskText,
        completed: false
      }
      this.taskService.createApiTask(todo).subscribe(data =>{
        this.apiTasks.push (data)
      })
      this.taskText = ""
      this.taskService.saveTasks(this.tasks)
      console.log(todo)
    }

    deleteTask(task: Task){
      const index = this.tasks.findIndex(t => t === task)
      this.tasks.splice(index, 1)
      this.taskService.saveTasks(this.tasks)
    }

    getTaskCount(){
      return this.tasks.length
    }

    toggleTask(task : Task){
       const index = this.tasks.findIndex(t => t === task)
      this.tasks[index].completed = !this.tasks[index].completed
      this.taskService.saveTasks(this.tasks)
    }

    toggleDarkMode(){
      this.darkMode = !this.darkMode
      this.taskService.saveDarkMode(this.darkMode)
    }

    getCompletedTasksCount(){
      return this.tasks.filter(task => task.completed).length
    }

    getPendingTasksCount(){
      return this.getTaskCount() - this.getCompletedTasksCount()
    }

    clearCompletedTasks(){
      this.tasks = this.tasks.filter(t => t.completed != true)
      this.taskService.saveTasks(this.tasks)
    }

    editTask(index : number){
      this.editingIndex = index
      this.editingText = this.tasks[index].text

    }

    saveEdit(){
      this.tasks[this.editingIndex].text = this.editingText
      this.taskService.saveTasks(this.tasks)
      this.editingIndex = -1
    }

    changeFilter(filter: string){
      this.currentFilter = filter
    }

    getFilteredTasks(){
      let filteredTasks = this.tasks

      if(this.currentFilter === 'all'){
        filteredTasks = this.tasks
      }

      if(this.currentFilter === 'active'){
        filteredTasks = this.tasks.filter(t => !t.completed)
      }

      if(this.currentFilter === 'completed'){
        filteredTasks = this.tasks.filter(t => t.completed)
      }
      filteredTasks = filteredTasks.filter(t => t.text.toLowerCase().includes(this.searchText.toLowerCase()))

      return filteredTasks
    }

    getFilteredApiTasks(){
      let FilteredTasks = this.apiTasks
      
    }

    deleteApiTask(id: number){
      this.taskService.deleteApiTask(id).subscribe(data =>{
        console.log(data)
        const index = this.apiTasks.findIndex(todo => todo.id === id)

        console.log("ID:", id)
        console.log("INDEX:", index)

        if (index != -1) {
          this.apiTasks.splice(index,1)
        }

        console.log(this.apiTasks)

      })
    }

    onSearch(value: string){
      this.searchText = value
    }
  }