import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiTodo } from '../models/api-todo';
import { CreateTodo } from '../models/create-todo';

export interface Task {
    text: string
    completed: boolean
}

@Injectable({
    providedIn: `root`
})

export class TaskService{

    constructor(private httpClient: HttpClient){

    }

    getTasks() {
        const savedTasks = localStorage.getItem("taskManager")
        if (savedTasks != null){
            return JSON.parse(savedTasks)
        }
        return []
    }

    saveTasks(tasks: Task[]){
        localStorage.setItem(`taskManager`,JSON.stringify(tasks))
    }
    

    getApiTasks(){
        return this.httpClient.get<ApiTodo[]>('https://jsonplaceholder.typicode.com/todos')
    }
    
    createApiTask(todo: CreateTodo){
        return this.httpClient.post<ApiTodo>('https://jsonplaceholder.typicode.com/todos', todo)
    }

    getDarkMode(){
        const savedDackMode = localStorage.getItem(`taskDarkMode`)
        if (savedDackMode !=null){
            return JSON.parse(savedDackMode)
        }
    }
    
    saveDarkMode(darkMode: boolean){
        localStorage.setItem(`taskDarkMode`,JSON.stringify(darkMode)) 
    }
    
    
}
    

