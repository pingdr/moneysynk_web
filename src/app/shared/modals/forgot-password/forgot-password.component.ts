import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { EmailOtpComponent } from '../email-otp/email-otp.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  email: FormGroup;
  submitted = false;
  public loader = false;
  forgotFlag : any = 1;

  constructor(private formBuilder: FormBuilder,
              public dialog: MatDialog,
              public http: HttpService,
              private toastr: ToastrService,
              public dialogRef: MatDialogRef<ForgotPasswordComponent>)
               {
                this.email = this.formBuilder.group({
                  email: ['', [Validators.required, Validators.email]],    
               });
               }

  ngOnInit(): void {
  }

  config = {

    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px',
    }
  };


  get f() { return this.email.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.email.invalid) {
        return;
    }

    if (this.http.isFormValid(this.email)) {
      this.loader = true;
      this.http.sendEmailtoForgotPassword(ApiUrl.Forgot, this.email.value.email, false)
        .subscribe(data => {
          let response: any = data;
            console.log(response);
          if (response.statusCode == 200) {
            this.dialogRef.close(this.dialogRef);
            this.toastr.success('otp send successfully', 'success', {
              timeOut: 2000
            });
            localStorage.setItem('otpemail', this.email.value.email);
            localStorage.setItem('otpForgot', this.forgotFlag);
            const dialogRef = this.dialog.open(EmailOtpComponent, { panelClass: 'otp-modal-main', data: { isforgot: true }, });

            dialogRef.afterClosed().subscribe(result => {
              console.log(`Dialog result: ${result}`);
            });
          } 

        },
          () => {
            console.log('failed');
            this.loader = false;
          });
          
    }
  }

}
