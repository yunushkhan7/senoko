import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserAccessGroupService } from 'src/app/service/user-access-group.service';

@Component({
  selector: 'app-card-holders-popup',
  templateUrl: './card-holders-popup.component.html',
  styleUrls: ['./card-holders-popup.component.scss']
})
export class CardHoldersPopupComponent implements OnInit {
 
  showLoader = false;
  testPopUp = 'server'
  syncCardList:any;
  isLoading = false;

  constructor(
    private userAccessGroupService: UserAccessGroupService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CardHoldersPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CardHoldersPopupComponent,
  ) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.syncCardholders();
  }

  syncCardholders(){
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
    this.syncCardholders();
  }
  closeDialog(){
   this.dialogRef.close();
  }
}
