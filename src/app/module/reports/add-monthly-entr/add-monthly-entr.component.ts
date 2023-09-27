import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from 'src/app/service/report.service';
import { maxValue } from 'src/app/shared/common';

@Component({
  selector: 'app-add-monthly-entr',
  templateUrl: './add-monthly-entr.component.html',
  styleUrls: ['./add-monthly-entr.component.scss']
})
export class AddMonthlyEntrComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  submitted: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService,
  ) { 

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }


    this.addForm = this.fb.group({
      firstName: ["", Validators.compose([Validators.required])],
      lastName:[""],
      idNumber: [""],
      dob: ["2022-08-24T07:59:02.517Z"],
      gender: ["male"],
      companyName:["", Validators.compose([Validators.required])],
      reason_for_visit:[""],
      visitType:[""],
      startTime: ["2022-08-24"],
      endTime: ["2022-08-24"],
      host: [""],
      workType: [""],
      siC_Expiry_Date: ["", Validators.compose([Validators.required])],
      emA_Expiry_Date: ["", Validators.compose([Validators.required])],
      registerType: ["", Validators.compose([Validators.required])],
      registerEntryType: [""],
      cardNo: [""],
      phoneNumber: [""],
      nric_passportnumber: ["",Validators.compose([Validators.required])],
      overduetime: ["2022-08-26"],
      age: ['', [Validators.required, maxValue(120)]],
      lasteventlocation: [""],
      lasteventon: ["2022-08-26T12:21:51.908Z"],
      registerStatus: [""],
    });
    

  }

  ngOnInit(): void {
  }

  getEditObject() {
    this.reportService.getReportById(this.editId).subscribe((response) => {
      if (response?.data) {
        this.addForm.patchValue(response?.data?.data);
      } else {
        this.router.navigateByUrl('/report/monthly-employee');
      }
    });
  }


  submitForm() {
    this.submitted = true
    if (this.addForm.valid) {
      this.showLoader = true;
      let payLoad=this.addForm.value
      payLoad['age']=this.numberstr(this.addForm?.value?.age)
      this.reportService.saveReport(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/report/monthly-employee');
          } else {
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }
  }

  numberstr(phone){
    let number = phone.toString();
    return number;
  }

}
