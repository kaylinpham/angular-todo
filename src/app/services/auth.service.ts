import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators"
import { Auth } from '../interface/auth.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly url: string = "http://localhost:3000/users/auth";

  user: Auth | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  auth(credentials) {
    return this.http.post<Auth>(this.url, credentials).pipe(map(response => {
      if (response && response.id) {
        this.user = { ...response }

        localStorage.setItem('user', JSON.stringify(response))

        return true
      }
      return false
    }))
  }

  isLoggedIn() {
    return new Observable<string | null>(function subscribe(subscriber) {
      subscriber.next(localStorage.getItem('user'))
    })
  }

  logout() {
    localStorage.removeItem('user')
    this.user = null
    this.router.navigateByUrl('/login')
  }
}
