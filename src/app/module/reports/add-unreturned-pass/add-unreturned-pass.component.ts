import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { ReportService } from 'src/app/service/report.service';

@Component({
  selector: 'app-add-unreturned-pass',
  templateUrl: './add-unreturned-pass.component.html',
  styleUrls: ['./add-unreturned-pass.component.scss']
})
export class AddUnreturnedPassComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  // minDate: Date | null;
  date: any;
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
      startTime: ["2022-08-26T12:21:51.908Z"],
      endTime: ["2022-08-26T12:21:51.908Z"],
      host: ["",Validators.compose([Validators.required])],
      workType: [""],
      siC_Expiry_Date: ["2022-08-24T07:59:02.517Z"],
      emA_Expiry_Date: ["2022-08-24T07:59:02.517Z"],
      registerType: ["", Validators.compose([Validators.required])],
      registerEntryType: [""],
      cardNo: ["",Validators.compose([Validators.required,this.commonService.nameValidator])],
      phoneNumber: [""],
      nric_passportnumber: [""],
      overduetime: ["2022-08-26T12:21:51.908Z"],
      age: ["0"],
      lasteventlocation: [""],
      lasteventon: ["2022-08-26T12:21:51.908Z"],
      registerStatus: [""],
      athorizedtimestart: ["", Validators.compose([Validators.required, this.dateRangeValidator])],
      athorizedtimeEnd: ["", Validators.compose([Validators.required, this.dateRangeValidator])],
      approvedstarttime: ["2022-08-26T12:21:51.908Z"],
      approvedendtime: ["2022-08-26T12:21:51.908Z"],
      entrancelocation: [""],
      entrancetime: ["2022-08-26T12:21:51.908Z"],
      exittime: ["2022-08-26T12:21:51.908Z"],
      exitlocation: [""],
      organizationdivision: ["", Validators.compose([Validators.required, this.commonService.nameValidator])],
      bcPteam: [""],
      rollcallgroup: [""],
      eventtype: [""],
      eventlocation: [""],
      eventtime: ["2022-08-26T12:21:51.908Z"],
      visitworktype: [""],
      stationname: [""],
      ssAmember: [false],
      moMverified: [false],
      overridenby: [""],
      reasonforoverride: [""],
      section:[""]
    });
    
  }

  ngOnInit(): void {
    this.setMinimumDate();
  }

  eDateChangedStart(res: any) {
    this.minDate = res.value;
    // let date = this.datepipe.transform(res.value,'mm/dd/yyyy hh:mm:ss')
  }
  private dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const athorizedtimestart = this.addForm && this.addForm.get("athorizedtimestart").value;
    const athorizedtimeEnd = this.addForm && this.addForm.get("athorizedtimeEnd").value;
    if (athorizedtimestart && athorizedtimeEnd) {
      invalid = new Date(athorizedtimestart).valueOf() > new Date(athorizedtimeEnd).valueOf();
    }
    return invalid ? { invalidRange: { athorizedtimestart, athorizedtimeEnd } } : null;
  };
  
  setMinimumDate() {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5);
    date.setSeconds(0);
    this.minDate = date;
  }
  getEditObject() {
    this.reportService.getReportById(this.editId).subscribe((response) => {
      if (response?.data) {
        this.addForm.patchValue(response?.data?.data);
      } else {
        this.router.navigateByUrl('/report/unreturnedpass');
      }
    });
  }


  submitForm() {
    this.submitted = true
    if (this.addForm.valid) {
      this.showLoader = true;
      let payLoad=this.addForm.value
      // payLoad['phoneNumber']=this.numberstr(this.addForm?.value?.phoneNumber)
      this.reportService.saveReport(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/report/unreturnedpass');
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
