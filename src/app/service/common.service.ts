import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { decryptValue } from '../shared/common';
import { JwtService } from './jwt.service';
import { fromEvent, Subject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isShort: boolean;
  API_URL: string = environment.APIEndpoint+ 'api/v1/';
  API_URL2: string = environment.APIEndpoint+ 'api/';
  constructor(
    private http: HttpClient,
    private jwt: JwtService
  ) { 
      // Setup events
  fromEvent(document, 'mousemove').subscribe(() => this.onInteraction("mousemove"));
  fromEvent(document, 'touchstart').subscribe(() => this.onInteraction("touchstart"));
  fromEvent(document, 'keydown').subscribe(() => this.onInteraction("keydown"));
  }

  fileUpload(file) {
    return this.http.post(`${this.API_URL}FileUpload/Upload`, file).toPromise();
  }
  GetCurrentUserProfile(): Observable<any> {
    return this.http.get(`${this.API_URL}Users/GetCurrentUserProfile`);
  }
  ReAuthenticate(data): Observable<any> {
    return this.http.post(`${this.API_URL}Authenticate/RewebAuthenticate`, data);
  }
  ReAuthenticate2(data): Observable<any> {
    return this.http.post(`${this.API_URL2}Client/ReAuthenticate`, data);
  }
  refreshToken(): Observable<any> {
    return this.http.post(`${this.API_URL}v1/Authentication/RefreshToken`, { 'refreshToken': decryptValue(this.jwt.getRefreshToken()) }, { withCredentials: true });
  }

  logout(token): Observable<any> {
    return this.http.post(`${this.API_URL}v1/Authentication/RevokeToken`, { 'refreshToken': token });
  }

  sortData(filedName: any = '', ArrayList: any = []) {
    const data = ArrayList.slice();
    ArrayList = data.sort((a, b) => {
      return (a[filedName] < b[filedName] ? -1 : 1) * (this.isShort ? 1 : -1);
    });
    return ArrayList;
  }

  nameValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (control.value && nameRegexp.test(control.value)) {
       return { invalidName: true };
    }
}


public idle$: Subject<boolean> = new Subject();
public wake$: Subject<boolean> = new Subject();

isIdle = false;
private idleAfterSeconds =600;
private countDown;


onInteraction(a) {
  // Is idle and interacting, emit Wake
  if (this.isIdle) {
    this.isIdle = false;
    this.wake$.next(true);
  }

  // User interaction, reset start-idle-timer
  clearTimeout(this.countDown);
  this.countDown = setTimeout(() => {
    // Countdown done without interaction - emit Idle
    this.isIdle = true;
    this.idle$.next(true);
  }, this.idleAfterSeconds * 1_000)
}
}
