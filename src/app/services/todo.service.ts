import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppError } from '../common/app-error';
import { BadRequestError } from '../common/bad-request-error';
import { NotFoundError } from '../common/not-found-error';
import { CreateTodo, Todo } from '../interface/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly url = "http://localhost:3000/"

  constructor(private http: HttpClient) { }

  findAll(userId: string = '') {
    return this.http.get<Todo[]>(this.url + 'users/' + userId + '/todos').pipe(catchError(this.handleError))
  }

  create(todo: CreateTodo) {
    return this.http.post<Todo>(this.url + 'todos', todo).pipe(catchError(this.handleError))
  }

  deleteOne(id: string) {
    return this.http.delete<Todo>(this.url + `todos/${id}`).pipe(catchError(this.handleError))
  }

  edit(id: string, payload) {
    return this.http.put<Todo>(this.url + `todos/${id}`, payload).pipe(catchError(this.handleError))
  }

  private handleError(err: Response) {
    if (err.status === 400) return throwError(new BadRequestError(err))
    if (err.status === 404) return throwError(new NotFoundError())
    return throwError(new AppError(err))
  }
}
