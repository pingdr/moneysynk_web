import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  accountList: any;
  classes: any;
  filterName: any;
  className: any;
  type: any = 'PAYER'
  amount: any;
  budgets: any;
  transactionType: any = 'IN'
  public entryModal: any = {};

  public accountEntryDetail: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public sharedserive: SharedService,
    public http: HttpService,
    public activatedRouter: ActivatedRoute,
    public router: Router
  ) {

    this.editentry = this.formBuilder.group({
      transactionType: [this.transactionType],
      beneficiaryType: [this.type],
      amount: [''],
      beneficiaryId: ['', Validators.required],
      // Never: ['', Validators.required],
      accountId: ['', Validators.required],
      classId: ['', Validators.required],
      dateTime: ['', Validators.required],
      categoryId: ['', Validators.required],
      chequeNumber: ['', Validators.required],
      financialSourceId: ['', Validators.required],
      cleared: [Boolean],
      groupId: [''],
      note: ['']
    });
  }
  addclass(value) {
    this.className = value;
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
  ngOnInit() {

    console.log('Activated Router -- - -- - - ', this.activatedRouter.snapshot.params['id']);
    if (this.activatedRouter.snapshot.params['id']) {
      this.getEntryBYId();
    }

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

  getEntryBYId() {
    let transactionId: any = this.activatedRouter.snapshot.params['id'];
    this.http.getEntryById('transactions?transactionId=' + transactionId).subscribe((res: any) => {
      if (res && res.data.data) {
        this.accountEntryDetail = res.data.data;
        this.editentry.controls.beneficiaryId.setValue(this.accountEntryDetail.beneficiaryId._id);
        this.editentry.controls.accountId.setValue(this.accountEntryDetail.accountId._id);
        this.editentry.controls.classId.setValue(this.accountEntryDetail.classId._id);
        this.editentry.controls.categoryId.setValue(this.accountEntryDetail.categoryId._id);
        this.editentry.controls.chequeNumber.setValue(this.accountEntryDetail.chequeNumber);
        this.editentry.controls.dateTime.setValue(this.accountEntryDetail.dateTime);
        this.editentry.controls.cleared.setValue(this.accountEntryDetail.cleared);
        this.editentry.controls.financialSourceId.setValue(this.accountEntryDetail.financialSourceId._id);
        this.editentry.controls.note.setValue(this.accountEntryDetail.note);

        this.amount = this.accountEntryDetail.amount;

        if (this.accountEntryDetail.transactionType == "IN") {
          this.isbtnSelected = 1;
        } else if (this.accountEntryDetail.transactionType == "OUT") {
          let elem = document.getElementById('minus-btn');
          elem.click();
          this.isbtnSelected = 2;
        } else {
          this.isbtnSelected = 3;
        }

        console.log('Account Detail', res.data.data);
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
  get f() { return this.editentry.controls; }

  onSubmit() {
    this.submitted = true;

    console.log(this.editentry.value);

    // stop here if form is invalid
    if (this.editentry.invalid) {
      return;
    }
    if (this.amount) {
      this.editentry.controls.amount.setValue(this.amount);
      this.isApiCalling = true;


      if (this.accountEntryDetail._id && this.accountEntryDetail._id != undefined) {
        this.http.post(ApiUrl.getTransactions + '/' + this.accountEntryDetail._id, this.editentry.value, false)
          .subscribe(res => {
            this.isApiCalling = false;
            let response = res;
            if (response.statusCode == 200) {
              this.toastr.success('Transaction Updated successfully', 'success', {
                timeOut: 2000
              });
              this.router.navigate(['/transactions']);
            }
          },
            () => {
              this.isApiCalling = false;
            });
      } else {
        this.http.post(ApiUrl.getTransactions, this.editentry.value, false)
          .subscribe(res => {
            this.isApiCalling = false;
            let response = res;
            if (response.statusCode == 200) {
              this.toastr.success('Transaction added successfully', 'success', {
                timeOut: 2000
              });
            }
          },
            () => {
              this.isApiCalling = false;
            });
      }

    } else {
      this.toastr.error('Please Add Amount.', 'error', {
        timeOut: 2000
      });
    }
    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.editaccount.value, null, 4));
  }



}
