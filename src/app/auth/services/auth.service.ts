import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    return {...this._usuario};
  }


  constructor( private http: HttpClient) { }

  login(email: string, password: string ) {
    const url = `${this.baseUrl}/Token`;
    const body = { email, password}

    return this.http.post<AuthResponse>(url, body)
    .pipe(
      tap(resp => {
        if (resp.ok) {
          localStorage.setItem('token', resp.token!);
          localStorage.setItem('idPersona', resp.uid!);
          this._usuario = {
            name: resp.name!,
            uid: resp.uid!
          }
        }
      }),
      map(resp=>resp.ok),
      catchError( err => of(err.error))
    );
  }

  saveUser(name: string, email: string, password: string ) {
    const url = `${this.baseUrl}/users`;
    const body = { name,email, password, createdAt:new Date()}
    console.log('body', body);
    return this.http.post<any>(url, body)
    .pipe(
      map(resp=>resp),
      catchError( err => of(err.error))
    );
  }
}
