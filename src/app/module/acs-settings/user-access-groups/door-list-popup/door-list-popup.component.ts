import { IfStmt, ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationService } from 'src/app/service/pagination.service';
import { UserAccessGroupService } from 'src/app/service/user-access-group.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-door-list-popup',
  templateUrl: './door-list-popup.component.html',
  styleUrls: ['./door-list-popup.component.scss']
})
export class DoorListPopupComponent implements OnInit {

  loadingState = true;
  userAccessGroupList: Array<any> = [];
  userAccessGroup: Array<any> = [];
  pagination: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  currentUser: any;
  lastpage: any;
  editId = null;
  testPopUp = 'tabletest'
  testPopUp2 = 'server'
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  dataArray = [];
  selectedRemarks: any = [];
  sNo=[];
  startCounting=1
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DoorListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DoorListPopupComponent,
    private paginationService: PaginationService,
    private userAccessGroupService: UserAccessGroupService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if(this.data){
      this.testPopUp = this.data?.testPopUp
      this.testPopUp2 = this.data?.testPopUp2
      this.getImortAccessGroup(this.data);
    }
    this.dataArray = []
    this.getSNo(this.currentPage)
  }


  getImortAccessGroup(data:any) {
    data.importdata;
    this.loadingState = true;
    const params: any = {
      pagenumber: this.currentPage,
      pagesize: this.currentPageLimit
    };
    this.userAccessGroupService.getImortAccessGroup(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response?.data) {
          this.userAccessGroupList = response?.data?.item_list;
          this.lastpage = response?.data?.total_pages;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response.data['total_items'],
            this.currentPage,
            this.currentPageLimit
          );
          let dataList = [];
          data?.importdata?.forEach((e,i)=>{
            dataList.push(e?.userAccessGroupName);
          })
          if(this.userAccessGroupList) { 
            this.userAccessGroupList?.forEach((USGL,i)=>{
              this.userAccessGroupList[i].isSelected = dataList?.includes(USGL?.property_value_map?.name);
              this.userAccessGroupList[i].selectedId = data?.importdata?.filter(e => e?.userAccessGroupName ==USGL?.property_value_map.name)[0]?.id;
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
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getImortAccessGroup(this.data);
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
    this.userAccessGroupList[i].isSelected = !this.userAccessGroupList[i].isSelected
    if(selectedItem?.isSelected){
      let index = this.dataArray.findIndex((c) => c?.AccessLevelId == selectedItem?.property_value_map?.id);
      if (index !== -1) {
        this.dataArray.splice(index, 1);
      }
        this.dataArray.push({
          id:selectedItem?.selectedId == undefined ? 0 : selectedItem?.selectedId,
          AccessLevelId: selectedItem?.property_value_map.id, 
          userAccessGroupName: selectedItem?.property_value_map.name, 
          remarks:this.selectedRemarks[i], 
          isActive: true});
      }else{
        let index = this.dataArray.findIndex((c) => c?.AccessLevelId == selectedItem?.property_value_map?.id);
        if (index !== -1) {
          this.dataArray.splice(index, 1);
        }
      this.dataArray.push({
        id:selectedItem?.selectedId == undefined ? 0 : selectedItem?.selectedId,
        AccessLevelId: selectedItem?.property_value_map.id, 
        userAccessGroupName: selectedItem?.property_value_map.name,
        remarks:this.selectedRemarks[i], 
        isActive: false});
    }
  }

  saveUserAccessGroup(){
      this.userAccessGroupService.saveUserAccessGroup(this.dataArray).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.close();
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/acs-settings/access-levels']);
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

}
