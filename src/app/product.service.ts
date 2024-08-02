import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrlForDetails =
    'https://api.evitalrx.in/v1/fulfillment/medicines/view';
  private apiUrl =
    'https://dev-api.evitalrx.in/v1/fulfillment/medicines/search';
  private apiKey = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';

  constructor(private http: HttpClient) {}

  searchProducts(searchString: string): Observable<any> {
    const body = { searchstring: searchString, apikey: this.apiKey };
    return this.http.post<any>(this.apiUrl, body);
  }

  getProductDetails(medicineId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = {
      apikey: this.apiKey,
      medicine_id: medicineId,
    };

    return this.http.post<any>(this.apiUrlForDetails, body, { headers });
  }
}
