import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VmsStationService {

  API_URL: string = environment.APIEndpoint+ 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  saveStation(data): Observable<any> {
    return this.http.post(`${this.API_URL}Station/SaveStation`, data);
  }

  getStationList(data): Observable<any> {
    return this.http.post(`${this.API_URL}Station/GetAllStations`,data);
  }


  GetStationById(id): Observable<any> {
    return this.http.get(`${this.API_URL}Station/GetStationById?id=${id}`);
  }

  deleteStation(id): Observable<any> {
    return this.http.get(`${this.API_URL}Station/DeleteStation?id=${id}`);
  }
}
