import { Component, Inject, OnInit, ViewChild,  } from '@angular/core';
import { EnterMobilenumComponent } from '../enter-mobilenum/enter-mobilenum.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordComponent } from '../change-password/change-password.component';


 
@Component({
  selector: 'app-email-otp',
  templateUrl: './email-otp.component.html',
  styleUrls: ['./email-otp.component.scss']
})
export class EmailOtpComponent implements OnInit {

  public loader = false;
  email:any;
  forgoteEmail:any;
  
  dialogRefofOtpModal :MatDialogRef<EnterMobilenumComponent>;
 
  constructor(public dialog: MatDialog,public http: HttpService,private toastr: ToastrService,
    public dialogRef: MatDialogRef<EmailOtpComponent>,@Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(): void {

    this.email = localStorage.getItem('otpemail');
    this.forgoteEmail = localStorage.getItem('otpForgot');
    
    console.log('this.forgoteEmail');
    console.log(this.forgoteEmail);
    
  }
  otp: string;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput:any;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '30px',
      'height': '30px',
    }
  };

  onOtpChange(otp) {
    this.otp = otp;
  }

  resendOtp(){


    this.http.sendEmail(ApiUrl.requestotp, this.email, false)
    .subscribe(data => {
      let response: any = data;

      if (response.statusCode == 200) {
        this.toastr.success('otp send successfully', 'success', {
          timeOut: 2000
        });
        localStorage.setItem('otpemail', this.email);
      } else {
        this.toastr.error('otp not send', ' Error', {
          timeOut: 3000
        });
      }

    },
      () => {
        console.log('failed');
        this.loader = false;
      });

    

  }






  openOtpmodal() {

    this.loader = true;
    this.http.verifyOtp(ApiUrl.varifyotp,this.email,this.otp, false)
        .subscribe(data => {
          console.log(data);
          let response: any = data;
          if(response.statusCode==200){

            if(this.data.isforgot){

              this.dialogRef.close(this.dialogRef);
              const dialogRef = this.dialog.open(ChangePasswordComponent, {panelClass: 'otp-modal-main'});
             
          
            dialogRef.afterClosed().subscribe(result => {
              console.log(`Dialog result: ${result}`);
            });

            }else{

            this.dialogRef.close(this.dialogRef);
      const dialogRef = this.dialog.open(EnterMobilenumComponent, {panelClass: 'otp-modal-main'});
      this.toastr.success('otp verify successfully', 'success', {
        timeOut: 2000
      });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

          }
    
               
            },
            () => {
          
                this.loader = false;
            });


   
  }
  
}
