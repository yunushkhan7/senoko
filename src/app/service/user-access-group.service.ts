import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAccessGroupService {

  API_URL: string = environment.APIEndpoint+ 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  getAllUserAccessGroup(param): Observable<any> {
    return this.http.post(`${this.API_URL}UserAccessGroup/GetAllUserAccessGroup`, param);
  }

  saveUserAccessGroup(data): Observable<any> {
    return this.http.post(`${this.API_URL}UserAccessGroup/SaveUserAccessGroup`, data);
  }

  deleteUserAccessGroup(id): Observable<any> {
    return this.http.get(`${this.API_URL}UserAccessGroup/DeleteUserAccessGroup?id=${id}`);
  }

  getUserAccessGroupById(id): Observable<any> {
    return this.http.get(`${this.API_URL}UserAccessGroup/GetUserAccessGroupById?id=${id}`);
  }
  getImportDoors(data): Observable<any> {
    return this.http.get(`${this.API_URL}Doors/ImportDoors?id=${data?.id}&DoorDirection=${data}`);
  }

  getImortAccessGroup(data): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/GetAccessLevels`, {params: data});
  }


  getAllbadgeGroup(param): Observable<any> {
    return this.http.post(`${this.API_URL}ACSServer/GetAllBadgeGroup`, param);
  }

  getImortBadgeGroup(data): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/GetBadgeGroups`, {params: data});
  }

  saveBadgeGroup(data): Observable<any> {
    return this.http.post(`${this.API_URL}ACSServer/SaveBadgeGroup`, data);
  }

  deleteBadgeGroups(id): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/DeleteBadgeGroups?id=${id}`);
  }

  getAllCardHolder(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetCardHolders`, data);
  }

  syncCardholders(): Observable<any> {
    return this.http.get(`${this.API_URL}Registration/SyncCardholders`);
  }
  
}
