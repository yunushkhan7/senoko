import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AcsServerService } from 'src/app/service/acs-server.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { UserAccessGroupService } from 'src/app/service/user-access-group.service';

@Component({
  selector: 'app-employee-section-popup',
  templateUrl: './employee-section-popup.component.html',
  styleUrls: ['./employee-section-popup.component.scss']
})
export class EmployeeSectionPopupComponent implements OnInit {

  syncCardList:any;
  isLoading = false;
  showLoader = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EmployeeSectionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeSectionPopupComponent,
    private paginationService: PaginationService,
    private acsServerService: AcsServerService,
    private router: Router,
    private userAccessGroupService: UserAccessGroupService
  ) { }

  ngOnInit(): void {
    this.syncEmployeeSection();
  }

  syncEmployeeSection(){
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
    this.syncEmployeeSection();
  }
  closeDialog(){
   this.dialogRef.close();
  }

}
