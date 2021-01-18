import { Component, OnInit, Inject } from '@angular/core';
import { AccountsComponent } from 'src/app/internal/accounts/accounts.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { constants } from 'buffer';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { ToastrService } from 'ngx-toastr';
import { TableModel } from '../../models/table.common.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
  accountType: any = "";
  accountModel: any = [];
  myModel: TableModel;
  search = new FormControl();
  minDate;
  addEditLable: any;
  group_id: any;
  icons: any;
  public modeselect = 'Dollar';
  filterName: any;
  groupId: any;
  isApiCalling: boolean = false;;
  isSelected: any = 0;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public http: HttpService, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddEditAccountComponent>) {

    this.minDate = new Date();

    if (this.data.editdata != undefined) {
      console.log(this.data.editdata);
      this.editaccount = this.formBuilder.group({
        name: [this.data.editdata.name, Validators.required],
        accountNo: [this.data.editdata.accountNo, Validators.required],
        currency: ['Dollar'],
        openDate: [this.data.editdata.openDate, Validators.required],
        currentBalance: [this.data.editdata.currentBalance, Validators.required],
        phoneNumber: [this.data.editdata.phoneNumber],
        accountType: [this.data.editdata.accountType, Validators.required],
        website: [this.data.editdata.website, [Validators.pattern(this.http.CONSTANT.WebsiteUrl)]],
        icon: [this.data.editdata.icon],
        note: [this.data.editdata.note]
      });
      this.editaccount.controls.currentBalance.disable({onlySelf:true})
    } else {
      this.editaccount = this.formBuilder.group({
        name: ['', Validators.required],
        accountNo: ['', Validators.required],
        currency: ['Dollar'],
        openDate: ['', Validators.required],
        currentBalance: ['', Validators.required],
        phoneNumber: [''],
        accountType: ['', Validators.required],
        website: ['', [Validators.pattern(this.http.CONSTANT.WebsiteUrl)]],
        icon: [''],
        note: ['']
      });

    }

  }



  ngOnInit(): void {
    this.groupId = this.data.groupId;
    this.getAllAccountType();
    this.addEditLable = this.data.editdata;
    this.getAllIcon();



  }
  getAllIcon() {
    this.isApiCalling = true;
    this.http.get(ApiUrl.icons).subscribe((res) => {
      this.isApiCalling = false;
      this.icons = res.data;
      if (this.data.editdata != undefined) {
        this.isSelected = this.icons.findIndex(x => x.path === this.data.editdata.icon);
      }
    })
  }
  getAllAccountType() {

    var payload = {
      "groupId": this.groupId
    }
    this.isApiCalling = true;
    this.http.getAllAccountType(ApiUrl.getAllAccountType, payload).subscribe(res => {
      this.isApiCalling = false;
      if (res.data != undefined) {
        this.accountModel = res.data;
        if (this.data.editdata == undefined) {
          this.editaccount.controls.accountType.setValue(this.accountModel[0]._id);
        }
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

    if (this.data.editdata == undefined) {

      if(this.editaccount.value.icon == ''){
       
        var imageIcon = this.icons[0].path

      }
      else{

        var imageIcon = this.editaccount.value.icon
       
      }

      var payload = {

        "groupId": this.groupId,
        "name": this.editaccount.value.name,
        "accountNo": this.editaccount.value.accountNo,
        "currency": this.editaccount.value.currency,
        "openDate": this.editaccount.value.openDate._d,
        "currentBalance": this.editaccount.value.currentBalance,
        "phoneNumber": this.editaccount.value.phoneNumber,
        "accountType": this.editaccount.value.accountType,
        "website": this.editaccount.value.website,
        "icon": imageIcon,
        "note": this.editaccount.value.note


      }


      this.loader = true;
      this.isApiCalling = true;
      this.http.addEditAccount(ApiUrl.addEditAccount, payload, false)
        .subscribe(res => {
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Account added successfully', 'success', {
              timeOut: 2000
            });
            this.isApiCalling = false;
          }
          this.dialogRef.close(this.dialogRef);
          this.http.navigate('accounts');

        },
          () => {
            this.loader = false;
            this.isApiCalling = false;
          });
    } else {

      var payload = {

        "groupId": this.groupId,
        "name": this.editaccount.value.name,
        "accountNo": this.editaccount.value.accountNo,
        "currency": this.editaccount.value.currency,
        "openDate": this.editaccount.value.openDate._d,
        "currentBalance": this.data.editdata.currentBalance,
        "phoneNumber": this.editaccount.value.phoneNumber,
        "accountType": this.editaccount.value.accountType,
        "website": this.editaccount.value.website,
        "icon": this.editaccount.value.icon,
        "note": this.editaccount.value.note


      }


      this.loader = true;
      this.isApiCalling = true;
      this.http.updateAccount(ApiUrl.updateAccount, this.data.editdata._id, payload, false)
        .subscribe(res => {
          this.isApiCalling = false;
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Account updated successfully', 'success', {
              timeOut: 2000
            });
          }
          this.dialogRef.close(this.dialogRef);
          this.http.navigate('accounts');
        },
          () => {
            this.loader = false;
            this.isApiCalling = false;
          });

    }

  }

  addType(value) {
    this.accountType = value;
  }
  selectIcon(i, path) {
    if (i || i == 0)
      this.isSelected = i;
    this.editaccount.controls.icon.setValue(path);
  }
  saveType() {
    this.filterName = '';

    if (this.accountType != "") {

      var payload = {

        "groupId": this.groupId,
        "name": this.accountType,

      }
      this.loader = true;
      this.http.addAccountType(ApiUrl.addAccountType, payload, false)
        .subscribe(res => {
          let response = res;
          if (response.statusCode == 200) {
            this.accountType = "";
            this.toastr.success('Account type added successfully', 'success', {
              timeOut: 2000
            });

          }

          this.getAllAccountType();
        });

    } else {
      alert('Please add account Type')
    }
  }

  hideModal() {
    this.dialogRef.close(this.dialogRef);
  }


}