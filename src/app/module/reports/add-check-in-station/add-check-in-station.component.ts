import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessLogService } from 'src/app/service/access-log.service';
import { CommonService } from 'src/app/service/common.service';
import { ReportService } from 'src/app/service/report.service';

@Component({
  selector: 'app-add-check-in-station',
  templateUrl: './add-check-in-station.component.html',
  styleUrls: ['./add-check-in-station.component.scss']
})
export class AddCheckInStationComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  submitted: boolean;
  minDate: Date;
  maxDate: Date;
  minDate2: Date;
  maxDate2: Date;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService,
    private commonService: CommonService
  ) { 

    this.addForm = this.fb.group({
      firstName: ["", Validators.compose([Validators.required, this.commonService.nameValidator])],
      lastName:[""],
      idNumber: ["",Validators.compose([Validators.required])],
      dob: ["2022-08-24T07:59:02.517Z"],
      gender: [""],
      companyName:[""],
      reason_for_visit:[""],
      visitType:[""],
      startTime: ["2022-08-24T07:59:02.517Z"],
      endTime: ["2022-08-24T07:59:02.517Z"],
      workType: [""],
      siC_Expiry_Date: ["2022-08-24T07:59:02.517Z"],
      emA_Expiry_Date: ["2022-08-24T07:59:02.517Z"],
      registerType: ["", Validators.compose([Validators.required])],
      registerEntryType: [""],
      cardNo: ["",Validators.compose([Validators.required, this.commonService.nameValidator])],
      phoneNumber: [""],
      nric_passportnumber: [""],
      overduetime: ["2022-08-26"],
      age: ["0"],
      host: ["", Validators.compose([Validators.required])],
      lasteventlocation: [""],
      lasteventon: ["2022-08-26T12:21:51.908Z"],
      registerStatus: [""],
      athorizedtimestart: ["2022-08-26T12:21:51.908Z"],
      athorizedtimeEnd: ["2022-08-26T12:21:51.908Z"],
      approvedstarttime: ["",Validators.compose([Validators.required])],
      approvedendtime: ["", Validators.compose([Validators.required])],
      entrancelocation: [""],
      entrancetime: ["2022-08-26T12:21:51.908Z"],
      exittime: ["2022-08-26T12:21:51.908Z"],
      exitlocation: [""],
      organizationdivision: ["",Validators.compose([Validators.required, this.commonService.nameValidator])],
      bcPteam: [""],
      rollcallgroup: [""],
      eventtype: ["",Validators.compose([Validators.required])],
      eventlocation: [""],
      eventtime: ["",Validators.compose([Validators.required])],
      visitworktype: ["",Validators.compose([Validators.required])],
      stationname: ["",Validators.compose([Validators.required])],
      ssAmember: ["",Validators.compose([Validators.required])],
      moMverified: ["", Validators.compose([Validators.required])],
      overridenby: ["", Validators.compose([Validators.required])],
      reasonforoverride: [""]
    });
  
  }

  ngOnInit(): void {
  }
  
  submitForm() {
    this.submitted = true
    if (this.addForm.valid) {
      this.showLoader = true;
      let payLoad=this.addForm.value
      payLoad['ssAmember']=this.numberstr(this.addForm?.value?.ssAmember)
      payLoad['moMverified']=this.numberstr(this.addForm?.value?.moMverified)
      this.reportService.saveReport(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/report/check-in-station');
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
    let boolValue = JSON.parse(phone);
    return boolValue;
  }

  eDateChangedStart(res: any) {
    this.minDate = res.value;
    // let date = this.datepipe.transform(res.value,'mm/dd/yyyy hh:mm:ss')
  }
  eDateChangedStart2(res: any) {
    this.minDate2 = res.value;
    // let date = this.datepipe.transform(res.value,'mm/dd/yyyy hh:mm:ss')
  }
}
