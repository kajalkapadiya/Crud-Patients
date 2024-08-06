import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map, of, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/users';
  private stockCheckUrl =
    'https://api.evitalrx.in/v1/fulfillment/orders/checkout';
  private apiKey = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';

  constructor(private http: HttpClient) {}

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
        console.error('Error updating cart:', error);
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
        console.error('Error updating cart:', error);
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
        console.error('Error removing from cart:', error);
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
        console.error('Error clearing cart:', error);
        return of({ message: 'Failed to clear cart' });
      })
    );
  }

  deleteFromCart(productId: string): Observable<any> {
    const email = this.getLoggedInUserEmail();
    if (!email) {
      console.error('User not logged in');
      return throwError('User not logged in');
    }

    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      switchMap((users) => {
        if (users.length === 0) {
          return throwError('User not found');
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
        console.error('Error deleting product from cart:', error);
        return throwError(error);
      })
    );
  }

  placeOrder(orderData: any): Observable<any> {
    const email = this.getLoggedInUserEmail();
    if (!email) {
      console.error('User not logged in');
      return throwError('User not logged in');
    }

    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      switchMap((users) => {
        if (users.length === 0) {
          return throwError('User not found');
        }

        const user = users[0];
        const updatedOrders = user.orders
          ? [...user.orders, orderData]
          : [orderData];

        return this.updateUserOrders(user.id, updatedOrders);
      }),
      catchError((error) => {
        console.error('Error placing order:', error);
        return throwError(error);
      })
    );
  }
}
