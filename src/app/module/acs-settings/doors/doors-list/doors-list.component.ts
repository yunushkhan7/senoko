import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DoorsAddComponent } from '../doors-add/doors-add.component';
import { ImportDoorsPopupComponent } from '../import-doors-popup/import-doors-popup.component';
import { environment } from 'src/environments/environment';
import { PaginationService } from 'src/app/service/pagination.service';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DoorService } from 'src/app/service/door.service';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { IntegrationService } from 'src/app/service/integration.service';
import { DoorListPopupComponent } from '../../user-access-groups/door-list-popup/door-list-popup.component';


@Component({
  selector: 'app-doors-list',
  templateUrl: './doors-list.component.html',
  styleUrls: ['./doors-list.component.scss']
})
export class DoorsListComponent implements OnInit {

  filterColumns: string[] = ['doorName'];
  loadingState = true;
  objectArray: Array<any> = [];
  objectArray2: Array<any> = [];
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
  lastpage: any;
  sNo=[];
  startCounting=1
  showLoader = false;

  constructor(
    private paginationService: PaginationService,
    private doorService: DoorService,
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private integrationService: IntegrationService,
  ) { 
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.ACSSettings;
    });
  }

  ngOnInit(): void {
    this.getSNo(this.currentPage)
    this.getDoorList();
  }

  doorlistpopup() {
    const dialogRef = this.dialog.open(ImportDoorsPopupComponent,{
      data : {
        importDoordata: this.objectArray
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDoorList();
    });
  }


  testAcsServer(): void {
    this.showLoader = true;
    this.integrationService.testAcsServer().subscribe((response) => {
      this.showLoader = false;
      if (response?.status == "Error") {
        const dialogRef = this.dialog.open(ImportDoorsPopupComponent, {
          panelClass: 'asc-server-modal-box',
          data : {
            testPopUp2 : 'server',
            importDoordata: this.objectArray2
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getDoorList();
        });
      }
      if (response?.status == "Ok") {
        const dialogRef = this.dialog.open(ImportDoorsPopupComponent, {
          panelClass: 'asc-server-modal-box',
          data : {
            testPopUp : 'tabletest',
            importDoordata: this.objectArray2
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getDoorList();
        });
      }
    }, (error) => {
      // this.toastr.error(error.message);
      this.showLoader = false;
    });
  }

  dooraddpopup() {
    this.dialog.open(DoorsAddComponent,{
    });
  }


  getDoorList() {
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
      searchFilter: {
        andFilters: [{
        "propertyName": "IsActive",
        "operator": 0,
        "value": 'True',
        "dataType": "Boolean",
        "caseSensitive": true
        }]
      }
    };
    if (this.searchText) {
      params.searchFilter = this.searchFilter;
    }
    if (this.sortFieldName) {
      params.sortElement = {
        "propertyName": this.sortFieldName,
        "sortOrder": this.isShort ? 1 : -1
      }
    }
    this.doorService.getDoorList(params).subscribe((response) => {
      this.loadingState = false;
      if (response.data) {
        this.objectArray = response?.data?.data;
        this.lastpage = response?.data?.totalPages;
        this.userList=response?.data?.docs
        this.showPagination = true;
       // this.pagination = this.paginationService.getPager(response['recordCount'], this.currentPage, this.currentPageLimit);

       this.pagination = this.paginationService.getPager(
        response.data['totalDocs'],
        this.currentPage,
        this.currentPageLimit
      );
      if(this.objectArray2?.length==0){
        this.objectArray2 = response?.data?.data;
      }
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

  searchObject(text) {
    this.searchText = text;
    this.currentPage = 1;
    let filters = [];
    for (let index = 0; index < this.filterColumns.length; index++) {
      const element = this.filterColumns[index];
      filters.push({
        "propertyName": element,
        "value": this.searchText,
        "dataType": "string",
        "operator": 0,
        "caseSensitive": true
      })
    }
    let filter = [];
    filter.push({
      "propertyName": "string",
      "value": "string",
      "dataType": "string",
      "operator": 0,
      "caseSensitive": true
    })
    this.searchFilter = { andFilters: filters , orFilters:filter};
    this.getDoorList();
  }



  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getDoorList()
  }
  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
      this.sNo.push({
        sNo:i
      })
    }
  }
  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getDoorList();
  }

  deleteDoor(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true ,deletedData:data?.doorName},
      panelClass: 'delete-popup'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
        this.doorService.deleteDoor(result?.id).subscribe((res) => {
          if (res.status) {
            this.currentPage = 1;
            this.getDoorList();
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/acs-settings/doors-list']);
            });
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

  goBack(){
    this.router.navigateByUrl('/dashboard');
  }

}
