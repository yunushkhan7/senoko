import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { AcsServerService } from 'src/app/service/acs-server.service';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { RollCallGroupPopupComponent } from '../roll-call-group-popup/roll-call-group-popup.component';

@Component({
  selector: 'app-roll-call-group-list',
  templateUrl: './roll-call-group-list.component.html',
  styleUrls: ['./roll-call-group-list.component.scss']
})
export class RollCallGroupListComponent implements OnInit {

  loadingState = true;
  rollCallGroupList: Array<any> = [];
  userAccessGroup2: Array<any> = [];
  pagination: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  currentUser: any;
  lastpage: any;
  showLoader = false;
  isShort: any = false;
  sortFieldName: any;
  sNo=[];
  startCounting=1
  rollCallGroupList2: Array<any> = [];
  constructor(public dialog: MatDialog,
    private router: Router,
    private acsServerService: AcsServerService,
    private paginationService: PaginationService,
    private dataService: DataService
    ) {
      this.dataService.permission.subscribe((response) => {
        this.permissionObject = response?.permissions?.ACSSettings;
      });
     }

  ngOnInit(): void {
    this.getAllRollCall();
    this.getSNo(this.currentPage)
  }

  openDialog(): void {
    this.dialog.open(RollCallGroupPopupComponent, {
      width: '500px',
    });
  }

  getAllRollCall() {
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
    if (this.sortFieldName) {
      params.sortElement = {
        "propertyName": this.sortFieldName,
        "sortOrder": this.isShort ? 1 : -1
      }
    }
    this.acsServerService.getAllRollCall(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response.data) {
          this.rollCallGroupList = response?.data?.data;
          this.lastpage = response?.data?.totalPages;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
          if(this.rollCallGroupList2?.length==0){
            this.rollCallGroupList2 = response?.data?.data;
          }
        } else {
          this.rollCallGroupList = [];
          this.pagination = null;
        }
      },
      (error) => {
        this.loadingState = false;
        this.rollCallGroupList = [];
        this.pagination = null;
      }
    );
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getAllRollCall();
  }

  deleteRollCallGroups(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true, deletedData: data?.userAccessGroupName },
      panelClass: 'delete-popup',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.is_delete) {
        this.acsServerService.deleteRollCallGroups(result?.id).subscribe(
          (res) => {
            if (res?.status=='Ok') {
              this.currentPage = 1;
              this.getAllRollCall();
              this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/acs-settings/roll-call-group']);
              });
              this.dialog.open(ActionPopupComponent, {
                data: { ...res, isSuccess: true },
              });
            } else {
            }
          },
          (err) => {
            this.dialog.open(ActionPopupComponent, {
              data: { ...err.error, isSuccess: true },
            });
          }
        );
      }
    });
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getAllRollCall();
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
         this.sNo.push({
          sNo:i
     })
    }
  }


  getRollCallGroups(): void {
    this.showLoader = true;
    const params: any = {
      pagenumber: this.currentPage,
      pagesize: this.currentPageLimit
    };
    this.acsServerService.getRollCallGroups(params).subscribe((response) => {
      this.showLoader = false;
      if (response?.status == "Error") {
        const dialogRef = this.dialog.open(RollCallGroupPopupComponent, {
          panelClass: 'asc-server-modal-box',
          data : {
            testPopUp2 : 'server',
            importdata: this.rollCallGroupList2
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getAllRollCall();
        });
      }
      if (response?.status == "Ok") {
        const dialogRef = this.dialog.open(RollCallGroupPopupComponent, {
          panelClass: 'asc-server-modal-box',
          data : {
            testPopUp : 'rollcallgrouptest',
            importdata: this.rollCallGroupList2
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getAllRollCall();
        });
      }
    }, (error) => {
      // this.toastr.error(error.message);
      this.showLoader = false;
    });
  }


  goBack(){
    this.router.navigateByUrl('/dashboard');
  }

}
