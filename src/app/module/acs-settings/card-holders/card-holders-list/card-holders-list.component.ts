import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { IntegrationService } from 'src/app/service/integration.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { UserAccessGroupService } from 'src/app/service/user-access-group.service';
import { environment } from 'src/environments/environment';
import { CardHoldersPopupComponent } from '../card-holders-popup/card-holders-popup.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-card-holders-list',
  templateUrl: './card-holders-list.component.html',
  styleUrls: ['./card-holders-list.component.scss']
})
export class CardHoldersListComponent implements OnInit {

  loadingState = true;
  cardList: Array<any> = [];
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
  filterForm: FormGroup;
  sNo=[];
  startCounting=1
  searchFilter: any = {};
  filters: any = [];
  filter: any = [];
  searchText: any = null;
  @ViewChild('select') select: MatSelect;
  allSelected = false;
  listType: any[] = [
    { value: 'Visitor', viewValue: 'Visitor' },
    { value: 'Contractor', viewValue: 'Contractor' },
    { value: 'Employee', viewValue: 'Employee' },
  ];
  syncCardList:any;
  constructor(
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private integrationService: IntegrationService,
    private userAccessGroupService: UserAccessGroupService,
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private spinner: NgxSpinnerService
  ) { 
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.ACSSettings;
    });
    this.filterForm = this.fb.group({
      lastname: [""],
      firstName: [""],
      badge: [""],
      groupName:[""]
    });
  }

  ngOnInit(): void {
    this.getCardHolders();
    this.getSNo(this.currentPage)
  }

  getCardHolders() {
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
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
    this.userAccessGroupService.getAllCardHolder(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response.data) {
          this.cardList = response?.data?.dataObject;
          this.lastpage = response?.data?.totalPages;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
        } if(response?.status=="Error") {
            const dialogRef = this.dialog.open(CardHoldersPopupComponent, {
              panelClass: 'asc-server-modal-box',
              data : {
                testPopUp2 : 'server'
              }
            });
        }
      },
      (error) => {
        this.loadingState = false;
        this.cardList = [];
        this.pagination = null;
      }
    );
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getCardHolders();
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getCardHolders();
  }

  openDialog(): void {
    this.dialog.open(CardHoldersPopupComponent, {
      width: '500px',
    });
  }

  goBack(){
    this.router.navigateByUrl('/dashboard');
  }
  isLoading = false;
  syncCardholders(){
    this.userAccessGroupService.syncCardholders().subscribe(
      (response) => {
        this.showLoader = false;
        if (response) {
          this.syncCardList=response?.data;
          // this.spinner.hide();
        }
        setTimeout( () => this.isLoading = true, 2000 );
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }
  load(){
    this.isLoading = false
    this.syncCardholders();
  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
    this.syncCardholders();
  }

  filterSearch(text){
    this.searchText = text;
    this.filters = [];
    // if (this.filterForm.value.firstName) {
    //   this.filters.push({
    //     propertyName: 'FirstName',
    //     value: this.filterForm.value?.firstName,
    //     dataType: 'string',
    //     operator: 0,
    //     caseSensitive: true,
    //   });
    // }
    if (this.filterForm.value.lastname) {
      this.filters.push({
        propertyName: 'lastname',
        value: this.filterForm.value?.lastname,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value.badge) {
      this.filters.push({
        propertyName: 'badge',
        value: this.filterForm.value?.badge,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value.groupName) {
      this.filters.push({
        propertyName: 'groupName',
        value: this.filterForm.value?.groupName,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }



    if (this.filters.length == 0) {
      this.filters.push({
        propertyName: 'string',
        value: 'string',
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filter.length == 0) {
      this.filter.push({
        propertyName: 'string',
        value: 'string',
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    // this.filters.push({
    //   "propertyName": "LenelStatus",
    //   "operator": 0,
    //   "value": "True",
    //   "dataType": "Boolean",
    //   "caseSensitive": true
    // })
    this.searchFilter = { andFilters:this.filters, orFilters: this.filter };
    this.currentPage = 1;
    this.currentPageLimit = environment.defaultPageLimit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getCardHolders();
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
      this.sNo.push({
        sNo:i
      })
    }
  }

  clearForm(){
    this.filterForm.reset()
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/acs-settings/card-holder']);
    });
    this.getCardHolders();
  }


  toggleAllSelection() {
    this.listType.forEach((item, indeex) => {
      let index = this.filter.findIndex((c) => c.value == item.value);
      if (index !== -1) {
        this.filter.splice(index, 1);
      }
    });

    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());

      this.listType.forEach((item, indeex) => {
        this.filter.push({
          propertyName: 'RegisterType',
          value: item.value,
          dataType:
            item.value == 'Contractor'
              ? 'Contractor'
              : item.value == 'Visitor'
              ? 'Visitor'
              : 'Employee',
          operator: 0,
          caseSensitive: true,
        });
      });
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());

      this.listType.forEach((item, indeex) => {
        let index = this.filter.indexOf(item.value);

        this.filter.splice(index, 1);
      });
    }
  }
  optionClick(selectedItem: any) {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
        let index = this.filter.findIndex((c) => c.value == item.value);
        if (index !== -1) {
          this.filter.splice(index, 1);
        }
      } else {
        //newStatus = true;
        if (selectedItem == item.value) {
          this.filter.push({
            propertyName: 'RegisterType',
            value: selectedItem,
            dataType:
              selectedItem == 'Contractor'
                ? 'Contractor'
                : selectedItem == 'Visitor'
                ? 'Visitor'
                : 'Employee',
            operator: 0,
            caseSensitive: true,
          });
        }
      }
    });
    this.allSelected = newStatus;
  }

}
