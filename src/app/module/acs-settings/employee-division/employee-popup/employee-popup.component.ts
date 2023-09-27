import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AcsServerService } from 'src/app/service/acs-server.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { UserAccessGroupService } from 'src/app/service/user-access-group.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-popup',
  templateUrl: './employee-popup.component.html',
  styleUrls: ['./employee-popup.component.scss']
})
export class EmployeePopupComponent implements OnInit {

  loadingState = true;
  employeeDivisionList: Array<any> = [];
  userAccessGroup: Array<any> = [];
  pagination: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  currentUser: any;
  lastpage: any;
  editId = null;
  testPopUp = 'employeetest'
  testPopUp2 = 'server'
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  dataArray = [];
  selectedRemarks: any = [];
  sNo=[];
  startCounting=1
  syncCardList:any;
  isLoading = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EmployeePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeePopupComponent,
    private paginationService: PaginationService,
    private acsServerService: AcsServerService,
    private router: Router,
    private userAccessGroupService: UserAccessGroupService
  ) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if(this.data){
      this.testPopUp = this.data?.testPopUp
      this.testPopUp2 = this.data?.testPopUp2
      this.getEmployeesDivisions(this.data);
    }
    this.dataArray = []
    this.getSNo(this.currentPage);
    this.syncEmployeeDivision();
  }

  getEmployeesDivisions(data:any) {
    data.importdata;
    this.loadingState = true;
    const params: any = {
      pagenumber: this.currentPage,
      pagesize: this.currentPageLimit
    };
    this.acsServerService.getEmployeesDivisions(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response?.data) {
          this.employeeDivisionList = response?.data?.item_list;
          this.lastpage = response?.data?.total_pages;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response?.data['total_items'],
            this.currentPage,
            this.currentPageLimit
          );
          let dataList = [];
          data?.importdata?.forEach((e,i)=>{
            dataList.push(e?.name);
          })
          if(this.employeeDivisionList) { 
            this.employeeDivisionList?.forEach((USGL,i)=>{
              this.employeeDivisionList[i].isSelected = dataList?.includes(USGL?.property_value_map?.name);
              this.employeeDivisionList[i].selectedId = data?.importdata?.filter(e => e?.name ==USGL?.property_value_map.name)[0]?.id;
            })
          }
         
        }
      },
      (error) => {
        this.loadingState = false;
      }
    );
  }

  getPage(data: any,i) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    // this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    // this.getSNo(this.currentPage)
    this.getEmployeesDivisions(this.data);
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
         this.sNo.push({
          sNo:i
     })
    }
  }
  onSelect(selectedItem: any, i) {
    this.employeeDivisionList[i].isSelected = !this.employeeDivisionList[i].isSelected
    if(selectedItem?.isSelected){
      let index = this.dataArray.findIndex((c) => c?.employeesDivisionID == selectedItem?.property_value_map?.id);
      if (index !== -1) {
        this.dataArray.splice(index, 1);
      }
        this.dataArray.push({
          id:selectedItem?.selectedId == undefined ? 0 : selectedItem?.selectedId,
          employeesDivisionID: selectedItem?.property_value_map?.id, 
          name: selectedItem?.property_value_map?.name, 
          isActive: true});
      }else{
        let index = this.dataArray.findIndex((c) => c?.employeesDivisionID == selectedItem?.property_value_map?.id);
        if (index !== -1) {
          this.dataArray.splice(index, 1);
        }
      this.dataArray.push({
        id:selectedItem?.selectedId == undefined ? 0 : selectedItem?.selectedId,
        employeesDivisionID: selectedItem?.property_value_map?.id, 
        name: selectedItem?.property_value_map?.name,
        isActive: false});
    }
  }

  saveEmployeesDivisions(){
      this.acsServerService.saveEmployeesDivisions(this.dataArray).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.close();
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/acs-settings/employee-divisions']);
            });
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, { disableClose: true });
  }

  close(){
    this.dialogRef.close();
  }

  syncEmployeeDivision(){
    this.userAccessGroupService.syncCardholders().subscribe(
      (response) => {
        this.showLoader = false;
        if (response) {
          this.syncCardList=response?.data;
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
    this.syncEmployeeDivision();
  }
  closeDialog(){
   this.dialogRef.close();
  }

}
