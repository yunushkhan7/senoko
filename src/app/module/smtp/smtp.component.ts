import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { SmtpService } from 'src/app/service/smtp.service';
import { validateEmailFormControl } from 'src/app/shared/common';
import { MYCustomValidators } from '../profile/custom-validators';

@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.scss']
})
export class SmtpComponent implements OnInit {
  public showPassword: boolean = false;
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  id:any
  payload:any
  permissionObject: any = null;
  submitted:boolean;
  currentUser: any;
  
  constructor(
    private smtpService: SmtpService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private toastr: ToastrService,
  ) {

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }

    this.addForm = this.fb.group({
      hostName: ["", Validators.compose([Validators.required])],
      fromEmail: ["", Validators.compose([Validators.required, validateEmailFormControl])],
      portNO: ["", Validators.compose([Validators.required])],
      passwordMail:["", [
        Validators.required,
        // check whether the entered password has a number
        MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
        // check whether the entered password has upper case letter
        MYCustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        // check whether the entered password has a lower case letter
        MYCustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        // check whether the entered password has a special character
        MYCustomValidators.patternValidator(
          /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/,
          { hasSpecialCharacters: true }
        ),
        Validators.minLength(14),
      ]],
      ssl: [false, Validators.compose([Validators.required])],
      senderName: ["", Validators.compose([Validators.required])],
      smtpUser: [""],
      emailFrom: [""],
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Logs;
    });

    this.dataService.currentUser.subscribe((responce) => {
      if (responce){
        this.currentUser = responce;
      }
    });
  }

  ngOnInit(): void {
    this.getMailConfigData()
  }
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  getEditObject() {
    this.showLoader = true;
    this.smtpService.GetMailConfigById(this.editId).subscribe((response) => {
      if (response) {
        this.showLoader = false;
        this.addForm.patchValue(response?.data);
      } else {
        this.router.navigateByUrl('/user-account');
      }
    });
  }

  getMailConfigData(){
    this.smtpService.getMailConfig().subscribe(
      (response) => {
        this.showLoader = false;
        if (response) {
         this.addForm.patchValue(response?.data);
         this.id=response?.data?.id
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }

  SaveMailConfig(){
    this.submitted = true
    if(this.addForm.valid){
      let payload=this.addForm.value
      payload['id']=this.id
      this.smtpService.SaveMailConfig(payload).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/smtp');
          } else {
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }
  }

  testMailConfig(){

      let payload=this.addForm.value
      payload['id']=this.id
      this.smtpService.TestMailConfig(payload).subscribe(
        (response) => {
          this.showLoader = false;

          if (response?.status == 'Error') {
            this.toastr.error('Mail not Sent');
          }
          if (response?.status == 'Success') {
            this.toastr.error('Mail Sent Success');
          }
          // if (response) {
          //   this.router.navigateByUrl('/smtp');
          // } else {
          // }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    
  }

  TestMailConfig(){
    this.smtpService.TestMailConfig(this.addForm.value).subscribe(
      (response) => {
        this.showLoader = false;
        if (response) {
          this.router.navigateByUrl('/smtp');
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }
  reset(){
    this.addForm.reset();
  }
}
