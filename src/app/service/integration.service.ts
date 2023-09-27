import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  API_URL: string = environment.APIEndpoint+ 'api/';
  API: string = environment.APIEndpoint+ 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  getMomGateway(): Observable<any> {
    return this.http.get(`${this.API_URL}Intergration/GetMOMGateway`);
  }

  SaveMomGateway(data): Observable<any> {
    return this.http.post(`${this.API_URL}Intergration/SaveMOMGateway`, data);
  }

  testMomApi(data): Observable<any> {
    return this.http.get(`${this.API_URL}Intergration/MOMTest?cardNo=${data?.cardNo}`);
  }

  getSmsGateway(): Observable<any> {
    return this.http.get(`${this.API_URL}Intergration/GetSMSGateway`);
  }

  SaveSmsGateway(data): Observable<any> {
    return this.http.post(`${this.API_URL}Intergration/SaveSMSGateway`, data);
  }

  testSmsGatewayApi(data): Observable<any> {
    return this.http.get(`${this.API_URL}Intergration/TestSMSGateway?MobileNo=${encodeURIComponent(data?.MobileNo)}`);
  }


  getSSAConnection(): Observable<any> {
    return this.http.get(`${this.API_URL}Intergration/GetSSAConnection`);
  }

  SaveSSAConnection(data): Observable<any> {
    return this.http.post(`${this.API_URL}Intergration/SaveSSAConnection`, data);
  }

  testSSAConnection(): Observable<any> {
    return this.http.get(`${this.API_URL}Intergration/TestSSAConnection`);
  }

  testAcsServer(): Observable<any> {
    return this.http.get(`${this.API}ACSServer/ACSServerLogin`);
  }

  
}
