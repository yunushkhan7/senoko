import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IntegrationService } from 'src/app/service/integration.service';

@Component({
  selector: 'app-test-popup',
  templateUrl: './test-popup.component.html',
  styleUrls: ['./test-popup.component.scss']
})
export class TestPopupComponent implements OnInit {
 
  addForm: FormGroup;
  addFormSms: FormGroup;
  showLoader = false;
  testPopUp = 'test'
  testPopUp2 = 'test2'
  
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TestPopupComponent>,
    private fb: FormBuilder,
    private integrationService: IntegrationService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: TestPopupComponent,
  ) { 
    this.addForm = this.fb.group({
      cardNo: ["", Validators.compose([Validators.required])]
    });
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
