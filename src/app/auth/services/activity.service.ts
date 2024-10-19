import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Activities, Times } from '../interfaces/interfaces';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private baseUrl: string = environment.baseUrl;

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

  getTimeActivities(): Observable<Times[]> {
    const url = `${this.baseUrl}/times`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

    return this.http.get<Times>(url, {headers})
    .pipe(
      map(resp=>resp),
      catchError( err => of(err.error))
    );
  }

  saveActivity(description: string, idUser: number ) {
    const url = `${this.baseUrl}/activities`;
    const body = { description, idUser };
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

  saveTimeActivity(date: Date, timeWork: number, idActivity:number ) {
    const url = `${this.baseUrl}/times`;
    const body = { date, timeWork, idActivity};
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Times>(url, body, {headers})
    .pipe(
      map(resp => resp),
      catchError( err => of(err.error))
    );
  }
}
