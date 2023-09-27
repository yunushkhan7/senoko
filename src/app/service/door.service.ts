import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoorService {

  API_URL: string = environment.APIEndpoint+ 'api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  saveDoor(data): Observable<any> {
    return this.http.post(`${this.API_URL}Doors/SaveDoors`, data);
  }

  getDoorList(data): Observable<any> {
    return this.http.post(`${this.API_URL}Doors/GetAllDoors`,data);
  }


  GetDoorById(id): Observable<any> {
    return this.http.get(`${this.API_URL}Doors/GetDoorsById?id=${id}`);
  }

  deleteDoor(id): Observable<any> {
    return this.http.get(`${this.API_URL}Doors/DeleteDoor?id=${id}`);
  }

  getImortDoors(params): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/GetReadersList?`+params);
  }

  getReadersList(data): Observable<any> {
    return this.http.get(`${this.API_URL}ACSServer/GetReadersList`, { params: data});
  }
}
