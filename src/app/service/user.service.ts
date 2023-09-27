import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API: string = environment.APIEndpoint + 'api/v1/';
  constructor(
    private http: HttpClient,
  ) { }

  getUserList(param = null): Observable<any> {
    return this.http.post(`${this.API}GetUsers`, param);
  }

  saveUser(data): Observable<any> {
    return this.http.post(`${this.API}Users/SaveUser`, data);
  }
  fileUpload(data,param): Observable<any> {
    return this.http.post(`${this.API}BulkUpload`, data,{params:param});
  }

  getUserById(param): Observable<any> {
    return this.http.get(`${this.API}Users/GetUser`, { params: param });
  }

  updatePassword(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/ChangePassword?oldPassword=${encodeURIComponent(data?.oldPassword)}&newPassword=${encodeURIComponent(data?.newPassword)}&UserGuid=${data?.UserGuid}`);
  }

  changePassword(data,slug): Observable<any> {
    return this.http.get(`${this.API}Authentication/UpdatePasswordnewPassword=${data?.newPassword}`, { params: data,
      headers: new HttpHeaders({
        Authorization: `Bearer ${slug}`
      })
    });
  }

  passwordChange(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/UpdatePassword?UserGuid=${data?.UserGuid}&newPassword=${encodeURIComponent(data?.newPassword)}`);
  }

  deleteUser(id): Observable<any> {
    return this.http.delete(`${this.API}Delete?id=${id}`);
  }

  getMasterData(): Observable<any> {
    return this.http.get(`${this.API}/user/master-data`);
  }

  checkLoginIdExists(param = null): Observable<any> {
    return this.http.get(`${this.API}CheckLoginIdExists`, { params: param });
  }

// user adudit
  getUserAudit(data): Observable<any> {
    return this.http.post(`${this.API}SystemLogs/GetAllUserAudit`,data);
  }

  // SystemLogs
  getSystemLogs(data): Observable<any> {
    return this.http.post(`${this.API}SystemLogs/GetAllSystemLogs`,data);
  }
}
