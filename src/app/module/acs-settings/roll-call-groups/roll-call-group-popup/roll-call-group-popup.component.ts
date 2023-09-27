import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AcsServerService } from 'src/app/service/acs-server.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { UserAccessGroupService } from 'src/app/service/user-access-group.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-roll-call-group-popup',
  templateUrl: './roll-call-group-popup.component.html',
  styleUrls: ['./roll-call-group-popup.component.scss']
})
export class RollCallGroupPopupComponent implements OnInit {

  loadingState = true;
  rollCallGroupList: Array<any> = [];
  userAccessGroup: Array<any> = [];
  pagination: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  currentUser: any;
  lastpage: any;
  editId = null;
  testPopUp = 'rollcallgrouptest'
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
    public dialogRef: MatDialogRef<RollCallGroupPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RollCallGroupPopupComponent,
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
      this.getRollCallGroups(this.data);
    }
    this.dataArray = []
    this.getSNo(this.currentPage)
    this.syncRollCallGroups();
  }

  getRollCallGroups(data:any) {
    data.importdata;
    this.loadingState = true;
    const params: any = {
      pagenumber: this.currentPage,
      pagesize: this.currentPageLimit
    };
    this.acsServerService.getRollCallGroups(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response?.data) {
          this.rollCallGroupList = response?.data?.item_list;
          this.lastpage = response?.data?.total_pages;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response.data['total_items'],
            this.currentPage,
            this.currentPageLimit
          );
          let dataList = [];
          data?.importdata?.forEach((e,i)=>{
            dataList.push(e?.name);
          })
          if(this.rollCallGroupList) { 
            this.rollCallGroupList?.forEach((USGL,i)=>{
              this.rollCallGroupList[i].isSelected = dataList?.includes(USGL?.property_value_map?.name);
              this.rollCallGroupList[i].selectedId = data?.importdata?.filter(e => e?.name ==USGL?.property_value_map.name)[0]?.id;
            })
          }
         
        }
      },
      (error) => {
        this.loadingState = false;
      }
    );
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    // this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    // this.getSNo(this.currentPage)
    this.getRollCallGroups(this.data);
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
    this.rollCallGroupList[i].isSelected = !this.rollCallGroupList[i].isSelected
    if(selectedItem?.isSelected){
      let index = this.dataArray.findIndex((c) => c?.rollCallGroupID == selectedItem?.property_value_map?.id);
      if (index !== -1) {
        this.dataArray.splice(index, 1);
      }
        this.dataArray.push({
          id:selectedItem?.selectedId == undefined ? 0 : selectedItem?.selectedId,
          rollCallGroupID: selectedItem?.property_value_map?.id, 
          name: selectedItem?.property_value_map?.name, 
          isActive: true});
      }else{
        let index = this.dataArray.findIndex((c) => c?.rollCallGroupID == selectedItem?.property_value_map?.id);
        if (index !== -1) {
          this.dataArray.splice(index, 1);
        }
      this.dataArray.push({
        id:selectedItem?.selectedId == undefined ? 0 : selectedItem?.selectedId,
        rollCallGroupID: selectedItem?.property_value_map?.id, 
        name: selectedItem?.property_value_map?.name,
        isActive: false});
    }
  }

  saveRollCall(){
      this.acsServerService.saveRollCall(this.dataArray).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.close();
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/acs-settings/roll-call-group']);
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

  syncRollCallGroups(){
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
    this.syncRollCallGroups();
  }
  closeDialog(){
   this.dialogRef.close();
  }

}
