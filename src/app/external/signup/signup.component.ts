import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { EmailOtpComponent } from 'src/app/shared/modals/email-otp/email-otp.component';
import { MustMatch } from '../../_helpers/must-match.validator';
import { ApiUrl } from '../../services/apiurl';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  SignupForm: FormGroup;
  submitted = false;
  boolean = true;
  rememberMeControl = new FormControl(false);
  public loader = false;
  public isPasswordShow: boolean = false;
  public isConfirmPassworShow: boolean = false;

  isTermsAndCondition: number = 0;

  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public http: HttpService,
    public sharedService: SharedService,
    private _commonService: CommonService,
    private toastr: ToastrService) {
  }
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  ngOnInit(): void {
    if (localStorage.getItem('rememberMe')) {
      this.rememberMeControl.patchValue(true);
      this.SignupForm.patchValue(JSON.parse(localStorage.getItem('rememberData')));
    }

    this.SignupForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.signUp();


  }

  signUp() {
    this.sharedService.mobileVerificationComplete.subscribe((data) => {
      console.log('Sign Up Form Data', data);
      console.log('SignUp Function ', this.SignupForm.value);
      this.loader = true;
      let payload = {
        "username": this.SignupForm.value.fullName,
        "email": this.SignupForm.value.email,
        "password": this.SignupForm.value.password,
        "phoneNumber": this.sharedService.mobile_number,
        "countryCode": this.sharedService.country_code,
        "role": "USER"
      }

      console.log(payload);

      this.http.signUp(ApiUrl.signUp, payload, false).subscribe((res) => {

        if (this.rememberMeControl.value) {
          localStorage.setItem('rememberMe', this.rememberMeControl.value);
          localStorage.setItem('rememberData', JSON.stringify(this.SignupForm.value));
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberData');
        }

        console.log('----------------SignUp Response--------------------', res.data);
        // localStorage.setItem('accessToken', JSON.stringify(res.data.token));
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('loginData', JSON.stringify(res.data));
        this.http.navigate('reports');

      })
    });
  }

  get f() { return this.SignupForm.controls; }

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

    if (!this.SignupForm.controls.acceptTerms.value && this.isTermsAndCondition != 0) {
      this.toastr.error('Please accept T&C');
    }

    if (this.SignupForm.invalid) {
      this.isTermsAndCondition = this.isTermsAndCondition + 1;
      return;
    }

    console.log('Signup Form Value', this.SignupForm.value);

    if (this.http.isFormValid(this.SignupForm)) {
      this.loader = true;
      this.http.sendEmail(ApiUrl.requestotp, this.SignupForm.value.email, false)
        .subscribe(data => {
          let response: any = data;
          console.log('SignUp Response', response);
          if (response.statusCode == 200) {

            this.toastr.success('otp send successfully', 'success', {
              timeOut: 2000
            });
            const dialogRef = this.dialog.open(EmailOtpComponent, { panelClass: 'otp-modal-main', data: { isforgot: false, email: this.SignupForm.value.email } });

            dialogRef.afterClosed().subscribe(result => {
              console.log('----------------------------------------', result);
              console.log(`Dialog result: ${result}`);
            });
          } else {
            this.toastr.error('otp not send', 'Error', {
              timeOut: 3000
            });
          }

        },
          () => {
            console.log('failed');
            this.loader = false;
          });

    }
  }

  onchangeTnC(event) {
    console.log(event.target.checked);
    if (event.target.checked) {
      this.SignupForm.controls.acceptTerms.setValue(event.target.checked);
    } else {
      this.SignupForm.controls.acceptTerms.setValue('');
      this.isTermsAndCondition = this.isTermsAndCondition + 1;
    }

  }

  openOtpmodal() {
    if (this.SignupForm.invalid) {
      return;
    }
    const dialogRef = this.dialog.open(EmailOtpComponent, { panelClass: 'otp-modal-main' });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Out Email OTP Model ------------- ', result);
      console.log(`Dialog result Function Data: ${result}`);
    });
  }

}
