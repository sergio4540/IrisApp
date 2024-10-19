import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new todo', () => {
    service.addTodo('Test Task');
    service.getTodos().subscribe(todos => {
      expect(todos.length).toBe(1);
      expect(todos[0].task).toBe('Test Task');
    });
  });

  it('should toggle todo completion', () => {
    service.addTodo('Test Task');
    service.toggleTodoCompletion(1);
    service.getTodos().subscribe(todos => {
      expect(todos[0].completed).toBeTrue();
    });
  });

  it('should delete a todo', () => {
    service.addTodo('Test Task');
    service.deleteTodo(1);
    service.getTodos().subscribe(todos => {
      expect(todos.length).toBe(0);
    });
  });
});
