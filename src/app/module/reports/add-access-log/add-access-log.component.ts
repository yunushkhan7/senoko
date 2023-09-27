import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessLogService } from 'src/app/service/access-log.service';
import { CommonService } from 'src/app/service/common.service';


@Component({
  selector: 'app-add-access-log',
  templateUrl: './add-access-log.component.html',
  styleUrls: ['./add-access-log.component.scss']
})
export class AddAccessLogComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;
  submitted: boolean;
  minDate: Date;
  maxDate: Date;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private accessLogService: AccessLogService,
    private commonService: CommonService
  ) { 

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
      host: [""],
      lasteventlocation: [""],
      lasteventon: ["2022-08-26T12:21:51.908Z"],
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
      rollcallgroup: [""],
      eventtype: ["",Validators.compose([Validators.required])],
      eventlocation: ["",Validators.compose([Validators.required])],
      eventtime: ["",Validators.compose([Validators.required])],
      visitworktype: [""],
      stationname: [""],
      ssAmember: [false],
      moMverified: [false],
      overridenby: [""],
      reasonforoverride: [""],
      section:["", Validators.compose([Validators.required])]
    });
  
  }

  ngOnInit(): void {
  }
  
  submitForm() {
    this.submitted = true
    if (this.addForm.valid) {
      this.showLoader = true;
      let payLoad=this.addForm.value
      // payLoad['phone']=this.numberstr(this.addForm?.value?.phone)
      this.accessLogService.saveReport(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/report/access-log');
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
