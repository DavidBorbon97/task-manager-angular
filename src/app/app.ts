  import { Component, OnInit } from '@angular/core';
  import { FormsModule } from '@angular/forms';

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
    taskText = ""
    editingIndex = -1
    editingText = ""
    currentFilter = "all"

    ngOnInit(){
      this.loadTasks()
    }

    saveTasks(){
     localStorage.setItem(`taskManager`,JSON.stringify(this.tasks)) 
    }

    loadTasks(){
      const savedTasks = localStorage.getItem("taskManager")
      if (savedTasks != null){
        this.tasks = JSON.parse(savedTasks)
      }
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
      this.taskText = ""
      this.saveTasks()

    }

    deleteTask(index: number){
      this.tasks.splice(index, 1)
      this.saveTasks()

    }

    getTaskCount(){
      return this.tasks.length
    }

    toggleTask(index: number){
      this.tasks[index].completed = !this.tasks[index].completed
      console.log(this.tasks[index])
      this.saveTasks()
    }

    getCompletedTasksCount(){
      return this.tasks.filter(task => task.completed).length
    }

    getPendingTasksCount(){
      return this.getTaskCount() - this.getCompletedTasksCount()
    }

    clearCompletedTasks(){
      this.tasks = this.tasks.filter(t => t.completed != true)
      this.saveTasks()
    }

    editTask(index : number){
      this.editingIndex = index
      this.editingText = this.tasks[index].text

      console.log(this.editingText)
    }

    saveEdit(){
      this.tasks[this.editingIndex].text = this.editingText
      this.saveTasks()
      this.editingIndex = -1
    }

    changeFilter(filter: string){
      this.currentFilter = filter
      console.log(this.currentFilter)
    }

    getFilteredTasks(){

      if(this.currentFilter === 'all'){
        return this.tasks
      }

      if(this.currentFilter === 'active'){
        return this.tasks.filter(t => !t.completed)
      }

      if(this.currentFilter === 'completed'){
        return this.tasks.filter(t => t.completed)
      }
      return this.tasks
    }
  }