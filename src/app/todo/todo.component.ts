import { Component, OnInit } from '@angular/core';
import { CreateTodo, Todo } from '../interface/todo.interface';
import { AuthService } from '../services/auth.service';
import { TodoService } from '../services/todo.service';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../common/app-error';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todoList: any[] = [];
  Math = Math;
  currentPage: number = 1;

  constructor(public auth: AuthService, private service: TodoService) {
  }

  ngOnInit(): void {
    this.service.findAll(this.auth.user?.id).subscribe(todos => this.todoList = todos)
  }

  saveTodo(input: HTMLInputElement) {
    if (input.value.trim()) {
      const id = input.dataset.todoId
      if (id) this.updateTitle(id, input);
      else this.addTodo(input)
    }

    input.value = ""
    input.dataset.todoId = ""
  }

  deleteTodo(id: string) {
    const item = this.todoList.find(todo => todo.id === id)
    const index = this.todoList.indexOf(item)

    if (index > -1) {
      this.todoList.splice(index, 1)
      this.service.deleteOne(id).subscribe(() => { }, (err: AppError) => {
        this.todoList.splice(index, 0, item)
      })
    }
  }

  completeToggle(item: Todo) {
    if (item) {
      item.completed = !item.completed;
      this.service.edit(item.id, { completed: item.completed }).subscribe(() => { }, (err: AppError) => {
        item.completed = !item.completed
      })
    }
  }

  editTitle(item: Todo, input: HTMLInputElement) {
    if (item) {
      input.value = item.title;
      input.dataset.todoId = item.id;
      input.focus()
    }
  }

  private addTodo(input: HTMLInputElement) {
    let todo: CreateTodo = { title: input.value.trim(), userId: this.auth.user?.id || '' }
    let tempTodo: Todo = { ...todo, id: uuidv4(), completed: false, createdAt: new Date(), updatedAt: new Date() }

    this.todoList?.splice(0, 0, tempTodo)

    this.service.create(todo).subscribe(newTodo => {
      tempTodo['id'] = newTodo.id;
      tempTodo['createdAt'] = newTodo.createdAt
      tempTodo['updatedAt'] = newTodo.updatedAt
    }, (err: AppError) => {
      this.todoList?.splice(0, 1)
    })
  }

  private updateTitle(id: string, input: HTMLInputElement) {
    const todo = this.todoList.find(todo => todo.id === id)
    const oldTitle = todo.title
    todo.title = input.value.trim()

    this.service.edit(id, { title: todo.title }).subscribe(() => {
      input.dataset.todoId = ""
    }, (err: AppError) => {
      todo.title = oldTitle
    })
  }

  logout() {
    this.auth.logout()
  }

  pageChanged(page: number) {
    this.currentPage = page
  }
}
