import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { ReportService } from 'src/app/service/report.service';
import { maxValue } from 'src/app/shared/common';

@Component({
  selector: 'app-add-roll-call',
  templateUrl: './add-roll-call.component.html',
  styleUrls: ['./add-roll-call.component.scss']
})
export class AddRollCallComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  submitted: boolean;
  minDate: Date;
  maxDate: Date;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService,
    private commonService: CommonService
  ) { 

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }


    this.addForm = this.fb.group({
      firstName: ["", Validators.compose([Validators.required, this.commonService.nameValidator])],
      lastName:[""],
      idNumber: [""],
      dob: ["2022-08-24T07:59:02.517Z"],
      gender: [""],
      companyName:[""],
      reason_for_visit:[""],
      visitType:[""],
      startTime: ["2022-08-24T07:59:02.517Z"],
      endTime: ["2022-08-24T07:59:02.517Z"],
      host: ["",Validators.compose([Validators.required])],
      workType: [""],
      siC_Expiry_Date: ["2022-08-24T07:59:02.517Z"],
      emA_Expiry_Date: ["2022-08-24T07:59:02.517Z"],
      registerType: ["",Validators.compose([Validators.required])],
      registerEntryType: [""],
      cardNo: ["",Validators.compose([Validators.required, this.commonService.nameValidator])],
      phoneNumber: [""],
      nric_passportnumber: [""],
      overduetime: ["2022-08-26"],
      age: ["0"],
      lasteventlocation: ["", Validators.compose([Validators.required])],
      lasteventon: ["", Validators.compose([Validators.required])],
      registerStatus: [""],
      athorizedtimestart: ["2022-08-26T12:21:51.908Z"],
      athorizedtimeEnd: ["2022-08-26T12:21:51.908Z"],
      approvedstarttime: ["2022-08-26T12:21:51.908Z"],
      approvedendtime: ["2022-08-26T12:21:51.908Z"],
      entrancelocation: [""],
      entrancetime: ["2022-08-26T12:21:51.908Z"],
      exittime: ["2022-08-26T12:21:51.908Z"],
      exitlocation: [""],
      organizationdivision: ["",Validators.compose([Validators.required, this.commonService.nameValidator])],
      bcPteam: ["",Validators.compose([Validators.required])],
      rollcallgroup: ["",Validators.compose([Validators.required])],
      eventtype: [""],
      eventlocation: [""],
      eventtime: ["2022-08-26T12:21:51.908Z"],
      visitworktype: [""],
      stationname: [""],
      ssAmember: [false],
      moMverified: [false],
      overridenby: [""],
      reasonforoverride: [""],
      section:["",Validators.compose([Validators.required])]
    });
    

  }

  ngOnInit(): void {
  }

  getEditObject() {
    this.reportService.getReportById(this.editId).subscribe((response) => {
      if (response?.data) {
        this.addForm.patchValue(response?.data?.data);
      } else {
        this.router.navigateByUrl('/report/roll-call');
      }
    });
  }


  submitForm() {
    this.submitted = true
    if (this.addForm.valid) {
      this.showLoader = true;
      let payLoad=this.addForm.value
      payLoad['phoneNumber']=this.numberstr(this.addForm?.value?.phoneNumber)
      this.reportService.saveReport(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/report/roll-call');
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

  eDateChangedStart(res: any) {
    this.minDate = res.value;
    // let date = this.datepipe.transform(res.value,'mm/dd/yyyy hh:mm:ss')
  }
}
