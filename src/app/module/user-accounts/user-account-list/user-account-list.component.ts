import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginationService } from 'src/app/service/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { UseraccountService } from 'src/app/service/useraccount.service';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { ReportService } from 'src/app/service/report.service';
@Component({
  selector: 'app-user-account-list',
  templateUrl: './user-account-list.component.html',
  styleUrls: ['./user-account-list.component.scss']
})
export class UserAccountListComponent implements OnInit {
  filterColumns: string[] = ['userName', 'roleName','mobileNo', 'email','lastLoginOn'];
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
  filter:any = []
  minDate: Date;
  selectedDate :any;
  constructor(
    private paginationService: PaginationService,
    private useraccountService: UseraccountService,
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private reportService: ReportService
  ) { 
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.UserAccounts;
    });
  }

  ngOnInit() {
    this.dataService.currentUser.subscribe((responce) => {
      if (responce){
        this.currentUser = responce;
        this.getUserAccount();
      }
    });
    
    this.getSNo(this.currentPage)
    this.filters = [];
    this.filter = [];
  }
  
  goBack(){
    this.router.navigateByUrl('/dashboard');
  }

  getUserAccount() {
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
      searchFilter : { andFilters: this.filter2}
    };
    let userId = this.currentUser?.id
    this.filter2.push({
      "propertyName": "Id",
      "operator": 8,
      "value": userId?.toString(),
      "dataType": "string",
      "caseSensitive": true
    })
    this.filter2.push({
      "propertyName": "RoleName",
      "operator": 8,
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
    this.useraccountService.getUserAccountList(params).subscribe((response) => {
      this.loadingState = false;
      if (response.data) {
        this.objectArray = response?.data?.data;
        this.lastpage = response?.data?.totalPages
        this.objectArray.forEach((element, i) => {
          this.objectArray[i]['sNo']=this.sNo[i].sNo
        });
        this.userList=response?.data?.docs
        this.showPagination = true;
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
    this.getUserAccount()
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
         this.sNo.push({
          sNo:i
     })
    }
  }
  text = '';
  searchObject(text) {
    this.searchText = text;
    // this.currentPage = 1;
    this.filters = [];
    for (let index = 0; index < this.filterColumns.length; index++) {
      const element = this.filterColumns[index];
      // if(element != "lastLoginOn"){
      //   this.filters.push({
      //     "propertyName": element,
      //     "value": this.searchText,
      //     "dataType": "string",
      //     "operator": 0,
      //     "caseSensitive": true
      //   })
      // }
      // this.filters.push({
      //   "propertyName": element,
      //   "value": this.searchText,
      //   "dataType": "string",
      //   "operator": 5,
      //   "caseSensitive": true
      // })
      if (element == "userName" && this.text) {
        this.searchText = this.text
        this.filters?.push({
          propertyName: 'userName',
          value: this.searchText,
          dataType:  "string",
          operator: 0,
          caseSensitive: true,
        });
      }
      if (element == "roleName" && this.text) {
        this.searchText = this.text
        this.filters?.push({
          propertyName: 'roleName',
          value: this.searchText,
          dataType:  "string",
          operator: 0,
          caseSensitive: true,
        });
      }
      if (element == "mobileNo" && this.text) {
        this.searchText = this.text
        this.filters?.push({
          propertyName: 'mobileNo',
          value: this.searchText,
          dataType:  "string",
          operator: 0,
          caseSensitive: true,
        });
      }
      if (element == "email" && this.text) {
        this.searchText = this.text
        this.filters?.push({
          propertyName: 'email',
          value: this.searchText,
          dataType:  "string",
          operator: 0,
          caseSensitive: true,
        });
      }
      if (element == "lastLoginOn" && this.selectedDate) {
        this.searchText = this.selectedDate
        this.filters?.push({
          propertyName: 'lastLoginOn',
          value: this.reportService?.DateFormatter?.formatDate(this.selectedDate, 'YYYY-MM-DD HH:mm'),
          dataType: 'datetime',
          operator: 0,
          caseSensitive: true,
        });
      }
    }
    this.filter = [];
    this.filter?.push({
      "propertyName": "string",
      "value": "string",
      "dataType": "string",
      "operator": 5,
      "caseSensitive": true
    })
    this.searchFilter = { andFilters: this.filter , orFilters:this.filters};
    this.currentPage = 1;
    this.currentPageLimit = environment.defaultPageLimit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getUserAccount();
  }
  eDateChangedStart(res: any) {
    this.minDate = res.value;
    // let date = this.datepipe.transform(res.value,'mm/dd/yyyy hh:mm:ss')
  }
  clearForm(){
    // this.searchText.reset()
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/user-account']);
    });
    this.getUserAccount();
  }
  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getUserAccount();
  }

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true,deletedData:data?.userName},
      panelClass: 'delete-popup'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
        this.useraccountService.deleteUserAccount(result?.id).subscribe((res) => {
          if (res.status=='Ok') {
            this.getUserAccount();
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

}
