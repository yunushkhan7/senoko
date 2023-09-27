import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { ReportService } from 'src/app/service/report.service';
import { environment } from 'src/environments/environment';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  attendanceList:any;
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
  startCounting=1
  sNo=[];
  Name=true
  passportnumber=true
  ageno=true
  ExitTime=true
  ApprovedEndTime=true
  OrganizationDivision=true
  CardNo=true
  Type=true
  EntranceLocation = true
  EntranceTime = true
  ApprovedStartTime = true
  ExitLocation = true
  Section = true
  BCPteam = true
  Host = true
  SelectedAll = []
  SelectedAll2 = []
  form: FormGroup;
  filterColumns: string[] = ['firstName','card','type','lastName', 'companyName','age', 'nric_passportnumber'];
  lastpage: any;
  unreturnedchecked :boolean
  selected: string[]=['Name','Card#','Type','Entrance Location','Entrance Time','Approved Start Time','Exit Location','Exit Time','Approved End Time','Organization/Division','Section','BCP Team','Host']
  selected2: string[]=['Name','CardNo','RegisterType','EntranceLocation','EntranceTime','ApprovedStartTime','ExitLocation','ExitTime','ApprovedEndTime','OrganizationDivision','Section','BCPteam','Host']
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
      entrancelocation:[""],
      host: [""],
      bcPteam: [""],
      entrancetime:[""],
      exittime:[""]
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Report;
    });
    
  }

  ngOnInit(): void {
    this.getAttendanceList()
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
    this.reportService.getIndividualAttendanceExportExcell(excelData).subscribe((res: any) => {
      if (res?.status == 'Ok') {
        window.location.href = res?.data;
      }
    })
  }

  
  items: any[] = [
    {value: 'Name', viewValue: 'Name'},
    {value: 'Card', viewValue: 'Card#'},
    {value: 'Type', viewValue: 'Type'},
    {value: 'entrencelocation', viewValue: 'Entrance Location'},
    {value: 'entrencetime', viewValue: 'Entrance Time'},
    {value: 'approvestarttime', viewValue: 'Approved Start Time'},
    {value: 'exitlocation', viewValue: 'Exit Location'},
    {value: 'exittime', viewValue: 'Exit Time'},
    {value: 'approveendtime', viewValue: 'Approved End Time'},
    {value: 'organisation', viewValue: 'Organization/Division'},
    {value: 'section', viewValue: 'Section'},
    {value: 'bcpteam', viewValue: 'BCP Team'},
    {value: 'host', viewValue: 'Host'},
  ];

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
      this.Name=true
      this.CardNo=true
      this.Type=true
      this.EntranceLocation = true
      this.EntranceTime =true
      this.ApprovedStartTime =true
      this.ExitLocation = true
      this.ExitTime = true
      this.ApprovedEndTime = true
      this.OrganizationDivision = true
      this.Section = true
      this.BCPteam = true
      this.Host = true
      }else {
        this.form.get('model').setValue([]);
        this.Name = false
        this.CardNo = false
        this.Type = false
        this.EntranceLocation = false
        this.EntranceTime = false
        this.ApprovedStartTime = false
        this.ExitLocation = false
        this.ExitTime = false
        this.ApprovedEndTime=false
        this.OrganizationDivision = false
        this.Section = false
        this.BCPteam =false
        this.Host = false
      }
  }

  selectCol(colName,i){
    if(colName=='Name'){
      this.Name=!this.Name
    }else if(colName=='Card#'){
      this.CardNo=!this.CardNo
    }else if(colName=='Type'){
      this.Type=!this.Type
    }else if(colName=='Entrance Location'){
      this.EntranceLocation=!this.EntranceLocation
    }else if(colName=='Entrance Time'){
      this.EntranceTime=!this.EntranceTime
    }else if(colName=='Approved Start Time'){
      this.ApprovedStartTime=!this.ApprovedStartTime
    }else if(colName=='Exit Location'){
      this.ExitLocation=!this.ExitLocation
    }else if(colName=='Exit Time'){
      this.ExitTime=!this.ExitTime
    }else if(colName=='Approved End Time'){
      this.ApprovedEndTime=!this.ApprovedEndTime
    }else if(colName=='Organization/Division'){
       this.OrganizationDivision=!this.OrganizationDivision
    }else if(colName=='Section'){
      this.Section=!this.Section
   }else if(colName=='BCP Team'){
    this.BCPteam=!this.BCPteam
   }else if(colName=='Host'){
    this.Host=!this.Host
   }
  }

  getAttendanceList(): void {
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
    this.reportService.getAllIndividualAttendanceReports(params).subscribe((response) => {
      this.showLoader = false;
      if (response?.data) {
            this.attendanceList = response?.data?.data;
            this.lastpage = response?.data?.totalPages;
            this.attendanceList.forEach((element, i) => {
              // this.attendanceList[i]['age'] =this.ageCalculate(element.dob) 
              this.attendanceList[i]['sNo']=this.sNo[i].sNo
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
    this.getAttendanceList();
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getAttendanceList()
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
      this.sNo.push({
        sNo:i
      })
    }
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
    if (this.filterForm.value.host) {
      this.filters.push({
        propertyName: 'Host',
        value: this.filterForm.value?.host,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value.entrancelocation) {
      this.filters.push({
        propertyName: 'Entrancelocation',
        value: this.filterForm.value?.entrancelocation,
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
    if (this.filterForm.value?.entrancetime) {
      this.filters.push({
        propertyName: 'entrancetime',
        value: this.reportService?.DateFormatter?.formatDate(this.filterForm.value?.entrancetime, 'YYYY-MM-DD HH:mm'),
        dataType: 'datetime',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value?.exittime) {
      this.filters.push({
        propertyName: 'Exittime',
        value: this.reportService?.DateFormatter?.formatDate(this.filterForm.value?.exittime, 'YYYY-MM-DD HH:mm'),
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
    this.getAttendanceList();
  }

  clearForm(){
    this.filterForm.reset()
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/report/Individual-Attendance']);
    });
    this.getAttendanceList();
  }
  goBack(){
    this.router.navigateByUrl('/dashboard');
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
