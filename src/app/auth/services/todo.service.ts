// import { Injectable } from '@angular/core';
// // import { Todo } from './todo.model';
// export interface Todo {
//   id: number;
//   text: string;
//   completed: boolean;
// }
// @Injectable({
//   providedIn: 'root'
// })
// export class TodoService {
//   private todos: Todo[] = [];

//   getTodos() {
//     // Simulación de carga desde un servicio real
//     // this.todos = this.http.get<Todo[]>('api/todos').subscribe();
//     return this.todos;
//   }

//   addTodo(todo: Todo) {
//     this.todos.push(todo);
//   }

//   updateTodo(todo: Todo) {
//     // Encuentra el índice del todo a actualizar y actualiza sus propiedades
//   }

//   removeTodo(todo: Todo) {
//     this.todos = this.todos.filter(t => t.id !== todo.id);
//   }
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Activities, Categories } from '../interfaces/interfaces';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl: string = environment.baseUrl;
  private todos: Todo[] = [];
  private todosSubject = new BehaviorSubject<Todo[]>(this.todos);

  constructor(private http: HttpClient) { }

  getListActivities(): Observable<Activities[]> {
    const url = `${this.baseUrl}/activities`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

    return this.http.get<Activities>(url, {headers})
    .pipe(
      map(resp=>resp),
      catchError( err => of(err.error))
    );
  }

  getListCategories(): Observable<Categories[]> {
    const url = `${this.baseUrl}/categories`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

    return this.http.get<Categories>(url, {headers})
    .pipe(
      map(resp=>resp),
      catchError( err => of(err.error))
    );
  }

   // Método para eliminar una tarea por su ID
   deleteTodoById(todoId: number): Observable<any> {
    const url = `${this.baseUrl}/activities/${todoId}`;  // URL para hacer la solicitud DELETE
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    return this.http.delete(url, {headers}).pipe(
      map(resp=>resp),
      catchError( err => of(err.error))
    );
  }

  saveActivity(description: string, idUser: number, idCategory: number ) {
    const url = `${this.baseUrl}/activities`;
    const body = { description, idUser, idCategory };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Activities>(url, body, {headers})
    .pipe(
      map(resp => resp),
      catchError( err => of(err.error))
    );
  }

  // Método PUT para actualizar la tarea
  updateActivity(idActivity: number, description: string, idUser: number, idCategory: number, isCompleted:boolean): Observable<Activities> {
    const url = `${this.baseUrl}/activities/${idActivity}`;  // URL con el ID de la actividad
    const body = { idActivity, description, idUser, idCategory, isCompleted };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<Activities>(url, body, {headers});  // Realiza la solicitud PUT
  }

  getTodos() {
    return this.todosSubject.asObservable();
  }

  addTodo(task: string) {
    const newTodo: Todo = { id: Date.now(), task, completed: false };
    this.todos.push(newTodo);
    this.todosSubject.next(this.todos);
  }

  toggleTodoCompletion(id: number) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.todosSubject.next(this.todos);
    }
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.todosSubject.next(this.todos);
  }
}
