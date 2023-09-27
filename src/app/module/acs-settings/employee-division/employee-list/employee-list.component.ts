import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { AcsServerService } from 'src/app/service/acs-server.service';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { EmployeePopupComponent } from '../employee-popup/employee-popup.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  loadingState = true;
  employeeDivisionList: Array<any> = [];
  employeeDivisionList2: Array<any> = [];
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
    this.getAllEmployeeDivision();
    this.getSNo(this.currentPage)
  }

  openDialog(): void {
    this.dialog.open(EmployeePopupComponent, {
      width: '500px',
    });
  }

  getAllEmployeeDivision() {
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
    this.acsServerService.getAllEmployeeDivision(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response.data) {
          this.employeeDivisionList = response.data?.data;
          this.lastpage = response?.data?.totalPages;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
          if(this.employeeDivisionList2?.length==0){
            this.employeeDivisionList2 = response?.data?.data;
          }
        } else {
          this.employeeDivisionList = [];
          this.pagination = null;
        }
      },
      (error) => {
        this.loadingState = false;
        this.employeeDivisionList = [];
        this.pagination = null;
      }
    );
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getAllEmployeeDivision();
  }

  deleteEmployeeDivision(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true, deletedData: data?.userAccessGroupName },
      panelClass: 'delete-popup',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.is_delete) {
        this.acsServerService.deleteEmployeesDivision(result?.id).subscribe(
          (res) => {
            if (res?.status=='Ok') {
              this.currentPage = 1;
              this.getAllEmployeeDivision();
              this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/acs-settings/employee-divisions']);
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
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getAllEmployeeDivision();
  }

  getImportEmployeesDivisions(): void {
    this.showLoader = true;
    const params: any = {
      pagenumber: this.currentPage,
      pagesize: this.currentPageLimit
    };
    this.acsServerService.getEmployeesDivisions(params).subscribe((response) => {
      this.showLoader = false;
      if (response?.status == "Error") {
        const dialogRef = this.dialog.open(EmployeePopupComponent, {
          panelClass: 'asc-server-modal-box',
          data : {
            testPopUp2 : 'server',
            importdata: this.employeeDivisionList2
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getAllEmployeeDivision();
        });
      }
      if (response?.status == "Ok") {
        const dialogRef = this.dialog.open(EmployeePopupComponent, {
          panelClass: 'asc-server-modal-box',
          data : {
            testPopUp : 'employeetest',
            importdata: this.employeeDivisionList2
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getAllEmployeeDivision();
        });
      }
    }, (error) => {
      // this.toastr.error(error.message);
      this.showLoader = false;
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
