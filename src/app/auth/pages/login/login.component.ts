import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  miFormulario!: FormGroup;

  constructor(
     private fb: FormBuilder,
     private router: Router,
     private authService: AuthService,
     ) { }

  ngOnInit(): void {
    // Inicializar el formulario en ngOnInit
    this.miFormulario = this.fb.group({
      email: ['test1@test.com', [Validators.required, Validators.email]],
      password: ['testtest', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    const {email, password} = this.miFormulario.value;
    this.authService.login(email, password).subscribe( ok => {
      if (ok === true) {
          this.router.navigateByUrl('/dashboard');
        } else {
          Swal.fire('Error', ok, 'error');
        }
    });
  }
}
