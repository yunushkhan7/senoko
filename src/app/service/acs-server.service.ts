import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcsServerService {

  API_URL: string = environment.APIEndpoint+ 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  saveAcsServer(data): Observable<any> {
    return this.http.post(`${this.API_URL}ACSServer/SaveACSServer`, data);
  }

  getAcsServer(): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/GetACSServer`);
  }

  testAcsServer(): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/ACSServerLogin`);
  }

  getAllEmployeeDivision(param): Observable<any> {
    return this.http.post(`${this.API_URL}ACSServer/GetAllEmployeeDivision`, param);
  }

  getEmployeesDivisions(data): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/GetEmployeesDivisions`, {params: data});
  }
  
  saveEmployeesDivisions(data): Observable<any> {
    return this.http.post(`${this.API_URL}ACSServer/SaveEmployeesDivisions`, data);
  }

  deleteEmployeesDivision(id): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/DeleteEmployeesDivision?id=${id}`);
  }


  getAllBCP(param): Observable<any> {
    return this.http.post(`${this.API_URL}ACSServer/GetAllBCP`, param);
  }

  getBCPList(data): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/GetBCPList`, {params: data});
  }
  
  saveBCPList(data): Observable<any> {
    return this.http.post(`${this.API_URL}ACSServer/SaveBCPList`, data);
  }

  deleteBcpGroup(id): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/DeleteBCP?id=${id}`);
  }

  getAllRollCall(param): Observable<any> {
    return this.http.post(`${this.API_URL}ACSServer/GetAllRollCall`, param);
  }

  getRollCallGroups(data): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/GetRollCallGroups`, {params: data});
  }
  
  saveRollCall(data): Observable<any> {
    return this.http.post(`${this.API_URL}ACSServer/SaveRollCall`, data);
  }

  deleteRollCallGroups(id): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/DeleteRollCallGroups?id=${id}`);
  }

  saveBadgeGroupMapping(data): Observable<any> {
    return this.http.post(`${this.API_URL}ACSServer/SaveBadgeGroupMapping`, data);
  }

  getVMSBadgeGroup(data): Observable<any> {
    return this.http.get(`${this.API_URL}Registration/GetVMSBadgeGroup`, data);
  }

}
