import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginationService } from 'src/app/service/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { VmsStationService } from 'src/app/service/vms-station.service';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vms-station-list',
  templateUrl: './vms-station-list.component.html',
  styleUrls: ['./vms-station-list.component.scss']
})
export class VmsStationListComponent implements OnInit {

  filterColumns: string[] = ['firstName', 'lastName', 'email', 'username'];
  loadingState = true;
  objectArray: Array<any> = [];
  pagination: any = null;
  searchText: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  userList:any=[]
  searchFilter: any = {};
  currentUser: any;
  isShort: any = false;
  sortFieldName: any;
  filters:any;
  sNo=[];
  startCounting=1
  lastpage: any;
  filter2:any = []

  constructor(
    private paginationService: PaginationService,
    private stationService: VmsStationService,
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.VMSStation;
    });
   }

  ngOnInit() {
    this.getStationList();
    this.getSNo(this.currentPage)
  }

  getStationList() {
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
      searchFilter : { andFilters: this.filter2}
    };
    this.filter2.push({
      "propertyName": "RoleName",
      "operator": 0,
      "value": "Work Station",
      "dataType": "string",
      "caseSensitive": true
    })
    if (this.searchText) {
      params.searchFilter = this.searchFilter;
    }
    if (this.sortFieldName) {
      params.sortElement = {
        "propertyName": this.sortFieldName,
        "sortOrder": this.isShort ? 1 : -1
      }
    }
    this.filter2 = []
    this.stationService.getStationList(params).subscribe((response) => {
      this.loadingState = false;
      if (response.data) {
        this.objectArray = response?.data?.data;
        this.lastpage = response?.data?.totalPages
        this.objectArray.forEach((element, i) => {
          this.objectArray[i]['sNo']=this.sNo[i].sNo
        });
        this.userList=response?.data?.docs
        this.showPagination = true;
       // this.pagination = this.paginationService.getPager(response['recordCount'], this.currentPage, this.currentPageLimit);

       this.pagination = this.paginationService.getPager(
        response.data['totalDocs'],
        this.currentPage,
        this.currentPageLimit
      );
      } else {
        this.objectArray = [];
        this.pagination = null;
      }
    }, (error) => {
      this.loadingState = false;
      this.objectArray = [];
      this.pagination = null;
    });
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getStationList();
  }

  searchObject(text) {
    this.searchText = text;
    this.currentPage = 1;

    this.filters={
      "firstName": this.searchText,
      "username": this.searchText,
      "lastName" : this.searchText,
      "email" : this.searchText
    }

    this.searchFilter =  this.filters;
    this.getStationList();
  }
  searchData(){

  }
  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getStationList();
  }

  deleteStation(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true,deletedData:data?.userName},
      panelClass: 'delete-popup'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
        this.stationService.deleteStation(result?.id).subscribe((res) => {
          if (res?.status=='Ok') {
            this.currentPage = 1;
            this.currentPageLimit = environment.defaultPageLimit;
            this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
            this.getSNo(this.currentPage)
            this.getStationList();
            this.dialog.open(ActionPopupComponent, {
              data: { ...res, isSuccess: true }
            });
          }
          else {
            // this.dialog.open(ActionPopupComponent, {
            //   data: { ...res, isSuccess: true }
            // });
          }
        }, (err) => {
          this.dialog.open(ActionPopupComponent, {
            data: { ...err.error, isSuccess: true }
          });
        })
      }
    });
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
         this.sNo.push({
          sNo:i
     })
    }
  }

  goBack(){
    this.router.navigateByUrl('/dashboard');
  }
}
