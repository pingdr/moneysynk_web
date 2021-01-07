import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  childs: any = [];
  selectedChild: any
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
      amount: ['', Validators.required],
      beneficiaryId: ['', Validators.required],
      // Never: ['', Validators.required],
      accountId: ['', Validators.required],
      classId: [''],
      dateTime: ['', Validators.required],
      categoryId: ['', Validators.required],
      subCategoryId: [''],
      chequeNumber: [''],
      financialSourceId: [''],
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

    this.editentry.controls.categoryId.setValue('');
    this.editentry.controls.subCategoryId.setValue('');
    this.selectedChild = '';

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
        this.editentry.controls.amount.setValue(this.accountEntryDetail.amount);
        this.editentry.controls.accountId.setValue(this.accountEntryDetail.accountId._id);
        this.editentry.controls.classId.setValue(this.accountEntryDetail.classId._id);
        // this.editentry.controls.categoryId.setValue(this.accountEntryDetail.categoryId._id);
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

  setCategoryOrSubCategory(data) {
    if (this.accountEntryDetail.categoryId._id != undefined) {
      console.log('res================================', data)

      data.map((cat) => {
        if (cat._id === this.accountEntryDetail.categoryId._id) {
          if (cat.parent != null) {
            console.log("Selected Child Id", this.selectedChild);
            this.categories.map((parentCat) => {
              if (parentCat._id === cat.parent) {
                this.editentry.controls.categoryId.setValue(parentCat._id);
                this.parentSelected(parentCat._id);
                this.editentry.controls.subCategoryId.setValue(cat._id);
                this.selectedChild = cat._id;
                console.log(parentCat.name);
              }
            })
          } else {
            this.editentry.controls.categoryId.setValue(this.accountEntryDetail.categoryId._id);
          }
        }
      })

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
      //pageIndex: this.pageIndex,
      //limit: 20,
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
      // "pageIndex": this.pageIndex,
      // "limit": 20,
      type: this.type === 'PAYEE' ? 'EXPENSE' : 'INCOME'
    }
    this.http.getCategories(ApiUrl.getCategories, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data.data != undefined) {
        // this.total = res.data.totalCategories;
        this.categories = res.data.data;
        this.setCategoryOrSubCategory(res.data.data);
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

  parentSelected(event) {
    if (event.value) {
      console.log(event.value);
      this.childs = this.categories[this.categories.findIndex(x => x._id === event.value)].child;
    } else {
      console.log(event);
      this.childs = this.categories[this.categories.findIndex(x => x._id === event)].child;
    }
  }

  subSelected(event) {
    if (event.value != "") {
      this.selectedChild = event.value;
      console.log(this.selectedChild);
    } else {
      this.selectedChild = event;
      console.log(this.selectedChild);
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.editentry.invalid) {
      return;
    }

    if (this.selectedChild) {
      this.editentry.controls.categoryId.setValue(this.selectedChild);
    }

    console.log(this.editentry.value);

    this.editentry.removeControl('subCategoryId');


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

            this.router.navigate(['/transactions']);
          }
        },
          () => {
            this.isApiCalling = false;
          });
    }
    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.editaccount.value, null, 4));
  }



}
