import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  API_URL: string = environment.APIEndpoint + 'v1/Hotel/';

  constructor(
    private http: HttpClient,
  ) { }

  getHotelsList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetHotels`, param);
  }

  SaveHotel(data): Observable<any> {
    return this.http.post(`${this.API_URL}SaveHotel`, data);
  }

  deleteHotel(id): Observable<any> {
    return this.http.delete(`${this.API_URL}Delete?id=${id}`);
  }

  getHotelById(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}GetHotel`, { params: param });
  }

  CheckHotelAdminEmailIdExists(param = null) {
    return this.http.get(`${environment.APIEndpoint}v1/Hotel/CheckHotelAdminEmailIdExists`, { params: param });
  }

  // getTiers(params): Observable<any> {
  //   return this.http.post(`${environment.APIEndpoint}v1/Tiers/GetTiers`, params);
  // }
  checkCodeExists(code: string): Observable<any> {
    return this.http.get(`${this.API_URL}CheckCodeExists?code=${code}`);
  }
  // getTenantByCodeEndUser(param): Observable<any> {
  //   return this.http.get(`${environment.APIEndpoint}v1/Tenants/GetTenantByCode`, { params: param });
  // }
  // suspendTenantById(id): Observable<any> {
  //   return this.http.get(`${environment.APIEndpoint}v1/Users/Suspend?id=${id}`);
  // }
}
