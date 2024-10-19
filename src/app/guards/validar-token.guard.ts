import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {
  canActivate(): Observable<boolean> | boolean {
    const token = localStorage.getItem('token');
    if (token) {
      // console.log('CanActivate', token);
      return true;
    } else {
      return false;
    }
  }
  canLoad(): Observable<boolean> | boolean {
    // console.log('CanLoad');
    return true;
  }
}
