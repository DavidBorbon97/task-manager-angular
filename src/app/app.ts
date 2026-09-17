  import { Component, OnInit } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { TaskService } from './services/task';
  import { ApiTodo } from './models/api-todo';
  import {CreateTodo} from './models/create-todo'
  import { ChangeDetectorRef } from '@angular/core';

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
    apiTasks: ApiTodo[] = []
    taskText = ""
    searchText = ""
    editingIndex = -1
    editingText = ""
    currentFilter = "all"
    darkMode = false
    
    constructor(private taskService: TaskService,
      private cdr: ChangeDetectorRef
    ){

    }

    ngOnInit(){
   this.taskService.getApiTasks().subscribe(data =>{
    console.log("API RECIBIDA:", data.length)
     this.apiTasks = data
     this.cdr.detectChanges()
     console.log("apiTasks:", this.apiTasks.length)
    })
   
    this.darkMode = this.taskService.getDarkMode()
  }

    hasTasks(){
      return this.apiTasks.length > 0
    }

    onInput(texto: string){
      this.taskText = texto
    }

    addTask(){
      if (this.taskText == ""){
        return
      }
      
      const todo: CreateTodo = {
        userId: 1,
        title: this.taskText,
        completed: false
      }
      this.taskService.createApiTask(todo).subscribe(data =>{
        this.apiTasks.unshift (data)
        console.log(this.apiTasks.length)
        console.log(this.apiTasks[this.apiTasks.length -1])
      })
      this.taskText = ""
      console.log(todo)
    }
    
    toggleTask(todo : ApiTodo){
      const index = this.apiTasks.findIndex(t => t.id === todo.id)
      this.apiTasks[index].completed = !this.apiTasks[index].completed
      console.log(todo)
      this.taskService.updateApiTask(todo).subscribe(data =>{
        console.log("INDEX:",data)
      })
    }
    
    toggleDarkMode(){
      this.darkMode = !this.darkMode
      this.taskService.saveDarkMode(this.darkMode)
    } 
    
    getTaskCount(){
      return this.apiTasks.length
    }

    getCompletedTasksCount(){
      return this.apiTasks.filter(task => task.completed).length
    }

    
    getPendingTasksCount(){
      return this.getTaskCount() - this.getCompletedTasksCount()
    }
    
    clearCompletedTasks(){
      const completedTasks = this.apiTasks.filter(t => t.completed)
      console.log("Completadas:", completedTasks.length)
      completedTasks.forEach(todo =>{
        this.deleteApiTask(todo.id)
      })
    }

    editTask(index : number){
      this.editingIndex = index
      this.editingText = this.apiTasks[index].title
    }

    saveEdit(){
      this.apiTasks[this.editingIndex].title = this.editingText
      this.taskService.updateApiTask(this.apiTasks[this.editingIndex]).subscribe(data =>{
        console.log(data)
      })
      this.editingIndex = -1
    }

    changeFilter(filter: string){
      this.currentFilter = filter
    }


    getFilteredApiTasks(){
      let filteredApiTasks = this.apiTasks

      if(this.currentFilter === 'all')
        {
          filteredApiTasks = this.apiTasks
        }

      if(this.currentFilter === 'active')
        {
          filteredApiTasks = this.apiTasks.filter(t => !t.completed)
        }

        if(this.currentFilter === 'completed')
        {
          filteredApiTasks = this.apiTasks.filter(t => t.completed)
        }

      filteredApiTasks = filteredApiTasks.filter(t => t.title.toLowerCase().includes(this.searchText.toLowerCase()))

        return filteredApiTasks
    }

    deleteApiTask(id: number){
      this.taskService.deleteApiTask(id).subscribe(data =>{
        console.log(data)
        const index = this.apiTasks.findIndex(todo => todo.id === id)

        if (index != -1) {
          this.apiTasks.splice(index,1)
        }
          this.cdr.detectChanges()
          console.log("Después de eliminar:", this.apiTasks.find(todo => todo.id === id))

        console.log(this.apiTasks)

      })
    }

    onSearch(value: string){
      this.searchText = value
    }
  }