import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss']
})
export class AddBillComponent implements OnInit {

  editBill: FormGroup;
  submitted = false;
  filterName: any;
  amount: any;
  isbtnSelected: any = 1;
  transactionType: any = 'IN'
  isApiCalling: boolean = false;
  groupId: any;
  type: any = 'PAYER';
  className: any;
  budgets: any;
  classes: any;
  pageIndex: any = 0;
  accountList: any;
  categories: any;
  payeesArray: any;

  constructor(
    public sharedserive: SharedService,
    public http: HttpService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.editBill = this.formBuilder.group({
      transactionType: [this.transactionType],
      beneficiaryType: [this.type],
      amount: this.amount,
      beneficiaryId: ['', Validators.required],
      accountId: ['', Validators.required],
      classId: ['', Validators.required],
      dateTime: ['', Validators.required],
      categoryId: ['', Validators.required],
      chequeNumber: ['', Validators.required],
      financialSourceId: ['', Validators.required],
      autopay: [Boolean],
      groupId: [''],
      note: ['']
    });
  }

  get f() { return this.editBill.controls; }

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

  billTypeChange(type) {
    switch (type) {
      case 'IN':
        this.isbtnSelected = 1;
        this.transactionType = "IN";
        this.type = "PAYER";
        this.editBill.controls.transactionType.setValue(this.transactionType);
        this.editBill.controls.beneficiaryType.setValue('PAYER');
        this.getPayeeList();
        this.getCategoriesData();
        this.getBudgets();
        break;
      case 'OUT':
        this.isbtnSelected = 2;
        this.transactionType = "OUT"
        this.type = "PAYEE";
        this.editBill.controls.transactionType.setValue('OUT');
        this.editBill.controls.beneficiaryType.setValue('PAYEE');
        this.getPayeeList();
        this.getCategoriesData();
        this.getBudgets();
        break;
    }
  }

  saveClass() {

    this.filterName = '';

    if (this.className != "") {

      var payload = {
        "groupId": this.groupId,
        "name": this.className,
      }
      this.isApiCalling = true;
      this.http.addAccountType(ApiUrl.classes, payload, false)
        .subscribe(res => {
          this.isApiCalling = false;
          let response = res;
          if (response.statusCode == 200) {
            this.className = "";
            this.toastr.success('Class added successfully', 'success', {
              timeOut: 2000
            });

          }

          this.getClasses();
        });

    } else {
      alert('please add class name')
    }
  }

  addclass(value) {
    this.className = value;
  }

  onSubmit() {
    debugger
    this.submitted = true;

    console.log(this.editBill.value);

    const data = {
      "amount": this.amount,
      "beneficiaryId": this.editBill.value.beneficiaryId,
      "accountId": this.editBill.value.accountId,
      "groupId": this.groupId,
      "categoryId": this.editBill.value.categoryId,
      "dueDate": new Date(this.editBill.value.dateTime),
      "repeat": false,
      "classId": this.editBill.value.categoryId,
      "remind": true,
      "autoPay": this.editBill.value.autopay,
      "financialSourceId": this.editBill.value.financialSourceId,
      "note": this.editBill.value.note,
      "transactionType": this.editBill.value.transactionType
    }

    console.log(data);

    // stop here if form is invalid
    // if (this.editBill.invalid) {
    //   return;
    // }
    if (this.amount) {
      this.editBill.controls.amount.setValue(this.amount);
      this.isApiCalling = true;

      this.http.post(ApiUrl.addBill, data, false)
        .subscribe(res => {
          this.isApiCalling = false;
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Bill added successfully', 'success', {
              timeOut: 2000
            });
          }
        },
          () => {
            this.isApiCalling = false;
          });

    }
  }


}
