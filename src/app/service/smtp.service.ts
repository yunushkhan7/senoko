import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmtpService {

  API_URL: string = environment.APIEndpoint+ 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  SaveMailConfig(data): Observable<any> {
    return this.http.post(`${this.API_URL}ExcelDetails/SaveMailConfig`, data);
  }
  getMailConfig(): Observable<any> {
    return this.http.get(`${this.API_URL}ExcelDetails/GetMailConfig`);
  }

  TestMailConfig(data): Observable<any> {
    return this.http.post(`${this.API_URL}ExcelDetails/TestMailConfig`, data);
  }

  GetMailConfigById(id): Observable<any> {
    return this.http.get(`${this.API_URL}ExcelDetails/GetMailConfigById/${id}`);
  }

}
