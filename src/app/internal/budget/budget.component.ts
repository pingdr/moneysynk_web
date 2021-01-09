import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { AddBudgetModalComponent } from 'src/app/shared/modals/add-budget-modal/add-budget-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';
import { TransferModalComponent } from 'src/app/shared/modals/transfer-modal/transfer-modal.component';
import { Router } from '@angular/router';
import { Budget } from 'src/app/services/CustomPaginatorConfiguration';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: Budget() }
  ]
})
export class BudgetComponent implements OnInit {
  budgetName: any;
  budgetId: any;
  groupId: any;

  isApiCalling: boolean = false;
  isShimmerloading: boolean = false;
  budgetDetailsShimmer = true

  type: any = "EXPENSE";
  budgetSummary: any = [];
  expenseArray: any = [];
  incomeArray: any = [];
  budgets: any = [];
  budgetDetails: any = [];
  recordSelected: any = 0;
  resultsLength: any = 0;
  pageIndex: any = 0;
  bname: any;
  selectedBudgetId: string = '';

  budgetDetailPageIndex: any = 0;
  budgetDetailPageIndexTotal: any = 0;

  searchChangeEventSubscription: Subscription;

  dialogRefofOtpModal: MatDialogRef<AddBudgetModalComponent>;
  constructor(
    public http: HttpService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public sharedserive: SharedService,
    public dialog: MatDialog,
    public _router: Router
  ) { }

  ngOnInit(): void {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;

      this.budgetSummary = [];
      this.expenseArray = [];
      this.incomeArray = [];
      this.budgets = [];
      this.budgetDetails = [];

      this.pageIndex = 0;
      this.bname = '';
      this.selectedBudgetId = '';

      this.budgetDetailPageIndex = 0;
      this.budgetDetailPageIndexTotal = 0;

      if (data) {
        this.getBudgets();
        this.getPayeeSummary();
      }
    });


    this.searchChangeEventSubscription = this.sharedserive.searchDataChange.subscribe((data) => {
      console.log('subscribe Data', data);
      if (data) {
        this.searchData(data);
      } else {
        this.getBudgets();
        this.getPayeeSummary();
      }
    })
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  selectRecord(i, b) {
    this.budgetDetailsShimmer = true
    if (i || i == 0)
      this.recordSelected = i;
    this.bname = b.name;
    this.selectedBudgetId = b._id;
    this.budgetDetailPageIndexTotal = 0;
    this.getBudgetDetailsById(b._id)

  }

  getBudgetDetailsById(id) {

    this.isApiCalling = true;
    var payload = {
      year: 1,
      groupId: this.groupId,
      type: this.type == 'EXPENSE' ? 'OUT' : 'IN',
      financialSourceId: id,
      limit: 5,
      pageIndex: this.budgetDetailPageIndex
    }

    this.http.get(ApiUrl.budgetMonths, payload).subscribe((res) => {
      this.budgetDetailsShimmer = false
      console.log('Budget List Details=====>', res);
      if (res.data.length != 0) {
        this.budgetDetailPageIndexTotal = res.data[0].totalTransaction;
        this.budgetDetails = res.data;
      } else {
        this.budgetDetailPageIndexTotal = 0;
        this.budgetDetails = [];
      }

      this.isApiCalling = false;
    })
  }

  deleteBudget(id, budgetName) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'deleteBudget', title: 'Budget', id: id, name: budgetName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getBudgets();
    });
  }

  editTransaction(d) {
    this._router.navigate(['/update-entry/' + d._id]);
  }

  convertNumberinPositive(num) {
    return Math.abs(num);
  }

  transactionMonth(month, year) {
    let today = new Date()
    today.setMonth(month - 1);
    today.setUTCFullYear(year);
    return today;
  }

  closeDeleteModal() {
    this.dialog.closeAll();
  }

  getBudgets() {

    this.isApiCalling = true;
    this.isShimmerloading = true;

    if (this.groupId) {
      var payload = {
        "groupId": this.groupId,
        pageIndex: this.pageIndex,
        limit: 10,
        "type": this.type
      }
      this.recordSelected = 0;
      this.http.getCategories(ApiUrl.getBudget, payload).subscribe(res => {

        this.isApiCalling = false;
        this.isShimmerloading = false;

        this.http.showLoader();
        console.log('Budget List', res);
        if (res.data != undefined) {
          // this.budgets = res.data.data;
          this.resultsLength = res.data.totalFinancialSources;
          if (this.type === "EXPENSE") {
            this.expenseArray = res.data.data;
            this.bname = this.expenseArray[0].name;
            this.selectedBudgetId = this.expenseArray[0]._id;
            this.getBudgetDetailsById(this.expenseArray[0]._id);
          } else {
            this.incomeArray = res.data.data;
            console.log('-------------------------', this.incomeArray);
            this.bname = this.incomeArray[0].name;
            this.selectedBudgetId = this.expenseArray[0]._id;
            this.getBudgetDetailsById(this.incomeArray[0]._id);
          }
        }
      });
    }
  }

  pageChange(event) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.getBudgets();
  }

  budgetPageChangeDetail(event) {
    console.log(event);
    this.budgetDetailPageIndex = event.pageIndex;
    this.getBudgetDetailsById(this.selectedBudgetId)
  }

  getPayeeSummary() {
    this.isApiCalling = true;

    if (this.groupId) {
      var payload = {
        "groupId": this.groupId,
      }

      this.http.get(ApiUrl.getBudgetSummary, payload).subscribe((res) => {
        this.isApiCalling = false;
        this.http.showLoader();
        console.log('Budget Summary Data', res);
        if (res && res.data) {
          this.budgetSummary = res.data;
        }
      });
    }
  }

  nextStep() {
    this.step++;
  }
  setType(type) {
    this.pageIndex = 0;
    this.recordSelected = 0;
    this.type = type;

    this.budgetSummary = [];
    this.expenseArray = [];
    this.incomeArray = [];
    this.budgets = [];
    this.budgetDetails = [];

    this.pageIndex = 0;
    this.bname = '';
    this.selectedBudgetId = '';

    this.budgetDetailPageIndex = 0;
    this.budgetDetailPageIndexTotal = 0;

    this.getBudgets();
  }
  prevStep() {
    this.step--;
  }

  openEditmodal(objData): void {
    const dialogRef = this.dialog.open(AddBudgetModalComponent, {
      width: '976px',
      panelClass: 'edit-account-main', data: { type: this.type, groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getBudgets();
    });
  }

  editBudget(objBudget) {
    console.log(objBudget);
    const dialogRef = this.dialog.open(AddBudgetModalComponent, {
      width: '976px',
      panelClass: 'edit-account-main', data: { type: objBudget.type, groupId: objBudget.groupId, objBudget: objBudget }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getBudgets();
    });
  }

  getExpanseValue(b) {
    let temp = 100 * b.expenseTotal;
    let sum = temp / b.amount;
    return 100 - sum;
  }

  getIncomeValue(b) {
    let temp = 100 * b.incomeTotal;
    let sum = temp / b.amount;
    return 100 - sum;
  }

  openTransferModal() {
    const dialogRef = this.dialog.open(TransferModalComponent, {
      width: '976px',
      panelClass: 'edit-account-main', data: { type: this.type, groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  searchData(searchValue) {
    const payload = {
      'type': this.type,
      'groupId': this.groupId,
      'value': searchValue
    }

    this.isApiCalling = true;
    this.isShimmerloading = true;

    this.http.get(ApiUrl.searchBudget, payload).subscribe((res) => {

      console.log(res)

      this.isApiCalling = false;
      this.isShimmerloading = false;

      this.resultsLength = res.data.totalFinancialSources;
      if (this.type === "EXPENSE") {
        this.expenseArray = res.data;
        this.bname = this.expenseArray[0].name;
        this.selectedBudgetId = this.expenseArray[0]._id;
        this.getBudgetDetailsById(this.expenseArray[0]._id);
      } else {
        this.incomeArray = res.data;
        console.log('-------------------------', this.incomeArray);
        this.bname = this.incomeArray[0].name;
        this.selectedBudgetId = this.expenseArray[0]._id;
        this.getBudgetDetailsById(this.incomeArray[0]._id);
      }
    });
  }

}
