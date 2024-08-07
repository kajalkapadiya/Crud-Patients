import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrl = 'https://api.evitalrx.in/v1/fulfillment/orders/checkout';
  private apikey = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';

  constructor(private http: HttpClient) {}

  checkout(
    medicineIds: string[],
    latitude?: number,
    longitude?: number,
    fullAddress?: string
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body: any = {
      apikey: this.apikey,
      medicine_ids: JSON.stringify(medicineIds),
    };

    if (latitude && longitude) {
      body.latitude = latitude;
      body.longitude = longitude;
    } else if (fullAddress) {
      body.full_address = fullAddress;
    }

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
