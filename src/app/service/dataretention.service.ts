import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataretentionService {

  API_URL: string = environment.APIEndpoint+ 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  saveDataRetention(data): Observable<any> {
    return this.http.post(`${this.API_URL}DataRetention/SaveDataRetention`, data);
  }

  getDataRetentionList(): Observable<any> {
    return this.http.get(`${this.API_URL}DataRetention/GetDataRetention`);
  }
}
