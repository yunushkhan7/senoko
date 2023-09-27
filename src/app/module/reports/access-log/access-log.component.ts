import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccessLogService } from 'src/app/service/access-log.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { ReportService } from 'src/app/service/report.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-access-log',
  templateUrl: './access-log.component.html',
  styleUrls: ['./access-log.component.scss']
})
export class AccessLogComponent implements OnInit {

  accessLogList:any;
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
  lastEvent=true
  lasteventlocation=true
  startCounting=1
  Eventtype=true
  Eventtime = true
  host = true
  sNo=[];
  isSelectedAll = true
  Section = true
  BCPteam = true
  dSelect = []
  SelectedAll = []
  form: FormGroup;
  unreturnedchecked :boolean
  selected: string[]=['Name','Card #','Type','Organization/Division','Event Type','Last Event Location','Section','BCP Team','Event Time']
  filterColumns: string[] = ['name','idNo','type','organization','phone','eventType','eventLocation','host'];
  lastpage: any;
  filterForm: FormGroup;
  approvedstarttime :any;
  approvedendtime :any;
  permissionObject: any = null;
  filters: any = [];
  filter: any = [];
  SelectedAll2 = []
  selected2: string[]=['FirstName','CardNo','RegisterType','organizationdivision','Eventtype','Eventlocation','Section','BCPteam','Eventtime']
  @ViewChild('select') select: MatSelect;
  allSelected = false;
  listType: any[] = [
    { value: 'Visitor', viewValue: 'Visitor' },
    { value: 'Contractor', viewValue: 'Contractor' },
    { value: 'Employee', viewValue: 'Employee' },
  ];
  filter2 = []
  tablefilter:any=[];
  
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private accessLogService: AccessLogService,
    private reportService: ReportService,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.SelectedAll=this.selected
    this.form = new FormGroup({
      model: new FormControl(this.SelectedAll)      
    });
    this.SelectedAll2=this.selected2
    this.filterForm = this.fb.group({
      registerType: [""],
      firstName: [""],
      organizationdivision: [""],
      eventtype:[""],
      eventlocation: [""],
      bcPteam: [""],
      eventtime:[""],
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Report;
    });
   }

  ngOnInit(): void {
   this.getAccesslogList();
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
      "propertyName": "LenelStatus",
      "operator": 0,
      "value": "True",
      "dataType": "Boolean",
      "caseSensitive": true
    })
    excelData['fields'] = this.SelectedAll2;
    this.reportService.getAccessLogReportExportExcell(excelData).subscribe((res: any) => {
      if (res?.status == 'Ok') {
        window.location.href = res?.data;
      }
    })
  }

  items: any[] = [
    {value: 'Name', viewValue: 'Name'},
    {value: 'Card', viewValue: 'Card #'},
    {value: 'Type', viewValue: 'Type'},
    {value: 'Organization', viewValue: 'Organization/Division'},
    {value: 'section', viewValue: 'Section'},
    {value: 'bcpteam', viewValue: 'BCP Team'},
    {value: 'EventType', viewValue: 'Event Type'},
    {value: 'lastEventLocation', viewValue: 'Last Event Location'},
    {value: 'EventTime', viewValue: 'Event Time'},
  ];



  selectCol(colName,i){
    if(colName=='Name'){
      this.FirstName=!this.FirstName
    }else if(colName=='Card #'){
      this.CardNo=!this.CardNo
    }else if(colName=='Type'){
      this.RegisterType=!this.RegisterType
    }else if(colName=='Organization/Division'){
      this.organizationdivision=!this.organizationdivision
    }else if(colName=='Section'){
      this.Section=!this.Section
     }else if(colName=='BCP Team'){
      this.BCPteam=!this.BCPteam
     }else if(colName=='Event Type'){
      this.Eventtype=!this.Eventtype
    }else if(colName=='Last Event Location'){
      this.lasteventlocation=!this.lasteventlocation
    }else if(colName=='Event Time'){
      this.Eventtime=!this.Eventtime
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
    if(this.unreturnedchecked){
      this.form.get('model').setValue(this.selected);
      this.FirstName=true
      this.CardNo=true
      this.RegisterType=true
      this.organizationdivision=true
      this.Section=true
      this.BCPteam=true
      this.Eventtype=true
      this.lasteventlocation=true
      this.Eventtime=true
      }else {
        this.form.get('model').setValue([]);
        this.FirstName=false
        this.CardNo=false
        this.RegisterType=false
        this.organizationdivision=false
        this.Section=false
        this.BCPteam=false
        this.Eventtype=false
        this.lasteventlocation=false
        this.Eventtime=false
      }
  }

  
  getAccesslogList(): void {
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
      searchFilter : { andFilters: this.filter2}
    };
    if (this.searchText) {
      params.searchFilter = this.searchFilter;
    }
    this.filter2.push({
      "propertyName": "LenelStatus",
      "operator": 0,
      "value": "True",
      "dataType": "Boolean",
      "caseSensitive": true
    })
    if (this.sortFieldName) {
      params.sortElement = {
        "propertyName": this.sortFieldName,
        "sortOrder": this.isShort ? 1 : -1
      }
    }
    this.filter2 = []
    this.accessLogService.getAllAccessLogReports(params).subscribe((response) => {
      this.showLoader = false;
      if (response?.data) {
            this.accessLogList = response?.data?.data;
            this.lastpage = response?.data?.totalPages
            this.accessLogList.forEach((element, i) => {
              // this.attendanceList[i]['age'] =this.ageCalculate(element.dob) 
              this.accessLogList[i]['sNo']=this.sNo[i].sNo
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


  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getAccesslogList();
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getAccesslogList()
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
    if (this.filterForm.value.eventtype) {
      this.filters.push({
        propertyName: 'Eventtype',
        value: this.filterForm.value?.eventtype,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value.eventlocation) {
      this.filters.push({
        propertyName: 'Eventlocation',
        value: this.filterForm.value?.eventlocation,
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
    if (this.filterForm.value.eventtime) {
      this.filters.push({
        propertyName: 'Eventtime',
        value: this.reportService?.DateFormatter?.formatDate(this.filterForm.value.eventtime, 'YYYY-MM-DD HH:mm'),
        dataType: 'datetime',
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
    this.searchFilter = { andFilters:this.filters, orFilters: this.filter };
    this.currentPage = 1;
    this.currentPageLimit = environment.defaultPageLimit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getAccesslogList();
  }
  clearForm(){
    this.filterForm.reset()
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/report/access-log']);
    });
    this.getAccesslogList();
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
