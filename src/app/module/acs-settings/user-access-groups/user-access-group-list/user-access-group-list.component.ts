import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DataService } from 'src/app/service/data.service';
import { IntegrationService } from 'src/app/service/integration.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { UserAccessGroupService } from 'src/app/service/user-access-group.service';
import { environment } from 'src/environments/environment';
import { DoorListPopupComponent } from '../door-list-popup/door-list-popup.component';

@Component({
  selector: 'app-user-access-group-list',
  templateUrl: './user-access-group-list.component.html',
  styleUrls: ['./user-access-group-list.component.scss'],
})
export class UserAccessGroupListComponent implements OnInit {
  loadingState = true;
  userAccessGroupList: Array<any> = [];
  userAccessGroupList2: Array<any> = [];
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

  constructor(
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private userAccessGroupService: UserAccessGroupService,
    private integrationService: IntegrationService,
    private dataService: DataService,
    private router: Router,
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.ACSSettings;
    });
  }

  ngOnInit(): void {
    this.getUserAccessGroupList();
    this.getSNo(this.currentPage)
  }

  getUserAccessGroupList() {
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
    this.userAccessGroupService.getAllUserAccessGroup(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response.data) {
          this.userAccessGroupList = response?.data?.data;
          this.lastpage = response?.data?.totalPages;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
          if(this.userAccessGroupList2?.length==0){
            this.userAccessGroupList2 = response?.data?.data;
          }
        } else {
          this.userAccessGroupList = [];
          this.pagination = null;
        }
      },
      (error) => {
        this.loadingState = false;
        this.userAccessGroupList = [];
        this.pagination = null;
      }
    );
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getUserAccessGroupList();
  }

  deleteUserAccessGroup(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true, deletedData: data?.userAccessGroupName },
      panelClass: 'delete-popup',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.is_delete) {
        this.userAccessGroupService.deleteUserAccessGroup(result?.id).subscribe(
          (res) => {
            if (res.status) {
              this.currentPage = 1;
              this.getUserAccessGroupList();
              this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/acs-settings/access-levels']);
              });
              this.dialog.open(ActionPopupComponent, {
                data: { ...res, isSuccess: true },
              });
            } else {
              // this.dialog.open(ActionPopupComponent, {
              //   data: { ...res, isSuccess: true }
              // });
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
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getUserAccessGroupList();
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
         this.sNo.push({
          sNo:i
     })
    }
  }
  // doorPopUp() {
  //   this.dialog.open(DoorListPopupComponent, {
  //     panelClass: 'asc-server-modal-box',
  //     data : {
  //       testPopUp : 'tabletest',
  //       importdata: this.userAccessGroupList
  //     }
  //   });
  // }


  testAcsServer(): void {
    this.showLoader = true;
    this.integrationService.testAcsServer().subscribe((response) => {
      this.showLoader = false;
      if (response?.status == "Error") {
        const dialogRef = this.dialog.open(DoorListPopupComponent, {
          panelClass: 'asc-server-modal-box',
          data : {
            testPopUp2 : 'server',
            importdata: this.userAccessGroupList2
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getUserAccessGroupList();
        });
      }
      if (response?.status == "Ok") {
        const dialogRef = this.dialog.open(DoorListPopupComponent, {
          panelClass: 'asc-server-modal-box',
          data : {
            testPopUp : 'tabletest',
            importdata: this.userAccessGroupList2
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getUserAccessGroupList();
        });
      }
    }, (error) => {
      // this.toastr.error(error.message);
      this.showLoader = false;
    });
  }


  getImortAccessGroup() {
    this.loadingState = true;
    const params: any = {
      pagenumber: this.currentPage,
      pagesize: this.currentPageLimit
    };
    this.userAccessGroupService.getImortAccessGroup(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response.data) {
          this.userAccessGroup2 = response.data.item_list;
          this.userAccessGroup2.forEach((e,i)=>{
            this.userAccessGroup2[i]['isSelected'] = false
          })
        }
      },
      (error) => {
        this.loadingState = false;
      }
    );
  }
  goBack(){
    this.router.navigateByUrl('/dashboard');
  }

}
