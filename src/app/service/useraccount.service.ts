import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UseraccountService {

  API_URL: string = environment.APIEndpoint+ 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  saveUserAccount(data): Observable<any> {
    return this.http.post(`${this.API_URL}Users/SaveUser`, data);
  }

  getUserAccountList(data): Observable<any> {
    return this.http.post(`${this.API_URL}Users/GetAllUsers`, data);
  }


  GetUserAccountById(id): Observable<any> {
    return this.http.get(`${this.API_URL}Users/GetUser?id=${id}`);
  }

  deleteUserAccount(id): Observable<any> {
    return this.http.get(`${this.API_URL}Users/DeleteUser?id=${id}`);
  }
}
