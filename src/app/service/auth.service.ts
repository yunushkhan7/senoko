import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {

  API: string = environment.APIEndpoint + 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }


  login(data): Observable<any> {
    return this.http.post(`${this.API}Authenticate/Authenticate`, data);
  }

  login_Otp(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/CheckOTP?UserGuid=${data?.UserGuid}&otp=${data?.otp}`);
  }
  forgot_Otp(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/CheckOTPForgotpassword?UserGuid=${data?.UserGuid}&otp=${data?.otp}`);
  }
  
  forgotPassword(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/ForgotPassword?UserName=${data?.UserName}&MobileNo=${encodeURIComponent(data?.MobileNo)}`);
  }

  changePassword(data,slug): Observable<any> {
    return this.http.get(`${this.API}Authenticate/ChangePassword`, { params: data,
      headers: new HttpHeaders({
        Authorization: `Bearer ${slug}`
      })
    });
  }
  updatePassword(data): Observable<any> {
    return this.http.get(`${this.API}Authenticate/ChangePassword?oldPassword=${data?.oldPassword}&newPassword=${data?.newPassword}`);
  }

}
