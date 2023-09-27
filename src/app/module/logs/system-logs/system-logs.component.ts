import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { ReportService } from 'src/app/service/report.service';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-system-logs',
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.scss']
})

export class SystemLogsComponent implements OnInit {
  showLoader: boolean;
  systemLogsList:any
  pagination: any = null;
  showPagination: boolean = false;
  currentPageLimit = environment.defaultPageLimit;
  currentPage: any = 1;
  searchText: any = null;
  filters: any = [];
  filter: any = [];
  isShort: any = false;
  sortFieldName: any;
  searchFilter: any = {};
  source=true
  module=true
  captureDateTime=true
  text = '';
  text2 = '';
  text3 = '';
  selectedDate :any;
  selectedDate2:any;
  step1 = 0;
  panelOpenState: boolean = false;
  panelOpenState1: boolean = false;
  step = 0;
  sNo=[];
  startCounting=1
  filterColumns: string[] = ['module','source'];
  filterList: string[] = ['source','module','captureDateTime'];
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  lastpage: any;
  permissionObject: any = null;
  selectedAll: string[]=['source','module','captureDateTime']
  selectedAll2: string[]=['source','module','captureDateTime']
  minDate: Date;
  maxDate: Date;
  SelectedAll = []
  form: FormGroup;
  SelectedAll2 = []
  unreturnedchecked :boolean
  selected: string[]=['Source','Module','Capture Date And Time']
  selected2: string[]=['source','module','captureDateTime']
  constructor(
    private _userService:UserService,
    private _paginationService: PaginationService,
    private reportService: ReportService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private dataService: DataService,
    private router: Router,
  ) {
    this.SelectedAll=this.selected
    this.form = new FormGroup({
      model: new FormControl(this.SelectedAll)      
    });
    this.SelectedAll2=this.selected2
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Logs;
    });
   }

  ngOnInit(): void {
    this.getSystemLogs();
    this.getSNo(this.currentPage)
    // this.selected=['source','module','captureDateTime']
  }

  isChecked(): boolean {
    return this.form.get('model').value && this.selected.length
      && this.form.get('model').value.length === this.selected.length;
  }

  isIndeterminate(): boolean {
    return this.form.get('model').value && this.selected.length && this.form.get('model').value.length
      && this.form.get('model').value.length < this.selected.length;
  }

  toggleSelection(change: MatCheckboxChange): void {
    this.unreturnedchecked = change.checked
    if(this.unreturnedchecked){
      this.form.get('model').setValue(this.selected);
      this.source=true
      this.module=true
      this.captureDateTime=true
      }else {
        this.form.get('model').setValue([]);
        this.source=false
        this.module=false
        this.captureDateTime=false
      }
  }
  DownloadExcel() {
    let excelData = {};
    if (this.searchText) {
      excelData['searchFilter'] = this.searchFilter = { andFilters: this.filters, orFilters: this.filter };
    }
    excelData['fields'] = this.SelectedAll2;
    this.reportService.getSystemLogsExportExcell(excelData).subscribe((res: any) => {
      if (res?.status == 'Ok') {
        window.location.href = res?.data;
      }
    })
  }

  reset(){
    this.text = null
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/logs/system-logs']);
    });
  }
  
  onSearch = (text) => {
    this.filters = [];
    for (let index = 0; index < this.filterList.length; index++) {
      const element = this.filterList[index];
      if( element == "module" && this.text){
        this.searchText = this.text; 
        this.filters.push({
          "propertyName": element,
          "value": this.searchText,
          "dataType": "string",
          "operator": 5,
          "caseSensitive": true
        })
      }if( element == "source" && this.text2){
        this.searchText = this.text2; 
        this.filters.push({
          "propertyName": element,
          "value": this.searchText,
          "dataType": "string",
          "operator": 5,
          "caseSensitive": true
        })
      }if( element == "source" && this.text3){
        this.searchText = this.text3; 
        this.filters.push({
          "propertyName": element,
          "value": this.searchText,
          "dataType": "string",
          "operator": 5,
          "caseSensitive": true
        })
      }else if(element == "captureDateTime" && this.selectedDate){
        this.searchText = this.selectedDate;
        this.filters.push({
          "propertyName": element,
          "value": this.reportService?.DateFormatter?.formatDate(this.selectedDate, 'YYYY-MM-DD HH:mm'),
          "dataType": "datetime",
          "operator": 0,
          "caseSensitive": true
        })
      }else if(element == "captureDateTime" && this.selectedDate2){
        this.searchText = this.selectedDate2;
        this.filters.push({
          "propertyName": element,
          "value": this.reportService?.DateFormatter?.formatDate(this.selectedDate2, 'YYYY-MM-DD HH:mm'),
          "dataType": "datetime",
          "operator": 0,
          "caseSensitive": true
        })
      }

    }
    this.filter = [];
    this.filter.push({
      "propertyName": "string",
      "value": "string",
      "dataType": "string",
      "operator": 0,
      "caseSensitive": true
    })
    // this.searchFilter = { andFilters: filters , orFilters:filter};
    // this.getSystemLogs();
    if (this.searchText) {
      this.searchFilter = { andFilters: this.filters , orFilters:this.filter};
      this.currentPage = 1;
      this.currentPageLimit = environment.defaultPageLimit;
      this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
      this.getSNo(this.currentPage)
      this.getSystemLogs();
    }else{
      this.toastr.error(
        this.translateService.instant('USER.NO_DATA')
      );
    }
  };

  items: any[] = [
    {value: 'Source', viewValue: 'Source'},
    {value: 'Module', viewValue: 'Module'},
    {value: 'CaptureDateTime', viewValue: 'Capture Date And Time'},
  ];

  selectCol(colName,i){
    if(colName=='Source'){
      this.source=!this.source
    }else if(colName=='Module'){
      this.module=!this.module
    }else if(colName=='Capture Date And Time'){
      this.captureDateTime=!this.captureDateTime
    }
  }

  getSystemLogs(){
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit
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
    this._userService.getSystemLogs(params).subscribe((response) => {
        this.showLoader = false;
        if (response?.data) {
           this.systemLogsList=response?.data?.data
           this.lastpage = response?.data?.totalPages
           this.systemLogsList.forEach((element, i) => {
            // this.attendanceList[i]['age'] =this.ageCalculate(element.dob) 
            this.systemLogsList[i]['sNo']=this.sNo[i].sNo
          });
           this.pagination = this._paginationService.getPager(
            response?.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          ); 
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }
  searchObject(text) {
    this.searchText = text;
    // this.currentPage = 1;
    let filters = [];
    for (let index = 0; index < this.filterColumns.length; index++) {
      const element = this.filterColumns[index];
      filters.push({
        "propertyName": element,
        "value": this.searchText,
        "dataType": "string",
        "operator": 5,
        "caseSensitive": true
      })
    }
    let filter = [];
    filter.push({
      "propertyName": "string",
      "value": "string",
      "dataType": "string",
      "operator": 5,
      "caseSensitive": true
    })
    this.searchFilter = { andFilters: filter, orFilters:filters};
    this.getSystemLogs();
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getSystemLogs();
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getSystemLogs()
  }
  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
         this.sNo.push({
          sNo:i
     })
    }
  }
  setStep(index: number) {
    this.step = index;
    this.panelOpenState = true;
  }

  setStep1(index: number) {
    this.step1 = index;
    this.panelOpenState1 = true;
  }

  eDateChangedStart(res: any) {
    this.minDate = res.value;
    // let date = this.datepipe.transform(res.value,'mm/dd/yyyy hh:mm:ss')
  }
  eDateChangedStart2(res: any) {
    this.minDate = res.value;
    // let date = this.datepipe.transform(res.value,'mm/dd/yyyy hh:mm:ss')
  }
 
  goBack(){
    this.router.navigateByUrl('/dashboard');
  }

}
