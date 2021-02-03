import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { AddCategoryPopupComponent } from 'src/app/shared/modals/add-category-popup/add-category-popup.component';
import { HttpService } from 'src/app/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { SharedService } from 'src/app/services/shared.service';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Categories } from 'src/app/services/CustomPaginatorConfiguration';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: Categories() }
  ]
})
export class CategoriesComponent implements OnInit {

  categories: any;
  type: any = "EXPENSE"
  dialogRefofOtpModal: MatDialogRef<AddCategoryPopupComponent>;
  groupId: any;
  expenseArray: any = [];
  incomeArray: any = [];

  isApiCalling: boolean = false;
  isShimmerloading: boolean = false;
  isRecordAction: boolean = false;

  categoryId;
  categoryName;
  categoriesDetails: any = [];
  categorySummary: any = [];
  selectedCategoryId: string = '';
  cName: any;
  total: any;

  isSubCategoryRecord: number = null;

  MonthlyTotal: any = '';
  MonthlyIndexListTotal: any = '';
  monthlyPageIndex: any = 0;
  categoriesDetailsShimmer = true;


  pageIndex: any = 0;
  isDefault: boolean = true;

  searchChangeEventSubscription: Subscription;


  constructor(public http: HttpService, public activeRoute: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private _router: Router,
    public sharedserive: SharedService,
    private toastr: ToastrService,
    public dialog: MatDialog, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;

      this.categoriesDetails = [];
      this.categorySummary = [];
      this.monthlyPageIndex = 0;
      this.MonthlyIndexListTotal = 0;
      this.isSubCategoryRecord = null;
      this.categoriesDetailsShimmer = true;

      if (data) {
        this.getCategoriesData();
        this.getCategorySummary();
      }
    });

    this.searchChangeEventSubscription = this.sharedserive.searchDataChange.subscribe((data) => {
      console.log('subscribe Data', data);
      if (data) {
        this.searchData(data);
      }
    })
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }
  setType(type) {
    this.categoriesDetails = []
    this.categoriesDetailsShimmer = true;
    this.categoriesDetails = [];
    this.type = type;
    this.pageIndex = 0;
    this.monthlyPageIndex = 0;
    this.MonthlyIndexListTotal = 0;
    this.isSubCategoryRecord = null;
    this.getCategoriesData();
  }
  getCategoriesDetailsById(id) {
    this.isApiCalling = true;
    var payload = {
      groupId: this.groupId,
      year: 1,
      categoryId: id,
      type: this.type == 'EXPENSE' ? 'OUT' : 'IN',
      limit: 5,
      pageIndex: this.monthlyPageIndex
    }
    this.http.get(ApiUrl.categoryMonths, payload).subscribe((res) => {
      this.categoriesDetailsShimmer = false
      if (res.data.length != 0) {
        this.categoriesDetails = res.data;
        this.MonthlyIndexListTotal = res.data[0].totalTransaction;
        console.log(" Res1 ========>", this.MonthlyIndexListTotal);
        console.log(" Res1 ========>", res);
      } else {
        this.MonthlyIndexListTotal = 0;
        this.categoriesDetails = [];
      }

      this.isApiCalling = false;
    })
  }

  selectRecord(c) {
    if (!this.isRecordAction) {
      this.categoriesDetails = []
      this.categoriesDetailsShimmer = true
      console.log(c);
      this.cName = c.name;
      this.selectedCategoryId = c._id;
      this.isSubCategoryRecord = null;
      this.monthlyPageIndex = 0;
      this.getCategoriesDetailsById(c._id);

      this.isRecordAction = false;
    } else {
      this.isRecordAction = false;
    }
  }
  getCategoriesData() {
    this.isApiCalling = true;
    this.isShimmerloading = true;

    if (this.groupId) {
      var payload = {
        "groupId": this.groupId,
        "pageIndex": this.pageIndex,
        "limit": 10,
        parent: true,
        type: this.type
      }
      this.expenseArray = [];
      this.incomeArray = [];
      this.http.getCategories(ApiUrl.getCategories, payload).subscribe(res => {
        console.log("Category List", res);
        this.isApiCalling = false;
        this.isShimmerloading = false;
        this.http.showLoader();
        if (res.data.data != undefined) {
          this.total = res.data.totalCategories;
          if (this.type === "EXPENSE") {
            this.expenseArray = res.data.data;
            this.cName = this.expenseArray[0].name;
            this.selectedCategoryId = this.expenseArray[0]._id;
            this.getCategoriesDetailsById(this.expenseArray[0]._id);
          } else {
            this.incomeArray = res.data.data;
            this.cName = this.incomeArray[0].name;
            this.selectedCategoryId = this.incomeArray[0]._id;
            this.getCategoriesDetailsById(this.incomeArray[0]._id);
          }
        }
      });
    }

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

  editTransaction(d) {
    this._router.navigate(['/update-entry/' + d._id]);
  }

  getCategorySummary() {
    this.isApiCalling = true;
    if (this.groupId) {
      var payload = {
        "groupId": this.groupId,
      }

      this.http.getCategoriesSummary(ApiUrl.getCategorySummaryData, payload).subscribe((res) => {
        this.isApiCalling = false;
        this.http.showLoader();
        console.log('Category Summary Data', res);
        if (res && res.data) {
          this.categorySummary = res.data;
        }
      });
    }
  }

  getSubCategorySummaryData(c, j) {
    if (!this.isRecordAction) {
      this.categoriesDetails = []
      this.categoriesDetailsShimmer = true
      console.log(c, j);

      this.isSubCategoryRecord = j;
      this.getCategoriesDetailsById(c._id);
      this.isRecordAction = false;
    } else {
      this.isRecordAction = false;
    }
  }

  pageChange(event) {
    this.categoriesDetailsShimmer = true;
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.getCategoriesData();
  }

  pageDetailChange(event) {
    this.categoriesDetailsShimmer = true;
    console.log(event.pageIndex, this.selectedCategoryId);
    this.monthlyPageIndex = event.pageIndex;
    this.getCategoriesDetailsById(this.selectedCategoryId);
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  openCategorymodal(): void {
    const dialogRef = this.dialog.open(AddCategoryPopupComponent, {
      width: '523px',
      panelClass: 'edit-account-main', data: { type: this.type, groupId: this.groupId }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != "no") {
        console.log('The dialog was closed');
        this.incomeArray = [];
        this.expenseArray = [];
        this.getCategoriesData();
      }
    });
  }

  deleteCategory(id, categoryName) {
    this.isRecordAction = true;
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'deleteCategory', title: 'Category', id: id, name: categoryName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != "no") {
        console.log('The dialog was closed');
        this.getCategoriesData();
      }
    });
  }

  editCategory(objEditData) {
    this.isRecordAction = true;
    console.log(objEditData);

    const dialogRef = this.dialog.open(AddCategoryPopupComponent, {
      width: '523px',
      panelClass: 'edit-account-main', data: { type: this.type, groupId: this.groupId, objEditData: objEditData }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != 'no') {
        console.log('The dialog was closed');
        this.incomeArray = [];
        this.expenseArray = [];
        this.getCategoriesData();
      }
    });
  }

  closeAllModal() {
    this.dialog.closeAll();
  }

  searchData(searchValue) {

    const payload = {
      'type': this.type,
      'groupId': this.groupId,
      'value': searchValue
    }

    this.isApiCalling = true;
    this.isShimmerloading = true;


    this.expenseArray = [];
    this.incomeArray = [];
    this.http.getCategories(ApiUrl.searchCategory, payload).subscribe(res => {
      console.log("Category List", res);
      this.isApiCalling = false;
      this.isShimmerloading = false;

      this.http.showLoader();

      if (res.data != undefined) {
        this.total = res.data.totalCategories;
        if (this.type === "EXPENSE") {
          this.expenseArray = res.data;
          this.cName = this.expenseArray[0].name;
          this.selectedCategoryId = this.expenseArray[0]._id;
          this.getCategoriesDetailsById(this.expenseArray[0]._id);
        } else {
          this.incomeArray = res.data;
          this.cName = this.incomeArray[0].name;
          this.selectedCategoryId = this.incomeArray[0]._id;
          this.getCategoriesDetailsById(this.incomeArray[0]._id);
        }
      }
    });

  }

}
