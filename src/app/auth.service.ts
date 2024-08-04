import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  authStatus = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    this.http
      .get<any[]>(
        `http://localhost:3000/users?email=${email}&password=${password}`
      )
      .subscribe(
        (users) => {
          if (users.length > 0) {
            localStorage.setItem('token', 'fake-jwt-token');
            this.isAuthenticated.next(true);
            this.router.navigate(['/app-products']);
          } else {
            alert('Invalid email or password');
          }
        },
        (error) => {
          console.error('Login error', error);
        }
      );
  }

  signup(email: string, password: string) {
    const newUser = { email, password };
    this.http.post<any>('http://localhost:3000/users', newUser).subscribe(
      (user) => {
        localStorage.setItem('token', 'fake-jwt-token');
        this.isAuthenticated.next(true);
        this.router.navigate(['/app-products']);
      },
      (error) => {
        console.error('Signup error', error);
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    this.router.navigate(['/app-login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
