import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getToken(): string {
    return window.sessionStorage['_auth_webcheckinA'];
  }

  saveToken(token: string) {
    window.sessionStorage['_auth_webcheckinA'] = token;
  }

  destroyToken() {
    window.sessionStorage.removeItem('_auth_webcheckinA');
  }

  getCompanyId(): string {
    return window.sessionStorage['__webcheckinA__cmp'];
  }

  saveCompanyId(id: any) {
    window.sessionStorage['__webcheckinA__cmp'] = id;
  }

  destroyCompanyId() {
    window.sessionStorage.removeItem('__webcheckinA__cmp');
  }

  getCompanyName(): string {
    return window.sessionStorage['__webcheckinA__cmp_nm'];
  }

  saveCompanyName(name: any) {
    window.sessionStorage['__webcheckinA__cmp_nm'] = name;
  }

  destroyCompanyName() {
    window.sessionStorage.removeItem('__webcheckinA__cmp_nm');
  }

  saveValue(name, value) {
    window.sessionStorage[name] = value;
  }

  destroyValue(name) {
    window.sessionStorage.removeItem(name);
  }

  getValue(name): string {
    return window.sessionStorage[name]; // window.localStorage['google_token'];
  }

  // refreshToken
  getRefreshToken(): string {
    return window.sessionStorage['refreshToken'];
  }

  saveRefreshToken(token: string) {
    window.sessionStorage['refreshToken'] = token;
  }

  destroyRefreshToken() {
    window.sessionStorage.removeItem('refreshToken');
  }
}
