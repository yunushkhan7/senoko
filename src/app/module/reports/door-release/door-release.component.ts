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
  selector: 'app-door-release',
  templateUrl: './door-release.component.html',
  styleUrls: ['./door-release.component.scss']
})
export class DoorReleaseComponent implements OnInit {

  doorRleaseList:any;
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
  card=true
  RegisterType=true
  organizationdivision=true
  phone=true
  stationname=true
  SSAmember=true
  overridenby=true
  Eventtime=true
  reasonforoverride=true
  all = true
  startCounting=1
  sNo=[];
  isSelectedAll = true
  dSelect = []
  SelectedAll = []
  form: FormGroup;
  unreturnedchecked :boolean
  selected: string[]=['Name','Type','Event Time','Station Name','Overriden By','Reason For Override']
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterColumns: string[] = ['firstName', 'companyName', 'registerType','idNumber','cardNo'];
  lastpage: any;
  filterForm: FormGroup;
  approvedstarttime :any;
  approvedendtime :any;
  permissionObject: any = null;
  filters: any = [];
  filter: any = [];
  SelectedAll2 = []
  selected2: string[]=['FirstName','RegisterType','Eventtime','stationname','overridenby','reasonforoverride']
  @ViewChild('select') select: MatSelect;
  allSelected = false;
  listType: any[] = [
    { value: 'Visitor', viewValue: 'Visitor' },
    { value: 'Contractor', viewValue: 'Contractor' },
    { value: 'Employee', viewValue: 'Employee' },
  ];

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
      Type: [""],
      firstName: [""],
      // organizationdivision: [""],
      reasonforoverride:[""],
      stationname: [""],
      // ssAmember:[""],
      eventtime:[""]
    });
    
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Report;
    });
  }


  ngOnInit(): void {
    this.getdoorRleaseList()
    this.getSNo(this.currentPage)
    this.filters = [];
    this.filter = [];
  }

  DownloadExcel() {
    let excelData = {};
    if (this.searchText) {
      excelData['searchFilter'] = this.searchFilter = { andFilters: this.filters, orFilters: this.filter };
    }
    excelData['fields'] = this.SelectedAll2;
    this.reportService.getDooreReleaseReportExportExcell(excelData).subscribe((res: any) => {
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
      this.RegisterType=true
      this.Eventtime=true
      this.stationname=true
      this.reasonforoverride=true
      this.overridenby=true
      }else {
        this.form.get('model').setValue([]);
        this.FirstName=false
        this.RegisterType=false
        this.Eventtime=false
        this.stationname=false
        this.reasonforoverride=false
        this.overridenby=false
      }
  }



  items: any[] = [
    {value: 'Name', viewValue: 'Name'},
    // {value: 'ID#', viewValue: 'ID#'},
    {value: 'Type', viewValue: 'Type'},
    // {value: 'Organization', viewValue: 'Organization/Division'},
    {value: 'eventTime', viewValue: 'Event Time'},
    {value: 'stationname', viewValue: 'Station Name'},
    // {value: 'ssamember', viewValue: 'SSA Member'},
    {value: 'Override', viewValue: 'Reason For Override'},
    {value: 'overridden', viewValue: 'Overriden By'},
  ];


  selectCol(colName,i){
    if(colName=='Name'){
      this.FirstName=!this.FirstName
    }else if(colName=='Type'){
      this.RegisterType=!this.RegisterType
    }else if(colName=='Event Time'){
       this.Eventtime=!this.Eventtime
    }else if(colName=='Station Name'){
      this.stationname=!this.stationname
    }else if(colName=='Reason For Override'){
      this.reasonforoverride=!this.reasonforoverride
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

  getdoorRleaseList(): void {
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
    this.reportService.getDooreRelease(params).subscribe((response) => {
      this.showLoader = false;
      if (response?.data) {
            this.doorRleaseList = response?.data?.data;
            this.lastpage = response?.data?.totalPages
            this.doorRleaseList.forEach((element, i) => {
              this.doorRleaseList[i]['diff'] =this.getMinutesBetweenDates(new Date(element.startTime), new Date(element.endTime));   
              this.doorRleaseList[i]['sNo']=this.sNo[i].sNo         
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
    this.getdoorRleaseList();
  }

  getPage(data: any) {
    this.currentPage = data?.page;
    this.currentPageLimit = data?.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getdoorRleaseList()
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
    // if (this.filterForm.value.organizationdivision) {
    //   this.filters.push({
    //     propertyName: 'organizationdivision',
    //     value: this.filterForm.value?.organizationdivision,
    //     dataType: 'string',
    //     operator: 0,
    //     caseSensitive: true,
    //   });
    // }
    if (this.filterForm.value.reasonforoverride) {
      this.filters.push({
        propertyName: 'reasonforoverride',
        value: this.filterForm.value?.reasonforoverride,
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
    // if (this.filterForm.value.ssAmember) {
    //   this.filters.push({
    //     propertyName: 'SSAmember',
    //     value: this.filterForm.value?.ssAmember,
    //     dataType: 'string',
    //     operator: 0,
    //     caseSensitive: true,
    //   });
    // }
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
    this.searchFilter = { andFilters:this.filters, orFilters: this.filter };
    this.currentPage = 1;
    this.currentPageLimit = environment.defaultPageLimit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getdoorRleaseList();
  }

  clearForm(){
    this.filterForm.reset()
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/report/door-release']);
    });
    this.getdoorRleaseList();
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
          propertyName: 'Type',
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
            propertyName: 'Type',
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
