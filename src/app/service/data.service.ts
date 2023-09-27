import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, BehaviorSubject, Subject } from 'rxjs';
import { JwtService } from './jwt.service';
import { encryptValue } from '../shared/common';
import { CommonService } from './common.service';
import { HotelService } from './hotel.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public mobile = new Subject<any>();
  
  // for storing current user details
  public currentUserSubject = new BehaviorSubject(null);
  public currentUser = this.currentUserSubject.asObservable()

  public getMobileNoSubject = new BehaviorSubject(null);
  public userMobile = this.getMobileNoSubject.asObservable()

  public getloginFormSubject = new BehaviorSubject(null);
  public userResponce = this.getloginFormSubject.asObservable()


  public getloginreauthenticateSubject = new BehaviorSubject(null);
  public reauthentiacteResponce = this.getloginreauthenticateSubject.asObservable()

  public getForgotFormSubject = new BehaviorSubject(null);
  public userForgotForm = this.getForgotFormSubject.asObservable()

  // for checking user is authneticated or not
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  // for storing common lists details
  private commonListSubject = new BehaviorSubject(null);
  public commonList = this.commonListSubject.asObservable()

  // for storing current user permission details
  public userPermissionSubject = new BehaviorSubject(null);
  public permission = this.userPermissionSubject.asObservable()

  //for storing current hotel details
  public currentHotelSubject = new BehaviorSubject(null);
  public curentHotel = this.currentHotelSubject.asObservable()

  public forgatAuthSubject = new BehaviorSubject(null);
  public forgatAuth = this.forgatAuthSubject.asObservable()

  authUser: any;
  refreshTokenTimeout: any;

  constructor(
    private jwtService: JwtService,
    private hotelService: HotelService,
    private commonService: CommonService
  ) { }

  saveToken(token) {
    this.jwtService.saveToken(encryptValue(token));
  }
  saveRefreshToken(token) {
    this.jwtService.saveRefreshToken(encryptValue(token));
  }

  saveCommonList(data) {
    this.commonListSubject.next(data);
  }

  setAuth(data) {
    this.saveToken(data['jwtToken']);
    // this.saveRefreshToken(data['refreshToken']);
    this.authUser = data;
    this.updateAuth({ ...data?.user });
    this.updatePermission(data?.permissions);
    // this.startRefreshTokenTimer();
  }

  setreAuth(data) {
    this.saveToken(data?.jwtToken);

  }


  updateAuth(data) {
    this.currentUserSubject.next(data);
    this.isAuthenticatedSubject.next(true);
  }

  updatePermission(data) {
    let permissionModify = data;
    let permissionObject: any = {};
    permissionModify?.forEach((e) => {
      let body: any = {}
      e.operation?.forEach((permission: any) => {
        body[String(permission).toLowerCase().trim().replace(/\s/g, "")] = true;
      });
      permissionObject[(e?.moduleName).replace(/\s/g, "")] = body;
    });
    this.userPermissionSubject.next({ permissions: permissionObject });
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.jwtService.destroyRefreshToken();
    // this.stopRefreshTokenTimer();
    // Set auth status to false
    this.authUser = null;
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.userPermissionSubject.next([]);
  }

  // startRefreshTokenTimer() {
  //   if (this.authUser && this.authUser.jwtToken) {
  //     const jwtToken = JSON.parse(atob(this.authUser.jwtToken.split('.')[1]));
  //     const expires = new Date(jwtToken.exp * 1000);
  //     const timeout = expires.getTime() - Date.now() - (60 * 1000);
  //     this.test(timeout);
  //     this.refreshTokenTimeout = setTimeout(() => this.commonService.refreshToken().subscribe(), timeout);

  //   }
  // }
  // test(timeout) {
  //   let ms = timeout,
  //     min = Math.floor((ms / 1000 / 60) << 0),
  //     sec = Math.floor((ms / 1000) % 60);
  // }
  // stopRefreshTokenTimer() {
  //   clearTimeout(this.refreshTokenTimeout);
  // }
}
