import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit {

  selected = 'option2';
  editentry: FormGroup;
  submitted = false;
  isbtnSelected: any = 1;
  isApiCalling: boolean = false;
  groupId: any;
  pageIndex: any = 0;
  payeesArray: any;
  categories: any;
  accountList:any;
  public entryModal: any = {};
  constructor(private formBuilder: FormBuilder, public sharedserive: SharedService, public http: HttpService,) {

    this.editentry = this.formBuilder.group({
      Usdollar: ['', Validators.required],
      Never: ['', Validators.required],
      Addaccount: ['', Validators.required],
      Addclass: ['', Validators.required],
      Category: ['', Validators.required],
      Check: ['', Validators.required],
      Budget: ['', Validators.required]

    });
  }



  billTypeChange(type) {
    switch (type) {
      case 'IN':
        this.isbtnSelected = 1;
        break;
      case 'OUT':
        this.isbtnSelected = 2
        break;
    }
  }
  ngOnInit() {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      if (data) {
        this.getPayeeList();
        this.getCategoriesData();
        this.getAccountdata();
      }
    });
  }
  getAccountdata() {
    var payload = {
      "groupId": this.groupId,
      pageIndex: this.pageIndex,
      limit: 20,
    }

    this.isApiCalling = true;
    this.http.getAccount(ApiUrl.getAccount, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data != undefined) {
        this.accountList = res.data.data;
        // this.filter = res.data;
      }
    });

  }
  getCategoriesData() {
    this.isApiCalling = true;
    var payload = {
      "groupId": this.groupId,
      "pageIndex": this.pageIndex,
      "limit": 20,
    }
    this.http.getCategories(ApiUrl.getCategories, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data.data != undefined) {
        // this.total = res.data.totalCategories;
        this.categories = res.data.data;
      }

    });

  }
  getPayeeList() {
    this.isApiCalling = true;
    var payload = {
      "groupId": this.groupId,
      "pageIndex": this.pageIndex,
      "limit": 10,
      type: 'PAYEE'
    }
    this.http.get(ApiUrl.getAllPayees, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data.data != undefined) {
        this.payeesArray = res.data.data;
        //  else {
        //   this.payersArray = res.data.data;
        // }
        // this.total = res.data.totalFinancialBeneficiaries;
      }
    });
  }
  get f() { return this.editentry.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editentry.invalid) {
      return;
    }

    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.editaccount.value, null, 4));
  }



}
