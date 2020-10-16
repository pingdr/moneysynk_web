import { Component, OnInit, Inject } from '@angular/core';
import { AccountsComponent } from 'src/app/internal/accounts/accounts.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { constants } from 'buffer';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { ToastrService } from 'ngx-toastr';
import { TableModel } from '../../models/table.common.model';

@Component({
  selector: 'app-add-edit-account',
  templateUrl: './add-edit-account.component.html',
  styleUrls: ['./add-edit-account.component.scss']
})
export class AddEditAccountComponent implements OnInit {
  selected = 'option2';
  editaccount: FormGroup;
  submitted = false;
  public loader = false;
  accountType: any;
  accountModel=[];
  myModel: TableModel;
  search = new FormControl();

  constructor(private formBuilder: FormBuilder,
    public http: HttpService, private toastr: ToastrService) {

    this.editaccount = this.formBuilder.group({
      groupId: [''],
      name: ['', Validators.required],
      accountNo: ['', Validators.required],
      currency: ['', Validators.required],
      openDate: ['', Validators.required],
      openingBalance: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      accountType: ['', Validators.required],
      website: ['', [Validators.required, Validators.pattern(this.http.CONSTANT.WebsiteUrl)]],
      icon: ['office_icon', Validators.required],
      note: ['', Validators.required]
    });



  }



  ngOnInit(): void {
   
    this.getAllAccountType();

  }

  getAllAccountType(){

    this.http.getAllAccountType(ApiUrl.getAllAccountType).subscribe(res => {
      if(res.data!=undefined){
        this.accountModel = res.data;
      }
  });

  }



  get f() { return this.editaccount.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editaccount.invalid) {
      return;
    }

    var payload = {

      "groupId": "5f69df929af94d089d937622",
      "name": this.editaccount.value.name,
      "accountNo": this.editaccount.value.accountNo,
      "currency": this.editaccount.value.currency,
      "openDate": this.editaccount.value.openDate._d,
      "openingBalance": this.editaccount.value.openingBalance,
      "phoneNumber": this.editaccount.value.phoneNumber,
      "accountType": this.editaccount.value.accountType,
      "website": this.editaccount.value.website,
      "icon": this.editaccount.value.icon,
      "note": this.editaccount.value.note


    }
    console.log(payload);

    this.loader = true;
    this.http.addEditAccount(ApiUrl.addEditAccount, payload, false)
      .subscribe(res => {
        let response = res;
        if (response.statusCode == 200) {
          this.toastr.success('Account added successfully', 'success', {
            timeOut: 2000
          });
        }
        this.http.hideModal();
      },
        () => {
          this.loader = false;
        });


  }

  addType(value) {
    this.accountType = value;
  }

  saveType() {

    if (this.accountType != null) {

      var payload = {

        "groupId": "5f69df929af94d089d937622",
        "name": this.accountType,

      }
      this.loader = true;
      this.http.addAccountType(ApiUrl.addAccountType, payload, false)
        .subscribe(res => {
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Account Type added successfully', 'success', {
              timeOut: 2000
            });
            
          }
          this.getAllAccountType();
        });

    }else{
      alert('please add account Type')
    }
  }
}