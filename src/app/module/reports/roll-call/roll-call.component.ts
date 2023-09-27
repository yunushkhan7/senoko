import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaginationService } from 'src/app/service/pagination.service';
import { ReportService } from 'src/app/service/report.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-roll-call',
  templateUrl: './roll-call.component.html',
  styleUrls: ['./roll-call.component.scss']
})
export class RollCallComponent implements OnInit {

  rollCallList:any;
  showLoader = false;
  pagination: any = null;
  showPagination: boolean = false;
  currentPageLimit = environment.defaultPageLimit;
  currentPage: any = 1;
  age: number;
  searchText: any = null;
  isShort: any = false;
  sortFieldName: any;
  searchFilter: any = {};
  FirstName=true
  id=true
  CardNo=true
  RegisterType=true
  organizationdivision=true
  phone=true
  lasteventon=true
  lasteventlocation=true
  startCounting=1
  ageNo=true
  sNo=[];
  isSelectedAll = true
  Section = true
  BCPteam = true
  Rollcallgroup = true
  Host = true
  dSelect = []
  SelectedAll = []
  form: FormGroup;
  unreturnedchecked :boolean
  selected: string[]=['Name','Card#','Type','Organization/Division','Last Event Location','Last Event On','Section','BCP Team','Roll Call Group','Host']
  filterColumns: string[] = ['firstName','lastName','age', 'companyName', 'phoneNumber','registerType','idNumber','lasteventlocation'];
  lastpage: any;
  filterForm: FormGroup;
  permissionObject: any = null;
  filter2 = []
  filters: any = [];
  filter: any = [];
  SelectedAll2 = []
  selected2: string[]=['FirstName','CardNo','RegisterType','organizationdivision','lasteventlocation','lasteventon','Section','BCPteam','Rollcallgroup','Host']
  @ViewChild('select') select: MatSelect;
  allSelected = false;
  listType: any[] = [
    { value: 'Visitor', viewValue: 'Visitor' },
    { value: 'Contractor', viewValue: 'Contractor' },
    { value: 'Employee', viewValue: 'Employee' },
  ];
  tablefilter:any=[];
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private reportService: ReportService,
    private fb: FormBuilder,
    private dataService: DataService
  ) { 
    this.SelectedAll=this.selected
    this.SelectedAll2=this.selected2
    this.form = new FormGroup({
      model: new FormControl(this.SelectedAll)      
    });
    this.filterForm = this.fb.group({
      registerType: [""],
      firstName: [""],
      organizationdivision: [""],
      rollcallgroup:[""],
      lasteventlocation: [""],
      bcPteam: [""],
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Report;
    });
  }

  ngOnInit(): void {
    this.getRollCallList();
    this.getSNo(this.currentPage)
    this.filters = [];
    this.filter = [];
  }


  DownloadExcel() {
    let excelData = {
      searchFilter : { andFilters: this.filter2}
    };
    if (this.searchText) {
      excelData['searchFilter'] = this.searchFilter = { andFilters: this.filters, orFilters: this.filter };
    }
    this.filter2.push({
      "propertyName": "RegisterStatus",
      "operator": 8,
      "value": "CheckOut",
      "dataType": "string",
      "caseSensitive": true
    })
    this.filter2.push({
      "propertyName": "LenelStatus",
      "operator": 0,
      "value": "True",
      "dataType": "Boolean",
      "caseSensitive": true
    })
    this.filter2 = []
    excelData['fields'] = this.SelectedAll2;
    this.reportService.getRollCallReportExportExcell(excelData).subscribe((res: any) => {
      if (res?.status == 'Ok') {
        window.location.href = res?.data;
      }
    })
  }


  DownloadExcelRollCall() {
    let excelData = {
      searchFilter : { andFilters: this.filter2}
    };
    if (this.searchText) {
      excelData['searchFilter'] = this.searchFilter = { andFilters: this.filters, orFilters: this.filter };
    }
    this.filter2.push({
      "propertyName": "RegisterStatus",
      "operator": 8,
      "value": "CheckOut",
      "dataType": "string",
      "caseSensitive": true
    })
    this.filter2.push({
      "propertyName": "LenelStatus",
      "operator": 0,
      "value": "True",
      "dataType": "Boolean",
      "caseSensitive": true
    })
    this.filter2 = []
    excelData['fields'] = this.SelectedAll2;
    this.reportService.getRollCallGroupExportExcell(excelData).subscribe((res: any) => {
      if (res?.status == 'Ok') {
        window.location.href = res?.data;
      }
    })
  }

  items: any[] = [
    {value: 'Name', viewValue: 'Name'},
    {value: 'Card', viewValue: 'Card#'},
    {value: 'Type', viewValue: 'Type'},
    {value: 'Organization', viewValue: 'Organization/Division'},
    {value: 'section', viewValue: 'Section'},
    {value: 'bcpteam', viewValue: 'BCP Team'},
    {value: 'rollcallgroup', viewValue: 'Roll Call Group'},
    {value: 'host', viewValue: 'Host'},
    {value: 'lastEventLocation', viewValue: 'Last Event Location'},
    {value: 'lastEvent', viewValue: 'Last Event On'},
  ];



  selectCol(colName,i){
    if(colName=='Name'){
      this.FirstName=!this.FirstName
    }else if(colName=='Card#'){
      this.CardNo=!this.CardNo
    }else if(colName=='Type'){
      this.RegisterType=!this.RegisterType
    }else if(colName=='Organization/Division'){
      this.organizationdivision=!this.organizationdivision
    }else if(colName=='Section'){
      this.Section=!this.Section
     }else if(colName=='BCP Team'){
      this.BCPteam=!this.BCPteam
     }else if(colName=='Roll Call Group'){
       this.Rollcallgroup=!this.Rollcallgroup
     }else if(colName=='Host'){
       this.Host=!this.Host
     }else if(colName=='Last Event Location'){
      this.lasteventlocation=!this.lasteventlocation
    }else if(colName=='Last Event On'){
      this.lasteventon=!this.lasteventon
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
      this.FirstName=true
      this.CardNo=true
      this.RegisterType=true
      this.organizationdivision=true
      this.Section = true
      this.BCPteam = true
      this.Rollcallgroup=true
      this.Host = true
      this.lasteventlocation=true
      this.lasteventon=true
      }else {
        this.form.get('model').setValue([]);
        this.FirstName=false
        this.CardNo=false
        this.RegisterType=false
        this.organizationdivision=false
        this.Section = false
        this.BCPteam =false
        this.Rollcallgroup =false
        this.Host = false
        this.lasteventlocation=false
        this.lasteventon=false
      }
  }


  getRollCallList(): void {
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
      searchFilter : { andFilters: this.filter2}
    };
    this.filter2.push({
      "propertyName": "RegisterStatus",
      "operator": 8,
      "value": "CheckOut",
      "dataType": "string",
      "caseSensitive": true
    })
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
    this.reportService.getAllRollcallReports(params).subscribe((response) => {
      this.showLoader = false;
      if (response?.data) {
            this.rollCallList = response?.data?.data;
            
            this.lastpage = response?.data?.totalPages
            this.rollCallList.forEach((element, i) => {
              // this.rollCallList[i]['age'] =this.ageCalculate(element.dob)    
              this.rollCallList[i]['sNo']=this.sNo[i].sNo          
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


  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getRollCallList();
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting =
      this.currentPageLimit * this.currentPage - (this.currentPageLimit - 1);
    this.getSNo(this.currentPage);
    this.getRollCallList()
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
  filterSearch(text){
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
    if (this.filterForm.value.lasteventlocation) {
      this.filters.push({
        propertyName: 'lasteventlocation',
        value: this.filterForm.value?.lasteventlocation,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value.rollcallgroup) {
      this.filters.push({
        propertyName: 'Rollcallgroup',
        value: this.filterForm.value?.rollcallgroup,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value.bcPteam) {
      this.filters.push({
        propertyName: 'BCPteam',
        value: this.filterForm.value?.bcPteam,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    this.filters.push({
      "propertyName": "RegisterStatus",
      "operator": 8,
      "value": "CheckOut",
      "dataType": "string",
      "caseSensitive": true
    })
    this.filters.push({
      "propertyName": "LenelStatus",
      "operator": 0,
      "value": "True",
      "dataType": "Boolean",
      "caseSensitive": true
    })
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
    this.searchFilter = { andFilters:this.filters, orFilters: this.filter };
    this.currentPage = 1;
    this.currentPageLimit = environment.defaultPageLimit;
    this.startCounting =
    this.currentPageLimit * this.currentPage - (this.currentPageLimit - 1);
    this.getSNo(this.currentPage);
    this.getRollCallList();
  }
  clearForm(){
    this.filterForm.reset()
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/report/roll-call']);
    });
    this.getRollCallList();
  }

  getRegistrationByIdCheckOut(id){
    this.reportService.getRegistrationByIdCheckOut(id).subscribe((response) => {
      this.showLoader = false;
      if (response?.data) {
        this.currentPage = 1;
        this.currentPageLimit = environment.defaultPageLimit;
        this.startCounting =
        this.currentPageLimit * this.currentPage - (this.currentPageLimit - 1);
        this.getSNo(this.currentPage);
        this.getRollCallList();
      }
    }, (error) => {
      this.showLoader = false;
    });
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
}
