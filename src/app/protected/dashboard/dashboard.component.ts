import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TodoService } from '../../auth/services/todo.service';
import { Activities, Categories } from '../../auth/interfaces/interfaces';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
[x: string]: any;
  activityForm!: FormGroup;
  newTask: string = '';
  selectedCategory: string = 'All';  // Categoría seleccionada por defecto
  todos: { task: string, category: string, completed: boolean, id: number }[] = [];
  nextId: number = 1;
  listActivities: Activities[] = [];
  listCategories: Categories[] = [];

  constructor(
    private router: Router,
    private todoService: TodoService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.activityForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(1)]],
      idUser: [Number(localStorage.getItem('idPersona')), []],
      idCategoria: [null, [Validators.required]],
      isCompleted: [null, [Validators.required]],
    });
    this.getListActivities();
    this.getListCategories();

    // Escuchar los cambios en el select (idCategoria)
    this.activityForm.get('idCategoria')?.valueChanges.subscribe(value => {
      this.filterItems(value);  // Filtrar los ítems según la categoría seleccionada
    });
  }

  // Método para filtrar los ítems según la categoría seleccionada
  filterItems(selectedCategoryId: number | null): void {
    if (selectedCategoryId === null || selectedCategoryId === 0) {
      // Si no se ha seleccionado categoría o se seleccionó "All", mostrar todos los ítems
      this.getListActivities(); 
    } else {
      // Filtrar los ítems según la categoría seleccionada
      const idPersona = Number(localStorage.getItem('idPersona'));
      this.todoService.getListActivities().subscribe( ok => {
        if (ok) {
          this.listActivities = ok.filter(x => x.idUser == idPersona );
          this.listActivities = this.listActivities.filter(item => {
            this.selectedCategory = selectedCategoryId 
            ? (selectedCategoryId == 1 ? 'FrontEnd' : 
              selectedCategoryId == 2 ? 'BackEnd' : 
              selectedCategoryId == 3 ? 'Base de Datos' : 'All') 
            : 'All';
            return Number(item.idCategory) === Number(selectedCategoryId);
          });         
        }
      });
    }
  }

  getListActivities() {
    const idPersona = Number(localStorage.getItem('idPersona'));
    this.todoService.getListActivities().subscribe( ok => {
      if (ok) {
        this.listActivities = ok.filter(x => x.idUser == idPersona );       
      }
    });
  }

  getListCategories() {
    this.todoService.getListCategories().subscribe( ok => {
      if (ok) {
        this.listCategories = ok;       
      }
    });
  }

  // Método para eliminar una tarea
  deleteTodo(todoId: number): void {
    this.todoService.deleteTodoById(todoId).subscribe({
      next: () => {
        // Eliminar el todo de la lista local (sin hacer otra solicitud a la API)
        this.listActivities = this.listActivities.filter(todo => todo.idActivity !== todoId);
      },
      error: (err) => {
        console.error('Error al eliminar la tarea:', err);
      }
    });
  }

  createActivity() {
    const {descripcion, idUser, idCategoria} = this.activityForm.value;
    if(descripcion && idCategoria) {
      this.todoService.saveActivity(descripcion, idUser, parseInt(idCategoria)).subscribe( ok => {
        if (ok) {      
          this.getListActivities();
          Swal.fire(
            'Good job!',
            'Successful registration!',
            'success'
          );
          this.activityForm.reset({
            idUser: Number(localStorage.getItem('idPersona')), // Mantener este valor
          });
          this.selectedCategory = 'All';
          } else {
            Swal.fire('Error', ok, 'error');
          }
      });
    } else {
      Swal.fire(
        'Campos Obligatorios',
        'Debe llenar todos los campos',
        'warning'
      );
    }
    
  }

  // Método para agregar tareas
  addTodo(): void {
    if (this.newTask.trim()) {
      this.todos.push({
        task: this.newTask,
        category: this.selectedCategory,
        completed: false,
        id: this.nextId++
      });
      this.newTask = ''; // Limpiar el campo de entrada después de agregar la tarea
    }
  }

  // Método para cambiar el estado de completado de la tarea
  toggleCompletion(data: any): void {
    const todo = this.listActivities.find(t => t.idActivity == data.idActivity);
    data.isCompleted = !data.isCompleted;

    this.todoService.updateActivity(data.idActivity, data.description, data.idUser, data.idCategory, data.isCompleted).subscribe( ok => {
      if (ok) {      
        Swal.fire(
          data.isCompleted ? 'Tarea Completa': 'Tarea Pendiente!',
          data.isCompleted ? 'Buen trabajo, completaste la tarea!': 'Aun no has completado la tarea!',
          data.isCompleted ? 'success': 'warning'
        );
        } else {
          Swal.fire('Error', ok, 'error');
        }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('idPersona');
    this.router.navigateByUrl('/auth');
  }
}
