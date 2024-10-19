import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { TodoService } from '../../auth/services/todo.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('TodoComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let todoService: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [MatButtonModule, MatInputModule, MatListModule, MatCheckboxModule],
      providers: [TodoService]
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new task', () => {
    component.newTask = 'New Task';
    component.addTodo();
    todoService.getTodos().subscribe(todos => {
      expect(todos.length).toBe(1);
      expect(todos[0].task).toBe('New Task');
    });
  });

  it('should toggle task completion', () => {
    component.newTask = 'New Task';
    component.addTodo();
    component.toggleCompletion(1);
    todoService.getTodos().subscribe(todos => {
      expect(todos[0].completed).toBeTrue();
    });
  });

  it('should delete a task', () => {
    component.newTask = 'New Task';
    component.addTodo();
    component.deleteTodo(1);
    todoService.getTodos().subscribe(todos => {
      expect(todos.length).toBe(0);
    });
  });
});
