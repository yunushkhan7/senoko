import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IntegrationService } from 'src/app/service/integration.service';

@Component({
  selector: 'app-acs-server-popup',
  templateUrl: './acs-server-popup.component.html',
  styleUrls: ['./acs-server-popup.component.scss']
})
export class AcsServerPopupComponent implements OnInit {


  addForm: FormGroup;
  addFormSms: FormGroup;
  showLoader = false;
  testPopUp = 'test'
  testPopUp2 = 'test2'
  
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AcsServerPopupComponent>,
    private fb: FormBuilder,
    private integrationService: IntegrationService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: AcsServerPopupComponent,
  ) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if(this.data){
      this.testPopUp = this.data?.testPopUp
      this.testPopUp2 = this.data?.testPopUp2
    }
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, { disableClose: true });
    this.dialogRef.close(false);
  }

}
