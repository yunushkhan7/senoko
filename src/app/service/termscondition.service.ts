import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TermsconditionService {

  API_URL: string = environment.APIEndpoint+ 'api/';

  constructor(
    private http: HttpClient,
  ) { }

  saveTermsCondition(data): Observable<any> {
    return this.http.post(`${this.API_URL}TermsConditions/SaveTermsConditions`, data);
  }

  getTermsCondition(): Observable<any> {
    return this.http.get(`${this.API_URL}TermsConditions/GetTermsConditions`);
  }

}
