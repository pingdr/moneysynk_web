import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss']
})
export class AddBillComponent implements OnInit {

  selected = 'option2';
  editentry: FormGroup;
  submitted = false;
  isbtnSelected: any = 1;
  isApiCalling: boolean = false;
  groupId: any;
  pageIndex: any = 0;
  payeesArray: any;
  categories: any;
  accountList: any;
  classes: any;
  filterName: any;
  className: any;
  type: any = 'PAYER'
  amount: any;
  budgets: any;
  transactionType: any = 'IN'
  amountdata = false

  isSpinnerLoading: boolean = false;

  public entryModal: any = {};

  constructor(
    private formBuilder: FormBuilder, private toastr: ToastrService, public sharedserive: SharedService, public http: HttpService, public router: Router
  ) {

    this.editentry = this.formBuilder.group({
      transactionType: [this.transactionType],
      beneficiaryType: [this.type],
      amount: [''],
      beneficiaryId: ['', Validators.required],
      // Never: ['', Validators.required],
      accountId: ['', Validators.required],
      classId: [''],
      dateTime: ['', Validators.required],
      categoryId: ['', Validators.required],
      chequeNumber: ['', Validators.required],
      financialSourceId: [''],
      autopay: [Boolean],
      groupId: [''],
      note: ['', Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      if (data) {
        this.editentry.controls.groupId.setValue(data);
        this.getPayeeList();
        this.getCategoriesData();
        this.getAccountdata();
        this.getClasses();
        this.getBudgets();
      }
    });
  }

  get f() { return this.editentry.controls; }


  addclass(value) {
    this.className = value;
  }

  saveClass() {
    this.filterName = '';

    if (this.className != "") {

      var regex = new RegExp("[a-zA-Z][a-zA-Z ]*");

      if (!regex.test(this.className)) {
        this.toastr.error('Please enter valid class name', 'Invalid');
      } else {

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

      }

    } else {
      this.toastr.error('Please enter class name', 'Empty');
    }
  }

  billTypeChange(type) {
    switch (type) {
      case 'IN':
        this.isbtnSelected = 1;
        this.transactionType = "IN";
        this.type = "PAYER";
        this.editentry.controls.transactionType.setValue(this.transactionType);
        this.editentry.controls.beneficiaryType.setValue('PAYER');
        this.getPayeeList();
        this.getCategoriesData();
        this.getBudgets();
        break;
      case 'OUT':
        this.isbtnSelected = 2;
        this.transactionType = "OUT"
        this.type = "PAYEE";
        this.editentry.controls.transactionType.setValue('OUT');
        this.editentry.controls.beneficiaryType.setValue('PAYEE');
        this.getPayeeList();
        this.getCategoriesData();
        this.getBudgets();
        break;
    }
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
      console.log(res);
      if (res.data != undefined) {
        this.budgets = res.data.data;
      }
    });
  }
  getClasses() {
    var payload = {
      "groupId": this.groupId,
      // pageIndex: this.pageIndex,
      // limit: 20,
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
      }
    });
  }

  onSubmit() {

    this.submitted = true;


    // stop here if form is invalid
    if (this.editentry.invalid) {
      return false;
    }

    if (this.amount == undefined) {

      this.toastr.error('please enter bill amount', 'error', {
        timeOut: 2000
      });

    }


    const data = {
      "amount": this.amount,
      "beneficiaryId": this.editentry.value.beneficiaryId,
      "accountId": this.editentry.value.accountId,
      "groupId": this.groupId,
      "categoryId": this.editentry.value.categoryId,
      "dueDate": new Date(this.editentry.value.dateTime),
      "repeat": false,
      "classId": this.editentry.value.categoryId,
      "remind": "2020-10-31T00:00:00.000+00:00",
      "autoPay": this.editentry.value.autopay,
      "financialSourceId": this.editentry.value.financialSourceId,
      "note": this.editentry.value.note,
      "transactionType": this.editentry.value.transactionType
    }

    console.log(data);



    if (this.amount) {
      this.editentry.controls.amount.setValue(this.amount);
      this.isApiCalling = true;
      this.isSpinnerLoading = true;

      this.http.post(ApiUrl.addBill, data, false)
        .subscribe(res => {
          this.isApiCalling = false;
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Bill added successfully', 'success', {
              timeOut: 2000
            });
            this.router.navigate(['/bill-list']);
          }

          this.isSpinnerLoading = false;
        },
          () => {
            this.isApiCalling = false;
            this.isSpinnerLoading = false;
          });
    }
  }




}
