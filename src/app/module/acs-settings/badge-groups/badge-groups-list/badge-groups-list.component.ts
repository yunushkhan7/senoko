import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { AcsServerService } from 'src/app/service/acs-server.service';
import { DataService } from 'src/app/service/data.service';
import { IntegrationService } from 'src/app/service/integration.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { UserAccessGroupService } from 'src/app/service/user-access-group.service';
import { environment } from 'src/environments/environment';
import { BadgeGroupsPopupComponent } from '../badge-groups-popup/badge-groups-popup.component';

@Component({
  selector: 'app-badge-groups-list',
  templateUrl: './badge-groups-list.component.html',
  styleUrls: ['./badge-groups-list.component.scss']
})
export class BadgeGroupsListComponent implements OnInit {

  loadingState = true;
  userbadgeGroupList: Array<any> = [];
  pagination: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  currentUser: any;
  lastpage: any;
  showLoader = false;
  isShort: any = false;
  sortFieldName: any;
  sNo=[];
  startCounting=1
  panelOpenState1: boolean = false;
  step1 = 0;
  submitted :boolean
  addForm: FormGroup;
  isEditing = false;
  editId = null;
  id:any
  badgeGroupId:any;
  selectedgroupList: any;
  selectedgroup2List:any;
  userbadgeGroupList2: Array<any> = [];
  userbadgeList: Array<any> = [];

  constructor(
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private integrationService: IntegrationService,
    private userAccessGroupService: UserAccessGroupService,
    private dataService: DataService,
    private router: Router,
    private acsServerService: AcsServerService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) { 
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.ACSSettings;
    });

    this.addForm = this.fb.group({
      contractorGroupId: ["", Validators.compose([])],
      visitorsGroupId: ["",  Validators.compose([])]
    });

  }

  ngOnInit(): void {
    this.getbadgeGroupList();
    this.getSNo(this.currentPage);
  }
  openDialog(): void {
    this.dialog.open(BadgeGroupsPopupComponent, {
      width: '500px',
    });
  }


  getbadgeGroupList() {
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
      searchFilter: {
        andFilters: [{
        "propertyName": "IsActive",
        "operator": 0,
        "value": 'True',
        "dataType": "Boolean",
        "caseSensitive": true
        }]
      }
    };
    if (this.sortFieldName) {
      params.sortElement = {
        "propertyName": this.sortFieldName,
        "sortOrder": this.isShort ? 1 : -1
      }
    }
    this.userAccessGroupService.getAllbadgeGroup(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response.data) {
          this.userbadgeGroupList = response?.data?.data;

          this.userbadgeGroupList?.forEach((e,i)=>{
            this.selectedgroupList=e?.id;
            this.selectedgroup2List=e?.id;
          })
          this.getEditObject();
          this.lastpage = response?.data?.totalPages;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
          if(this.userbadgeList?.length==0){
            this.userbadgeList = response?.data?.data;
          }
        } else {
          this.userbadgeGroupList = [];
          this.pagination = null;
        }
      },
      (error) => {
        this.loadingState = false;
        this.userbadgeGroupList = [];
        this.pagination = null;
      }
    );
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getbadgeGroupList();
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
         this.sNo.push({
          sNo:i
     })
    }
  }


  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getbadgeGroupList();
  }

  deleteUserAccessGroup(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true, deletedData: data?.badgeGroupName },
      panelClass: 'delete-popup',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.is_delete) {
        this.userAccessGroupService.deleteBadgeGroups(result?.id).subscribe(
          (res) => {
            if (res.status=='Ok') {
              this.currentPage = 1;
              this.getbadgeGroupList();
              this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/acs-settings/badge-group']);
              });
              this.dialog.open(ActionPopupComponent, {
                data: { ...res, isSuccess: true },
              });
            } else {
              // this.dialog.open(ActionPopupComponent, {
              //   data: { ...res, isSuccess: true }
              // });
            }
          },
          (err) => {
            this.dialog.open(ActionPopupComponent, {
              data: { ...err.error, isSuccess: true },
            });
          }
        );
      }
    });
  }


  testAcsServer(): void {
    this.showLoader = true;
    this.integrationService.testAcsServer().subscribe((response) => {
      this.showLoader = false;
      if (response?.status == "Error") {
        const dialogRef = this.dialog.open(BadgeGroupsPopupComponent, {
          panelClass: 'asc-server-modal-box',
          // width: '300px',
          data : {
            testPopUp2 : 'server',
            importdata: this.userbadgeList
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getbadgeGroupList();
        });
      }
      if (response?.status == "Ok") {
        const dialogRef = this.dialog.open(BadgeGroupsPopupComponent, {
          panelClass: 'asc-server-modal-box',
          width: '700px',
          data : {
            testPopUp : 'tabletest',
            importdata: this.userbadgeList
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.getbadgeGroupList();
        });
      }
    }, (error) => {
      // this.toastr.error(error.message);
      this.showLoader = false;
    });
  }
  
  goBack(){
    this.router.navigateByUrl('/dashboard');
  }

  setStep1(index: number) {
    this.step1 = index;
    this.panelOpenState1 = true;
  }

  saveBadgeGroupMapping(){
    this.submitted = true
    if (this.addForm.valid) {
      this.showLoader = true;
       let payLoad=this.addForm.value
       payLoad['contractorGroupId']=this.selectedgroupList
       payLoad['visitorsGroupId']=this.selectedgroup2List
      this.acsServerService.saveBadgeGroupMapping(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.toastr.success(
              this.translateService.instant(response?.message)
            );
            this.router.navigateByUrl('/acs-settings/badge-group');
          } else {
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }


  }

  getEditObject() {
    this.showLoader = true;
    this.acsServerService.getVMSBadgeGroup({}).subscribe((response) => {
      if (response) {
        this.showLoader = false;
        this.selectedgroupList=response?.data?.filter(e => e?.badgeGroupName =='Contractors')[0]?.badgeGroupId;
        this.selectedgroup2List=response?.data?.filter(e => e?.badgeGroupName =='Visitors')[0]?.badgeGroupId;
      } else {
        this.router.navigateByUrl('/acs-settings/acs-server-list');
      }
    });
  }

}
