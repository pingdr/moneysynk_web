import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, VERSION } from '@angular/core';
import { TestService } from './test.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { VerifyMobileOtpComponent } from '../verify-mobile-otp/verify-mobile-otp.component';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-enter-mobilenum',
  templateUrl: './enter-mobilenum.component.html',
  styleUrls: ['./enter-mobilenum.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TestService],
})
export class EnterMobilenumComponent implements OnInit {

  addmobile: FormGroup;
  submitted = false;
  mobile: any;
  public loader = false;
  isValidFormSubmitted = null;
  dialogRefofOtpModal: MatDialogRef<VerifyMobileOtpComponent>;

  public form: FormGroup;
  constructor(private testService: TestService,
    public http: HttpService, public dialog: MatDialog, private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EnterMobilenumComponent>,
    private toastr: ToastrService) {
    this.testService.initializeForm();
  }

  ngOnInit(): void {

    this.addmobiles();

  }

  // get f() { return this.addmobile.controls; }

  addmobiles() {
    // this.addmobile = this.formBuilder.group({
    //   mobile_no: ['',Validators.maxLength(10),Validators.minLength(10)],
    //   countryCode: ['']
    // });
    this.addmobile = new FormGroup({
      mobile_no: new FormControl(''),
      countryCode: new FormControl(''),
    })
  }

  applyFilter(filterValue: any) {
    this.mobile = filterValue;
  }
  countryChangedEvent(event) {
    console.log(event);
    this.addmobile.get('countryCode').setValue(event.dialCode)

  }
  save() {
    this.isValidFormSubmitted = true;
    console.log(this.addmobile.get('mobile_no').errors);
    
    if (this.addmobile.get('mobile_no').errors) {
      return;
    }
    
    this.dialogRef.close(this.dialogRef);

    this.loader = true;
    let payload = {
      mobile: this.mobile,
      countryCode: "+" + this.addmobile.get('countryCode').value
    }
    this.http.sendMobileOtp(ApiUrl.varifyotpmobile, payload, false)
      .subscribe(data => {
        let response: any = data;
      
        console.log(response);
        if (response.statusCode == 200) {

          this.toastr.success('otp send successfully', 'success', {
            timeOut: 2000
          });
          const dialogRef = this.dialog.open(VerifyMobileOtpComponent, { panelClass: 'otp-modal-main',
          data: { mobile: payload.mobile,counctrycode:payload.countryCode } });


          dialogRef.afterClosed().subscribe(result => {
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

  openOtpmodal() {
    const dialogRef = this.dialog.open(VerifyMobileOtpComponent, { panelClass: 'otp-modal-main' });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
