import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PaginationService } from 'src/app/service/pagination.service';
import { ReportService } from 'src/app/service/report.service';
import { environment } from 'src/environments/environment';
import { StationAdmissionPopupComponent } from "./../station-admission-popup/station-admission-popup.component";
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DataService } from 'src/app/service/data.service';


@Component({
  selector: 'app-check-in-station',
  templateUrl: './check-in-station.component.html',
  styleUrls: ['./check-in-station.component.scss']
})
export class CheckInStationComponent implements OnInit {

  checkInStationList:any;
  showLoader = false;
  pagination: any = null;
  showPagination: boolean = false;
  currentPageLimit = environment.defaultPageLimit;
  currentPage: any = 1;
  searchText: any = null;
  isShort: any = false;
  sortFieldName: any;
  searchFilter: any = {};
  FirstName=true
  IDNumber=true
  CardNo=true
  RegisterType=true
  organizationdivision=true
  phone=true
  authorizedTimeStart=true
  authorizedTimeEnd=true
  overdueTime=true
  visitworktype = true
  approvedstarttime = true
  approvedendtime=true
  Host = true
  all = true
  startCounting=1
  sNo=[];
  isSelectedAll = true
  stationname = true
  Eventtype=true
  Eventtime = true
  SSAmember=true
  MOMverified=true
  overridenby=true
  dSelect = []
  SelectedAll = []
  form: FormGroup;
  unreturnedchecked :boolean
  selected: string[]=['Name','ID #','Card #','Type','Organization/Division','Visit Work Type','Approved Start Time','SSA Member','MOM Verified','Overriden By','Host','Station Name','Approved End Time','Event Type','Event Time']
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterColumns: string[] = ['firstName', 'companyName', 'registerType','idNumber','cardNo'];
  lastpage: any;
  filterForm: FormGroup;
  permissionObject: any = null;
  filters: any = [];
  filter: any = [];
  SelectedAll2 = []
  selected2: string[]=['FirstName','IDNumber','CardNo','RegisterType','organizationdivision','visitworktype','approvedstarttime','SSAmember','MOMverified','overridenby','Host','stationname','approvedendtime','Eventtype','Eventtime']
  @ViewChild('select') select: MatSelect;
  allSelected = false;
  listType: any[] = [
    { value: 'Visitor', viewValue: 'Visitor' },
    { value: 'Contractor', viewValue: 'Contractor' },
    { value: 'Employee', viewValue: 'Employee' },
  ];
  filter2 = []
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private paginationService: PaginationService,
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
      stationname: [""],
      adHoc:[""],
      eventtime:[""]
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Report;
    });
    
  }


  ngOnInit(): void {
    this.getCheckInStation()
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
    this.reportService.getCheckinStationReportExportExcell(excelData).subscribe((res: any) => {
      if (res?.status == 'Ok') {
        window.location.href = res?.data;
      }
    })
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
      this.IDNumber=true
      this.CardNo=true
      this.RegisterType=true
      this.organizationdivision=true
      this.visitworktype=true
      this.approvedstarttime =true
      this.approvedendtime=true
      this.Host = true
      this.stationname=true
      this.Eventtype=true
      this.Eventtime=true
      this.SSAmember=true
      this.MOMverified=true
      this.overridenby=true
      }else {
        this.form.get('model').setValue([]);
        this.FirstName=false
        this.IDNumber=false
        this.CardNo=false
        this.RegisterType=false
        this.organizationdivision=false
        this.visitworktype=false
        this.approvedstarttime =false
        this.approvedendtime=false
        this.Host = false
        this.stationname=false
        this.Eventtype=false
        this.Eventtime=false
        this.SSAmember=false
        this.MOMverified=false
        this.overridenby=false
      }
  }



  items: any[] = [
    {value: 'Name', viewValue: 'Name'},
    {value: 'ID#', viewValue: 'ID #'},
    {value: 'Card', viewValue: 'Card #'},
    {value: 'Type', viewValue: 'Type'},
    {value: 'Organization', viewValue: 'Organization/Division'},
    {value: 'visitworktype', viewValue: 'Visit Work Type'},
    {value: 'approvestarttime', viewValue: 'Approved Start Time'},
    {value: 'approveendtime', viewValue: 'Approved End Time'},
    {value: 'host', viewValue: 'Host'},
    {value: 'stationname', viewValue: 'Station Name'},
    {value: 'EventType', viewValue: 'Event Type'},
    {value: 'EventTime', viewValue: 'Event Time'},
    {value: 'ssamember', viewValue: 'SSA Member'},
    {value: 'mom', viewValue: 'MOM Verified'},
    {value: 'overridden', viewValue: 'Overriden By'},
  ];


  selectCol(colName,i){
    if(colName=='Name'){
      this.FirstName=!this.FirstName
    }else if(colName=='ID #'){
      this.IDNumber=!this.IDNumber
    }else if(colName=='Card #'){
      this.CardNo=!this.CardNo
    }else if(colName=='Type'){
      this.RegisterType=!this.RegisterType
    }else if(colName=='Organization/Division'){
      this.organizationdivision=!this.organizationdivision
    }else if(colName=='Visit Work Type'){
      this.visitworktype=!this.visitworktype
    }else if(colName=='Approved Start Time'){
      this.approvedstarttime=!this.approvedstarttime
    }else if(colName=='Approved End Time'){
      this.approvedendtime=!this.approvedendtime
    }else if(colName=='Host'){
      this.Host=!this.Host
     }else if(colName=='Station Name'){
       this.stationname=!this.stationname
    }else if(colName=='Event Type'){
      this.Eventtype=!this.Eventtype
    }else if(colName=='Event Time'){
      this.Eventtime=!this.Eventtime
    }else if(colName=='SSA Member'){
      this.SSAmember=!this.SSAmember
   }else if(colName=='MOM Verified'){
     this.MOMverified=!this.MOMverified
   }else if(colName=='Overriden By'){
     this.overridenby=!this.overridenby
   }
  }

  openDialog() {
    this.dialog.open(StationAdmissionPopupComponent,{
      panelClass: 'admission-box'

    });
    
  }
  goBack(){
    this.router.navigateByUrl('/dashboard');
  }


  getCheckInStation(): void {
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
    this.reportService.getReports(params).subscribe((response) => {
      this.showLoader = false;
      if (response?.data) {
            this.checkInStationList = response?.data?.data;
            this.lastpage = response?.data?.totalPages
            this.checkInStationList.forEach((element, i) => {
              this.checkInStationList[i]['diff'] =this.getMinutesBetweenDates(new Date(element.startTime), new Date(element.endTime));   
              this.checkInStationList[i]['sNo']=this.sNo[i].sNo         
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

  Filter(value){
   this.items.map((res)=>{
   })
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getCheckInStation();
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getCheckInStation()
  }

  getMinutesBetweenDates(startDate, endDate) {
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (60 * 60 * 24 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    const minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
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

  filterSearch(text){
    this.searchText = text;
    this.filters = [];
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
    if (this.filterForm.value.stationname) {
      this.filters.push({
        propertyName: 'stationname',
        value: this.filterForm.value?.stationname,
        dataType: 'string',
        operator: 0,
        caseSensitive: true,
      });
    }
    if (this.filterForm.value.adHoc) {
      this.filters.push({
        propertyName: 'overridenby',
        value: "",
        dataType: 'string',
        operator: this.filterForm.value?.adHoc==0?0:8,
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
    this.getCheckInStation();
  }

  clearForm(){
    this.filterForm.reset()
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/report/check-in-station']);
    });
    this.getCheckInStation();
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
