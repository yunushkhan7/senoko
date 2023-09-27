import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { AcsServerService } from 'src/app/service/acs-server.service';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { BcpGroupPopupComponent } from '../bcp-group-popup/bcp-group-popup.component';

@Component({
  selector: 'app-bcp-group-list',
  templateUrl: './bcp-group-list.component.html',
  styleUrls: ['./bcp-group-list.component.scss']
})
export class BcpGroupListComponent implements OnInit {

  loadingState = true;
  bcpList: Array<any> = [];
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
  bcpGroupList: Array<any> = [];
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
    this.getAllBCP();
    this.getSNo(this.currentPage)
  }

  openDialog(): void {
    this.dialog.open(BcpGroupPopupComponent, {
      width: '500px',
    });
  }
  getAllBCP() {
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
    this.acsServerService.getAllBCP(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response.data) {
          this.bcpList = response?.data?.dataObject;
          this.lastpage = response?.data?.totalPages;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
          if(this.bcpGroupList?.length==0){
            this.bcpGroupList = response?.data?.dataObject;
          }
        } else {
          this.bcpList = [];
          this.pagination = null;
        }
      },
      (error) => {
        this.loadingState = false;
        this.bcpList = [];
        this.pagination = null;
      }
    );
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getAllBCP();
  }

  deleteBcpGroup(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true, deletedData: data?.userAccessGroupName },
      panelClass: 'delete-popup',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.is_delete) {
        this.acsServerService.deleteBcpGroup(result?.id).subscribe(
          (res) => {
            if (res?.status=='Ok') {
              this.currentPage = 1;
              this.getAllBCP();
              this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/acs-settings/bcp-group']);
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
    this.getAllBCP();
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
         this.sNo.push({
          sNo:i
     })
    }
  }

  getBCPList(): void {
    this.showLoader = true;
    const params: any = {
      pagenumber: this.currentPage,
      pagesize: this.currentPageLimit
    };
    this.acsServerService.getBCPList(params).subscribe((response) => {
      this.showLoader = false;
      if (response?.status == "Error") {
        const dialogRef = this.dialog.open(BcpGroupPopupComponent, {
          panelClass: 'asc-server-modal-box',
          data : {
            testPopUp2 : 'server',
            importdata: this.bcpGroupList
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getAllBCP();
        });
      }
      if (response?.status == "Ok") {
        const dialogRef = this.dialog.open(BcpGroupPopupComponent, {
          panelClass: 'asc-server-modal-box',
          data : {
            testPopUp : 'bcptest',
            importdata: this.bcpGroupList
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getAllBCP();
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
