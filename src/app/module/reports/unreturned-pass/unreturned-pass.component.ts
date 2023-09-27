import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PaginationService } from 'src/app/service/pagination.service';
import { ReportService } from 'src/app/service/report.service';
import { environment } from 'src/environments/environment';
import { StationAdmissionPopupComponent } from './../station-admission-popup/station-admission-popup.component';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DataService } from 'src/app/service/data.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-unreturned-pass',
  templateUrl: './unreturned-pass.component.html',
  styleUrls: ['./unreturned-pass.component.scss'],
})
export class UnreturnedPassComponent implements OnInit {

  unReturnedpassList: any;
  showLoader = false;
  pagination: any = null;
  showPagination: boolean = false;
  currentPageLimit = environment.defaultPageLimit;
  currentPage: any = 1;
  searchText: any = null;
  isShort: any = false;
  sortFieldName: any;
  searchFilter: any = {};
  Name = true;
  id = true;
  CardNo = true;
  Type = true;
  OrganizationDivision = true;
  Host = true;
  AthorizedtimeStart = true;
  AthorizedtimeEnd = true;
  OverdueTime = true;
  all = true;
  startCounting = 1;
  sNo = [];
  isSelectedAll = true;
  dSelect = [];
  SelectedAll = [];
  SelectedAll2 = [];
  form: FormGroup;
  unreturnedchecked: boolean;
  selected2: string[] = [
    'Name',
    'CardNo',
    'RegisterType',
    'OrganizationDivision',
    'Host',
    'AthorizedtimeStart',
    'AthorizedtimeEnd',
    'overDue',
  ];
  selected: string[] = [
    'Name',
    'Card #',
    'Type',
    'Organization/Division',
    'Host',
    'Athorized Time Start',
    'Athorized Time End',
    'Overdue Time',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterColumns: string[] = [
    'firstName',
    'companyName',
    'registerType',
    'idNumber',
    'cardNo',
  ];
  lastpage: any;
  filterForm: FormGroup;
  permissionObject: any = null;
  filters: any = [];
  filter: any = [];

  @ViewChild('select') select: MatSelect;
  allSelected = false;
  listType: any[] = [
    { value: 'Visitor', viewValue: 'Visitor' },
    { value: 'Contractor', viewValue: 'Contractor' },
    { value: 'Employee', viewValue: 'Employee' },
  ];
  filter2 = []
  isAddForm: any;
  tablefilter:any=[];
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private reportService: ReportService,
    private fb: FormBuilder,
    private dataService: DataService,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {
    this.SelectedAll2 = this.selected2;
    this.SelectedAll = this.selected;
    this.form = new FormGroup({
      model: new FormControl(this.SelectedAll),
    });
    this.filterForm = this.fb.group({
      registerType: [''],
      firstName: [''],
      organizationdivision: [''],
      host: [''],
      AthorizedtimeEnd: [''],
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Report;
    });
  }

  ngOnInit(): void {
    this.getUnreturnedPass();
    this.getSNo(this.currentPage);
    this.filters = [];
    this.filter = [];
  }

  toggleAllSelection() {
    this.listType.forEach((item, indeex) => {
      let index = this.tablefilter.findIndex((c) => c.value == item.value);
      if (index !== -1) {
        this.tablefilter.splice(index, 1);
      }
    });

    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());

      this.listType.forEach((item, indeex) => {
        this.tablefilter.push({
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
        let index = this.tablefilter.indexOf(item.value);

        this.tablefilter.splice(index, 1);
      });
    }
  }
  optionClick(selectedItem: any) {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
        let index = this.tablefilter.findIndex((c) => c.value == item.value);
        if (index !== -1) {
          this.tablefilter.splice(index, 1);
        }
      } else {
        //newStatus = true;
        if (selectedItem == item.value) {
          this.tablefilter.push({
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

  DownloadExcel() {
    let excelData = {
      searchFilter : { andFilters: this.filter2}
    };
    if (this.searchText) {
      excelData['searchFilter'] = this.searchFilter = { andFilters: this.filters, orFilters: this.filter };
    }
    this.filter2.push({
      "propertyName": "LenelStatus",
      "operator": 0,
      "value": "True",
      "dataType": "Boolean",
      "caseSensitive": true
    })
    excelData['fields'] = this.SelectedAll2;
    this.reportService
      .GetUnReturnedPassDownload(excelData)
      .subscribe((res: any) => {
        if (res?.status == 'Ok') {
          window.location.href = res?.data;
        }
      });
  }

  isChecked(): boolean {
    return (
      this.form.get('model').value &&
      this.selected.length &&
      this.form.get('model').value.length === this.selected.length
    );
  }

  isIndeterminate(): boolean {
    return (
      this.form.get('model').value &&
      this.selected.length &&
      this.form.get('model').value.length &&
      this.form.get('model').value.length < this.selected.length
    );
  }

  toggleSelection(change: MatCheckboxChange): void {
    this.unreturnedchecked = change.checked;
    if (this.unreturnedchecked) {
      this.form.get('model').setValue(this.selected);
      this.Name = true;
      this.CardNo = true;
      this.Type = true;
      this.Host = true;
      this.OrganizationDivision = true;
      this.AthorizedtimeEnd = true;
      this.AthorizedtimeStart = true;
      this.OverdueTime = true;
    } else {
      this.form.get('model').setValue([]);
      this.Name = false;
      this.CardNo = false;
      this.Type = false;
      this.Host = false;
      this.OrganizationDivision = false;
      this.AthorizedtimeEnd = false;
      this.AthorizedtimeStart = false;
      this.OverdueTime = false;
    }
  }

  items: any[] = [
    { value: 'Name', viewValue: 'Name' },
    { value: 'Card', viewValue: 'Card #' },
    { value: 'Type', viewValue: 'Type' },
    { value: 'company', viewValue: 'Organization/Division' },
    { value: 'Host', viewValue: 'Host' },
    { value: 'Authorized Time Start', viewValue: 'Athorized Time Start' },
    { value: 'Authorized Time End', viewValue: 'Athorized Time End' },
    { value: 'Overdue Time', viewValue: 'Overdue Time' },
  ];

  selectCol(colName, i) {
    if (colName == 'Name') {
      this.Name = !this.Name;
    } else if (colName == 'Card #') {
      this.CardNo = !this.CardNo;
    } else if (colName == 'Type') {
      this.Type = !this.Type;
    } else if (colName == 'Organization/Division') {
      this.OrganizationDivision = !this.OrganizationDivision;
    } else if (colName == 'Host') {
      this.Host = !this.Host;
    } else if (colName == 'Athorized Time End') {
      this.AthorizedtimeEnd = !this.AthorizedtimeEnd;
    } else if (colName == 'Athorized Time Start') {
      this.AthorizedtimeStart = !this.AthorizedtimeStart;
    } else if (colName == 'Overdue Time') {
      this.OverdueTime = !this.OverdueTime;
    }
  }

  openDialog() {
    this.dialog.open(StationAdmissionPopupComponent, {
      panelClass: 'admission-box',
    });
  }
  goBack() {
    this.router.navigateByUrl('/dashboard');
  }


  getUnreturnedPass(): void {
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
      searchFilter : { andFilters: this.filter2}
    };
    this.filter2.push({
      "propertyName": "LenelStatus",
      "operator": 0,
      "value": "True",
      "dataType": "Boolean",
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
    this.reportService.getUnReturnedPass(params).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.data) {
          this.unReturnedpassList = response?.data?.data;
          this.lastpage = response?.data?.totalPages;
          this.unReturnedpassList.forEach((element, i) => {
            this.unReturnedpassList[i]['diff'] = this.getMinutesBetweenDates(
              new Date(element.athorizedtimestart),
              new Date(element.athorizedtimeEnd)
            );
            this.unReturnedpassList[i]['sNo'] = this.sNo[i].sNo;
          });
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response?.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }



  Filter(value) {
    this.items.map((res) => {});
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getUnreturnedPass();
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting =
      this.currentPageLimit * this.currentPage - (this.currentPageLimit - 1);
    this.getSNo(this.currentPage);
    this.getUnreturnedPass();
  }

  getMinutesBetweenDates(startDate, endDate) {
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (60 * 60 * 24 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000)) - days * 24;
    const minutes =
      Math.floor(diff / (60 * 1000)) - (days * 24 * 60 + hours * 60);
    return { day: days, hour: hours, minute: minutes };
  }

  pageChanged(event) {
    this.currentPage.emit(event.pageIndex);
    this.paginationService.setPageChanged(true);
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
      this.sNo.push({
        sNo:i
      })
    }
  }

  filterSearch(text) {
    this.searchText = text;
    this.filters = [];
    if(this.tablefilter.length !=0){
      this.tablefilter.forEach(element => {
        this.filters.push(element);
      });
    }
    if (this.filterForm.value.firstName) {
      this.filters.push({
        propertyName: 'FirstName',
        value: this.filterForm.value?.firstName,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value.organizationdivision) {
      this.filters.push({
        propertyName: 'organizationdivision',
        value: this.filterForm.value?.organizationdivision,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value.host) {
      this.filters.push({
        propertyName: 'Host',
        value: this.filterForm.value?.host,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value.AthorizedtimeEnd) {
      this.filters.push({
        propertyName: 'AthorizedtimeEnd',
        value: this.filterForm.value?.AthorizedtimeEnd,
        dataType: 'time',
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
    this.filters.push({
      "propertyName": "LenelStatus",
      "operator": 0,
      "value": "True",
      "dataType": "Boolean",
      "caseSensitive": true
    })
    if (this.searchText) {
      this.searchFilter = { andFilters: this.filters, orFilters: this.filter };
      this.currentPage = 1;
      this.currentPageLimit = environment.defaultPageLimit;
      this.startCounting =
      this.currentPageLimit * this.currentPage - (this.currentPageLimit - 1);
      this.getSNo(this.currentPage);
      this.getUnreturnedPass();
    }else{
      this.toastr.error(
        this.translateService.instant('USER.NO_DATA')
      );
    }
  }
  clear() {
    this.filterForm.reset();
    this.router
      .navigateByUrl('/RefreshComponent', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/report/Unreturned-Passes']);
      });
    this.getUnreturnedPass();
  }
}
