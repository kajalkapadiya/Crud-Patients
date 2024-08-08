import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  authStatus = this.isAuthenticated.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

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
            localStorage.setItem('user_email', email);
            this.router.navigate(['/']);
          } else {
            this._snackBar.open('Invalid email or password', 'close', {
              duration: 3000,
            });
          }
        },
        (error) => {
          this._snackBar.open('Login Error', 'close', { duration: 3000 });
        }
      );
  }

  signup(email: string, password: string) {
    const newUser = { email, password, order: [], cart: [] };
    this.http.post<any>('http://localhost:3000/users', newUser).subscribe(
      (user) => {
        localStorage.setItem('token', 'fake-jwt-token');
        localStorage.setItem('user_email', email);
        this.isAuthenticated.next(true);

        this.router.navigate(['/app-products']);
      },
      (error) => {
        this._snackBar.open('Signup Error', 'close', { duration: 3000 });
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
