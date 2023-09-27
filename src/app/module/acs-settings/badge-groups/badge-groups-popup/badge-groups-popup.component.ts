import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationService } from 'src/app/service/pagination.service';
import { UserAccessGroupService } from 'src/app/service/user-access-group.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-badge-groups-popup',
  templateUrl: './badge-groups-popup.component.html',
  styleUrls: ['./badge-groups-popup.component.scss']
})
export class BadgeGroupsPopupComponent implements OnInit {

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
  sNo=[];
  startCounting=1
  syncCardList:any;
  isLoading = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BadgeGroupsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BadgeGroupsPopupComponent,
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
      this.getImortBadgeGroup(this.data);
    }
    this.dataArray = []
    this.getSNo(this.currentPage);
    this.syncBadgeGroup();
  }


  getImortBadgeGroup(data:any) {
    data.importdata;
    this.loadingState = true;
    const params: any = {
      pagenumber: this.currentPage,
      pagesize: this.currentPageLimit
    };
    this.userAccessGroupService.getImortBadgeGroup(params).subscribe(
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
            dataList.push(e?.badgeGroupName);
          })
          if(this.userAccessGroupList) { 
            this.userAccessGroupList?.forEach((USGL,i)=>{
              this.userAccessGroupList[i].isSelected = dataList?.includes(USGL?.property_value_map?.name);
              this.userAccessGroupList[i].selectedId = data?.importdata?.filter(e => e?.badgeGroupName ==USGL?.property_value_map.name)[0]?.id;
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
    this.getImortBadgeGroup(this.data);
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
      let index = this.dataArray.findIndex((c) => c?.groupID == selectedItem?.property_value_map?.id);
      if (index !== -1) {
        this.dataArray.splice(index, 1);
      }
        this.dataArray.push({
          id:selectedItem?.selectedId == undefined ? 0 : selectedItem?.selectedId,
          groupID: selectedItem?.property_value_map?.id, 
          badgeGroupName: selectedItem?.property_value_map.name, 
          isActive: true});
      }else{
        let index = this.dataArray.findIndex((c) => c?.groupID == selectedItem?.property_value_map?.id);
        if (index !== -1) {
          this.dataArray.splice(index, 1);
        }
      this.dataArray.push({
        id:selectedItem?.selectedId == undefined ? 0 : selectedItem?.selectedId,
        groupID: selectedItem?.property_value_map?.id, 
        badgeGroupName: selectedItem?.property_value_map.name, 
        isActive: false});
    }
  }

  saveBadgeGroup(){
      this.userAccessGroupService.saveBadgeGroup(this.dataArray).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.close();
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/acs-settings/badge-group']);
            });
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
  }

  close(){
    this.dialogRef.close();
  }


  syncBadgeGroup(){
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
    this.syncBadgeGroup();
  }
  closeDialog(){
   this.dialogRef.close();
  }

}
