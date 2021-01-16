import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { CommonService } from 'src/app/services/common.service';
import { HttpService } from 'src/app/services/http.service';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { EmailOtpComponent } from '../email-otp/email-otp.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  Password: FormGroup;
  submitted = false;
  public loader = false;
  email: any;
  isPasswordShow: boolean = false;
  isConfirmPassworShow: boolean = false;
  button = 'Submit';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public http: HttpService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any



  ) { }

  ngOnInit(): void {

    // this.email = localStorage.getItem('otpemail');

    this.Password = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  // config = {

  //   disableAutoFocus: false,
  //   placeholder: '',
  //   inputStyles: {
  //     'width': '50px',
  //     'height': '50px',
  //   }
  // };

  get f() { return this.Password.controls; }

  showPassword(type) {

    if (type == 'password') {
      this.isPasswordShow = !this.isPasswordShow;
    } else {
      this.isConfirmPassworShow = !this.isConfirmPassworShow;
    }
  }

  onSubmit() {
    this.submitted = true;


    // stop here if form is invalid
    if (this.Password.invalid) {
      return;
    }


    this.isLoading = true;
    this.button = 'Processing';

    if (this.http.isFormValid(this.Password)) {
      this.loader = true;
      this.http.Forgotpassword(ApiUrl.Forgotpassword, this.data.email, this.Password.value.password, false)
        .subscribe(data => {
          let response: any = data;
          console.log(response);
          if (response.statusCode == 200) {

            this.toastr.success('Password reset successfully', 'success', {
              timeOut: 2000
            });
            this.dialogRef.close(this.dialogRef);
            // localStorage.setItem('accessToken', response.data.accessToken);
            // localStorage.setItem('loginData', JSON.stringify(response.data));
            // console.log(response.data.accessToken);
            this.http.navigate('login');

          }

        },
          () => {
            console.log('failed');
            this.loader = false;
            this.isLoading = false;
            this.button = 'Submit';
          });

    }


  }


}
