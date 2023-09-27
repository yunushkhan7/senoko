import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IntegrationService } from 'src/app/service/integration.service';
import {
  CountryISO,
  SearchCountryField,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
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
  smsPopUp = 'sms'
  submitted : boolean;
  // @ViewChild('MobileNo')
  // public MobileNo;
  
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Singapore];
  selectedCountryISO = CountryISO.Singapore;
  mySelectedCountryISO: CountryISO;

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

    this.addFormSms = this.fb.group({
      MobileNo: ["", Validators.compose([Validators.required, Validators.maxLength(15)])]
    });

    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    if(this.data){
      this.testPopUp = this.data?.testPopUp
      this.smsPopUp = this.data?.smsPopUp
    }
  }

  testMomApi(): void {
    this.submitted = true
    if (this.addForm.valid) {
      this.showLoader = true;
      const testData = {
        cardNo: this.addForm.value.cardNo
      };
      this.integrationService.testMomApi(testData).subscribe((response) => {
        this.showLoader = false;
        if (response?.message == "Invalid Data") {
          this.testPopUp = 'faild'
        }
        if(response?.message == "Success"){
          this.testPopUp = 'success'
        }
        if(response?.message == "Unable to connect to MOM Server"){
          this.testPopUp = 'false'
        }
      }, (error) => {
        this.toastr.error(error.message);
        this.showLoader = false;
      });
    }
  }

  testSmsGatewayApi(): void {
    this.submitted = true
    if (this.addFormSms.valid) {
      this.submitted = false;
      this.showLoader = true;
      const testData = {
        MobileNo: this.addFormSms.value.MobileNo?.e164Number
      };
      this.integrationService.testSmsGatewayApi(testData).subscribe((response) => {
        this.showLoader = false;
        if (response?.message == "Faild") {
          this.smsPopUp = 'faild'
        }
        if(response?.message == "Success"){
          this.smsPopUp = 'success'
        }
      }, (error) => {
        this.toastr.error(error.message);
        this.showLoader = false;
      });
    }
  }

  // public ngAfterViewChecked() {
  //   // disabling country selection button
  //     try {
  //       this.MobileNo.elRef.nativeElement.firstChild.children[0].disabled = 'true';
  //     } catch (e) {

  //     }
  // }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, { disableClose: true });
    this.dialogRef.close(false);
  }
  closeDialog(){
    this.dialogRef.close();
  }
}
