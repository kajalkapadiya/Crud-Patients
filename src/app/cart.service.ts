import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) {}

  addToCart(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  getCart(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}
