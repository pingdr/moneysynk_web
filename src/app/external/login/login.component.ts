import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../_helpers/must-match.validator';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { EmailOtpComponent } from '../../shared/modals/email-otp/email-otp.component';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { ForgotPasswordComponent } from 'src/app/shared/modals/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from 'src/app/shared/modals/change-password/change-password.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  submitted = false;
  public loader = false;
  isPasswordShow: boolean = false;
  rememberMeControl = new FormControl(false);


  dialogRefofOtpModal: MatDialogRef<EmailOtpComponent>;
  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, public http: HttpService) {
    this.LoginForm = this.formBuilder.group({

      user: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberme: ['']

    }, {

    });
  }



  ngOnInit(): void {
    if (localStorage.getItem('rememberMe')) {
      this.rememberMeControl.patchValue(true);
      this.LoginForm.patchValue(JSON.parse(localStorage.getItem('rememberData')));
    }

  }

  get f() { return this.LoginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.LoginForm.invalid) {
      return;
    }

    if (this.http.isFormValid(this.LoginForm)) {
      this.loader = true;
      this.http.postData(ApiUrl.Login, this.LoginForm.value.user, this.LoginForm.value.password, false)
        .subscribe(res => {
          if (this.rememberMeControl.value) {
            localStorage.setItem('rememberMe', this.rememberMeControl.value);
            localStorage.setItem('rememberData', JSON.stringify(this.LoginForm.value));
          } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('rememberData');
          }


          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('loginData', JSON.stringify(res.data));
          console.log(res.data.accessToken);
          this.http.navigate('reports');
        },
          () => {
            this.loader = false;
          });
    }


  }

  showPassword() {
    this.isPasswordShow = !this.isPasswordShow;

  }

  // openOtpmodal(){
  //   let self = this;
  //   self.dialogRefofOtpModal = self.dialog.open(EmailOtpComponent, {
  //     width: '1100px',
  //     data: {
  //       email:'xyz@yopmail.com',
  //       id:101,
  //       name:'hiren'
  //     }
  //   });

  //   self.dialogRefofOtpModal.afterClosed().subscribe((data: any) => {

  //   });
  // }
  openOtpmodal() {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, { panelClass: 'otp-modal-main' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
