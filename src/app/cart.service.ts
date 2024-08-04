import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';
  private checkAvailability_url =
    'https://api.evitalrx.in/v1/fulfillment/orders/checkout';
  private placeOrder_url =
    'https://api.evitalrx.in/v1/fulfillment/orders/place_order';
  private apikey = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';

  constructor(private http: HttpClient) {}

  addToCart(product: any): Observable<any> {
    console.log(product);
    return this.getCart().pipe(
      switchMap((cart) => {
        const existingProduct = cart.find(
          (item) => item.medicine_name === product.medicine_name
        );
        if (existingProduct) {
          existingProduct.quantity += 1;
          return this.http.put(
            `${this.apiUrl}/${existingProduct.id}`,
            existingProduct
          );
        } else {
          product.quantity = 1;
          return this.http.post(this.apiUrl, product);
        }
      })
    );
  }

  updateCart(product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${product.id}`, product);
  }

  removeFromCart(product: any): Observable<any> {
    if (product.quantity > 1) {
      product.quantity -= 1;
      return this.updateCart(product);
    } else {
      return this.deleteFromCart(product);
    }
  }

  deleteFromCart(product: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${product.id}`);
  }

  getCart(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  clearCart(): Observable<any> {
    return this.getCart().pipe(
      switchMap((cart) => {
        const deleteRequests = cart.map((item) =>
          this.http.delete(`${this.apiUrl}/${item.id}`).toPromise()
        );
        return Promise.all(deleteRequests);
      }),
      map(() => ({ message: 'Cart cleared' }))
    );
  }

  checkAvailability(
    medicine_ids: number[],
    fullAddress: string
  ): Observable<any> {
    const requestBody = {
      apikey: this.apikey,
      medicine_ids: JSON.stringify(medicine_ids),
      full_address: fullAddress,
    };
    return this.http.post(
      `${this.checkAvailability_url}/checkout`,
      requestBody
    );
  }

  placeOrder(items: any[], fullAddress: string): Observable<any> {
    const requestBody = {
      apikey: this.apikey,
      items: JSON.stringify(items),
      delivery_type: 'delivery',
      full_address: fullAddress,
    };
    return this.http.post(`${this.placeOrder_url}/place_order`, requestBody);
  }
}
