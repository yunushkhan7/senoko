import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/service/pagination.service';
import { ReportService } from 'src/app/service/report.service';
import { environment } from 'src/environments/environment';
import * as xlsx from 'xlsx';
import { Location } from '@angular/common';

@Component({
  selector: 'app-entry-employee',
  templateUrl: './entry-employee.component.html',
  styleUrls: ['./entry-employee.component.scss']
})
export class EntryEmployeeComponent implements OnInit {

  monthlyEntryList:any;
  showLoader = false;
  pagination: any = null;
  showPagination: boolean = false;
  currentPageLimit = environment.defaultPageLimit;
  currentPage: any = 1;
  age: number;
  searchText: any = null;
  filters=[];
  filter = []
  isShort: any = false;
  sortFieldName: any;
  searchFilter: any = {};
  Fullname=true
  passportnumber=true
  ageno=true
  companyName=true
  emA_Expiry_Date=true
  siC_Expiry_Date=true
  startCounting=1
  sNo=[];
  type=true
  isSelectedAll = true
  dSelect = []
  SelectedAll = []
  form: FormGroup;
  unreturnedchecked :boolean
  selected: string[]=['Fullname','passportnumber','age','companyName','type','emA_Expiry_Date','siC_Expiry_Date']
  filterColumns: string[] = ['firstName','lastName', 'companyName','registerType','age', 'nric_passportnumber'];
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  lastpage: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private reportService: ReportService,
    private location: Location
  ) {
    this.SelectedAll=this.selected
    this.form = new FormGroup({
      model: new FormControl(this.SelectedAll)      
    });
   }

  ngOnInit(): void {
    this.getMonthlyEntryList();
    this.getSNo(this.currentPage)
  }

  items: any[] = [
    {value: 'Name', viewValue: 'Fullname'},
    {value: 'passportnumber', viewValue: 'passportnumber'},
    {value: 'age', viewValue: 'age'},
    {value: 'companyName', viewValue: 'companyName'},
    {value: 'Type', viewValue: 'type'},
    {value: 'emA_Expiry_Date', viewValue: 'emA_Expiry_Date'},
    {value: 'siC_Expiry_Date', viewValue: 'siC_Expiry_Date'},
  ];



  selectCol(colName,i){
    if(colName=='Fullname'){
      this.Fullname=!this.Fullname
    }else if(colName=='passportnumber'){
      this.passportnumber=!this.passportnumber
    }else if(colName=='age'){
      this.ageno=!this.ageno
    }else if(colName=='companyName'){
      this.companyName=!this.companyName
    }else if(colName=='type'){
      this.type=!this.type
    }else if(colName=='emA_Expiry_Date'){
      this.emA_Expiry_Date=!this.emA_Expiry_Date
    }else if(colName=='siC_Expiry_Date'){
       this.siC_Expiry_Date=!this.siC_Expiry_Date
    }
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
    // this.SelectAll();
    if(this.unreturnedchecked){
      this.form.get('model').setValue(this.selected);
      this.Fullname=true
      this.passportnumber=true
      this.ageno=true
      this.companyName=true
      this.type=true
      this.emA_Expiry_Date=true
      this.siC_Expiry_Date=true
      }else {
        this.form.get('model').setValue([]);
        this.Fullname=false
        this.passportnumber=false
        this.ageno=false
        this.companyName=false
        this.type=false
        this.emA_Expiry_Date=false
        this.siC_Expiry_Date=false
      }
  }
  
  exportToExcel() {
    const ws: xlsx.WorkSheet =   
    xlsx.utils.table_to_sheet(this.epltable?.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'epltable.xlsx');
  }

  getMonthlyEntryList(): void {
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
      // searchFilter : { andFilters: this.filter}
    };

    params.searchFilter = { andFilters: this.filter}
    
    this.filter.push({
      "propertyName": "CreatedDate",
      "operator": 0,
      "value": (new Date().getMonth() + 1).toString(),
      "dataType": "month",
      "caseSensitive": true
    })
    
    if (this.searchText) {
      params.searchFilter = { andFilters: this.filter , orFilters:this.filters};
    }
    this.filter = []
    this.reportService.getAllReport(params).subscribe((response) => {    
      this.showLoader = false;
      if (response?.data) {
            this.monthlyEntryList = response?.data?.data;
            this.lastpage = response?.data?.totalPages
            this.monthlyEntryList.forEach((element, i) => {
              // this.monthlyEntryList[i]['age'] =this.ageCalculate(element.dob) 
              this.monthlyEntryList[i]['sNo']=this.sNo[i].sNo 
            });
            this.showPagination = true;
            this.pagination = this.paginationService.getPager(
              response?.data['totalDocs'],
              this.currentPage,
              this.currentPageLimit
            ); 
      }
    }, (error) => {
      this.showLoader = false;
    });
  }



  ageCalculate(birthYear){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let age = currentYear - new Date(birthYear).getFullYear();
    return age;
  }


  searchObject(text) {
    this.searchText = text;
    // this.currentPage = 1;
    this.filters = []
    for (let index = 0; index < this.filterColumns.length; index++) {
      const element = this.filterColumns[index];
      this.filters.push({
        "propertyName": element,
        "value": this.searchText,
        "dataType": "string",
        "operator": 5,
        "caseSensitive": true
      })
    }
    // let filter = [];
    // filter.push({
    //   "propertyName": "string",
    //   "value": "string",
    //   "dataType": "string",
    //   "operator": 5,
    //   "caseSensitive": true
    // })
    // this.searchFilter = { andFilters: filter , orFilters:filters};
    this.filter = []
    this.getMonthlyEntryList();
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getMonthlyEntryList();
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getMonthlyEntryList()
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
    this.location.back();
  }
}
