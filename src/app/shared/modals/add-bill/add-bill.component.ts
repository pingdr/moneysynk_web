import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { SharedService } from 'src/app/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss']
})
export class AddBillComponent implements OnInit {


  editaccount: FormGroup;
  isApiCalling: boolean = false;
  groupId: any;
  type: any = 'PAYER';
  budgets: any;
  classes: any;
  pageIndex: any = 0;
  accountList: any;
  categories: any;
  payeesArray: any;

  classList = [
    {
      "id": 1,
      "name": "CLASS 1"
    },
    {
      "id": 1,
      "name": "CLASS 2"
    },
  ];

  payeeList: any = [
    {
      'payeeName': 'Payee1'
    },
    {
      'payeeName': 'Payee2'
    },
    {
      'payeeName': 'Payee3'
    },
  ];


  constructor(
    public dialogRef: MatDialogRef<AddBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedserive: SharedService,
    public http: HttpService,
    private formBuilder: FormBuilder
  ) {
    this.editaccount = this.formBuilder.group({
      beneficiaryType: [this.type],
      amount: [''],
      beneficiaryId: ['', Validators.required],
      accountId: ['', Validators.required],
      classId: ['', Validators.required],
      dateTime: ['', Validators.required],
      categoryId: ['', Validators.required],      
      financialSourceId: ['', Validators.required],      
      groupId: [''],
      note: ['']
    });

  }

  get f() { return this.editaccount.controls; }


  ngOnInit(): void {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      if (data) {
        // this.editentry.controls.groupId.setValue(data);
        this.getPayeeList();
        this.getCategoriesData();
        this.getAccountdata();
        this.getClasses();
        this.getBudgets();
      }
    });
  }

  getBudgets() {
    this.isApiCalling = true;
    var payload = {
      "groupId": this.groupId,
      type: this.type === 'PAYEE' ? 'EXPENSE' : 'INCOME'
    }

    this.http.getCategories(ApiUrl.getBudget, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      console.log("Budget Response", res);
      if (res.data != undefined) {
        this.budgets = res.data.data;
      }
    });
  }

  getClasses() {
    var payload = {
      "groupId": this.groupId
    }

    this.isApiCalling = true;
    this.http.getAccount(ApiUrl.classes, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data != undefined) {
        this.classes = res.data;
        // this.filter = res.data;
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
      type: this.type === 'PAYEE' ? 'EXPENSE' : 'INCOME'
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
      type: this.type
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

  onSubmit() {

  }

}
