import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, map, of, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/users';
  private patientsListUrl = 'http://localhost:3000/patients';
  private placeOrderUrl =
    'https://dev-api.evitalrx.in/v1/fulfillment/orders/place_order';
  private apiKey = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  public getLoggedInUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  public getUserByEmail(email: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      map((users) => users[0]),
      catchError(() => of(null))
    );
  }

  private updateUserCart(userId: number, updatedCart: any[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}`, { cart: updatedCart });
  }

  private updateUserOrders(
    userId: number,
    updatedOrders: any[]
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}`, {
      order: updatedOrders,
    });
  }

  addToCart(product: any): Observable<any> {
    const email = this.getLoggedInUserEmail();
    if (!email) {
      return of(null);
    }

    return this.getUserByEmail(email).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }

        const userId = user.id;
        const cart = user.cart || [];
        const existingProduct = cart.find(
          (item: any) => item.medicine_name === product.medicine_name
        );

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          product.quantity = 1;
          cart.push(product);
        }

        return this.updateUserCart(userId, cart);
      }),
      catchError((error) => {
        this._snackBar.open('Error updating cart:', 'close', {
          duration: 3000,
        });

        return of(null);
      })
    );
  }

  updateCart(product: any): Observable<any> {
    const email = this.getLoggedInUserEmail();
    if (!email) {
      return of(null); // Handle user not logged in
    }

    return this.getUserByEmail(email).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null); // Handle user not found
        }

        const userId = user.id;
        const cart = user.cart || [];
        const productIndex = cart.findIndex(
          (item: any) => item.id === product.id
        );

        if (productIndex > -1) {
          cart[productIndex] = product;
          return this.updateUserCart(userId, cart);
        } else {
          return of(null); // Handle product not found in cart
        }
      }),
      catchError((error) => {
        this._snackBar.open('Error updating cart:', 'close', {
          duration: 3000,
        });

        return of(null);
      })
    );
  }

  removeFromCart(product: any): Observable<any> {
    const email = this.getLoggedInUserEmail();
    if (!email) {
      return of(null); // Handle user not logged in
    }

    return this.getUserByEmail(email).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null); // Handle user not found
        }

        const userId = user.id;
        const cart = user.cart || [];
        const productIndex = cart.findIndex(
          (item: any) => item.id === product.id
        );

        if (productIndex > -1) {
          if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
            return this.updateUserCart(userId, cart);
          } else {
            cart.splice(productIndex, 1);
            return this.updateUserCart(userId, cart);
          }
        } else {
          return of(null); // Handle product not found in cart
        }
      }),
      catchError((error) => {
        this._snackBar.open('Error removing from cart:', 'close', {
          duration: 3000,
        });

        return of(null);
      })
    );
  }

  clearCart(): Observable<any> {
    const email = this.getLoggedInUserEmail();
    if (!email) {
      return of(null); // Handle user not logged in
    }

    return this.getUserByEmail(email).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null); // Handle user not found
        }

        const userId = user.id;
        return this.updateUserCart(userId, []);
      }),
      map(() => ({ message: 'Cart cleared' })),
      catchError((error) => {
        this._snackBar.open('Error clearing cart:', 'close', {
          duration: 3000,
        });
        return of({ message: 'Failed to clear cart' });
      })
    );
  }

  deleteFromCart(productId: string): Observable<any> {
    const email = this.getLoggedInUserEmail();
    if (!email) {
      this._snackBar.open('User not loggeed in!', 'close', { duration: 3000 });
    }

    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      switchMap((users) => {
        if (users.length === 0) {
          this._snackBar.open('User not found', 'close', { duration: 3000 });
        }

        const user = users[0];

        const updatedCart = user.cart.filter(
          (product: any) => product.medicine_id !== productId
        );

        return this.http.patch(`${this.apiUrl}/${user.id}`, {
          cart: updatedCart,
        });
      }),
      catchError((error) => {
        this._snackBar.open('Error deleting product from cart:', 'close', {
          duration: 3000,
        });
        return of(error);
      })
    );
  }

  placeOrder(orderData: any): Observable<any> {
    const email = this.getLoggedInUserEmail();
    if (!email) {
      this._snackBar.open('User not logged in', 'close', { duration: 3000 });
      return of('User not logged in');
    }

    return this.http.get<any[]>(`${this.patientsListUrl}?email=${email}`).pipe(
      map((patients) => {
        if (patients.length === 0) {
          throw new Error('User not found');
        }
        return patients[0];
      }),
      switchMap((patient) => {
        if (!patient) {
          throw new Error('User is not a patient');
        }

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        });

        // Construct request body
        const requestBody = {
          items: JSON.stringify(orderData.items), // Only stringify here
          apikey: orderData.apikey,
          delivery_type: 'pickup', // Update based on actual form data
          address: orderData.address,
          address_line2: orderData.address_line2,
          city: orderData.city,
          state: orderData.state,
          zipcode: orderData.zipcode,
          mobile: orderData.mobile,
          patient_name: orderData.patient_name,
          full_address: orderData.full_address,
        };

        return this.http
          .post<any>(this.placeOrderUrl, requestBody, { headers })
          .pipe(
            catchError((error) => {
              this._snackBar.open('Error placing order:', 'close', {
                duration: 3000,
              });

              return of(error);
            })
          );
      }),
      catchError((error) => {
        this._snackBar.open('Error while place the order', 'close', {
          duration: 3000,
        });
        return of(error);
      })
    );
  }
}
