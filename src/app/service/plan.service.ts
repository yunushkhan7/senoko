import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  API_URL: string = environment.APIEndpoint + 'Plan/';

  constructor(
    private http: HttpClient,
  ) { }

  getPlansList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetPlans`, param);
  }

  savePlan(data): Observable<any> {
    return this.http.post(`${this.API_URL}Save`, data);
  }

  GetPlanById(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}GetPlan`, { params: param });
  }

  deleteAddress(id): Observable<any> {
    return this.http.delete(`${this.API_URL}Delete?id=${id}`);
  }

}
