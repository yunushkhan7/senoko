import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {

  API_URL: string = environment.APIEndpoint+ 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  saveAccesslog(data): Observable<any> {
    return this.http.post(`${this.API_URL}AccessLog/SaveAccessLog`, data);
  }

  getAccesslogList(data): Observable<any> {
    return this.http.post(`${this.API_URL}AccessLog/GetAllAccessLog`,data);
  }

  getReports(params): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetReports`, params);
  }
  getAllAccessLogReports(params): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetAllAccessLogReports`, params);
  }
  
  saveReport(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/SaveRegistration`, data);
  }
  
}
