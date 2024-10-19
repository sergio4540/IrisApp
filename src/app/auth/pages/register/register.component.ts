import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  miFormulario!: FormGroup; 

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
    
    ) { }

  ngOnInit(): void {
    this.miFormulario = this.fb.group({
      name: ['Sergio', [Validators.required]],
      email: ['test1@test.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });
  }

  registro() {
    const {name,email, password} = this.miFormulario.value;
    this.authService.saveUser(name,email, password ).subscribe( ok => {
      if (ok) {
        Swal.fire(
          'Good job!',
          'Successful registration!',
          'success'
        )
          this.router.navigateByUrl('/auth/login');
        } else {
          Swal.fire('Error', ok, 'error');
        }
    });
  }
}
