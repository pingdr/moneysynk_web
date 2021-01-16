import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { EnterMobilenumComponent } from '../enter-mobilenum/enter-mobilenum.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-mobile-otp',
  templateUrl: './verify-mobile-otp.component.html',
  styleUrls: ['./verify-mobile-otp.component.scss']
})
export class VerifyMobileOtpComponent implements OnInit {
  public loader = false;
  mobile: any
  otp: string;
  counctrycode:any;
  showOtpComponent = true;
  button = 'Verify & Enter';
  isLoading = false;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px',
    }
  };
  constructor(public http: HttpService, public router: Router,public dialog:
     MatDialog,public sharedserive:SharedService,
     public dialogRef: MatDialogRef<VerifyMobileOtpComponent>,
     private toastr: ToastrService,
     @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
console.log(this.data);
  }

  onOtpChange(otp) {
    console.log(otp);
    this.otp = otp;
  }

  openOtpmodal() {
    let payload = {
      code:this.otp,
      mobile:this.data.mobile,
      countryCode:this.data.counctrycode
    }
    this.loader = true;
    this.isLoading = true;
    this.button = 'Processing';
    this.http.verifyMobileOtp(ApiUrl.varifyotp, payload, false)
      .subscribe(data => {
        console.log(data);
        let response: any = data;
        if (response.statusCode == 200) {
          this.toastr.success('otp verify successfully', 'success', {
            timeOut: 2000
          });
          this.isLoading = false;
          this.button = 'Verify & Enter';
          this.sharedserive.mobile_number=this.data.mobile
          this.sharedserive.country_code=this.data.counctrycode
          this.loader = false;
          this.dialog.closeAll();
          this.sharedserive.mobileVerificationComplete.next();
          
        }
      },
        () => {
          console.log('failed');
          this.loader = false;
          this.isLoading = false;
          this.button = 'Verify & Enter';
        });



  }
  openMobileOtp(){

    this.dialogRef.close(this.dialogRef);

    const dialogRef = this.dialog.open(EnterMobilenumComponent, { panelClass: 'otp-modal-main' });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  openResendOtp() {

    this.loader = true;
    let payload = {
      mobile: this.data.mobile,
      countryCode: this.data.counctrycode
    }
    this.http.sendMobileOtp(ApiUrl.varifyotpmobile, payload, false)
      .subscribe(data => {
        let response: any = data;
      
        if(response.statusCode==200){
          this.toastr.success('otp resend successfully', 'success', {
            timeOut: 2000
          });
    
        }else{
          this.toastr.error('otp not send', 'Major Error', {
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
