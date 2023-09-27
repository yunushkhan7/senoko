import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { RoleService } from 'src/app/service/role.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  filterColumns: string[] = ['RoleName', 'Description'];
  loadingState = true;
  objectArray: Array<any> = [];
  pagination: any = null;
  searchText: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  searchFilter: any = {filters:[]};
  currentUser: any;
  isShort: any = false;
  sortFieldName: any;

  constructor(
    private paginationService: PaginationService,
    private roleService: RoleService,
    public dialog: MatDialog,
    private dataService: DataService
  ) {
    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions.Role;
    });
  }

  ngOnInit() {
    this.getObjects();
  }

  getObjects() {
    const params: any = {
      fields: null,
      page: this.currentPage,
      pageSize: this.currentPageLimit
    };

    if (this.sortFieldName) {
      params.sortElement = {
        "propertyName": this.sortFieldName,
        "sortOrder": this.isShort ? 1 : -1
      }
    }
    // if (this.searchText) {
      params.searchFilter = this.searchFilter;
    // }
    this.roleService.getRoleList(params).subscribe((response) => {
      this.loadingState = false;
      if (response.data) {
        this.objectArray = response.data;
        this.showPagination = true;
        this.pagination = this.paginationService.getPager(response['recordCount'], this.currentPage, this.currentPageLimit);
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
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getObjects();
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
        "caseSensitive": true,
        "operator": 5,
      })
    }
    this.searchFilter = { "conditionOperator": 1, filters: filters };
    this.getObjects();
  }

  sortData(name) {
    // Frontend Short
    // this.commonService.isShort = !this.commonService.isShort
    // this.objectArray = this.commonService.sortData(name, this.objectArray);

    // Backend Short
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getObjects();
  }

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '600px',
      height: '400px',
      data: { ...data, name: data.roleName, isDelete: true },
      panelClass: 'delete-popup'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
        this.roleService.deleteRole(result.id).subscribe((res) => {
          if (res.status == "Ok") {
            this.getObjects();
            this.dialog.open(ActionPopupComponent, {
              data: { ...res, isSuccess: true }
            });
          }
          else {
            this.dialog.open(ActionPopupComponent, {
              data: { ...res, isSuccess: true }
            });
          }
        }, (err) => {
          this.dialog.open(ActionPopupComponent, {
            data: { ...err.error, isSuccess: true }
          });
        })
      }
    });
  }

  ngOnDestroy(): void { }
}
