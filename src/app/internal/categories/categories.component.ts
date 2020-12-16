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
// import { AddCategoryPopupComponent } from 'src/app/popup/add-category-popup/add-category-popup.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
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

  categoryId;
  categoryName;
  categoriesDetails: any = [];
  categorySummary: any = [];
  cName: any;
  total: any;
  MonthlyTotal: any = '';
  pageIndex: any = 0;
  isDefault: boolean = true;

  constructor(public http: HttpService, public activeRoute: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private _router: Router,
    public sharedserive: SharedService,
    private toastr: ToastrService,
    public dialog: MatDialog, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      if (data) {
        this.getCategoriesData();
        this.getCategorySummary();
      }
    });
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }
  setType(type) {
    this.categoriesDetails = [];
    this.type = type;
    this.pageIndex = 0;
    this.getCategoriesData();
  }
  getCategoriesDetailsById(id) {
    this.isApiCalling = true;
    var payload = {
      year: 1,
      groupId: this.groupId,
      categoryId: id,
      type: this.type == 'EXPENSE' ? 'OUT' : 'IN'
    }
    this.http.get(ApiUrl.categoryMonths, payload).subscribe((res) => {
      this.isApiCalling = false;
      this.categoriesDetails = res.data;
    })
  }

  selectRecord(c) {
    console.log(c);
    this.cName = c.name;
    this.getCategoriesDetailsById(c._id);
    this.getCategoryMonthlyData(c._id, c.type);
  }
  getCategoriesData() {
    this.isApiCalling = true;
    this.isShimmerloading = true;
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
          
          this.getCategoriesDetailsById(this.expenseArray[0]._id);          
          this.getCategoryMonthlyData(this.expenseArray[0]._id, this.expenseArray[0].type)
        } else {
          this.incomeArray = res.data.data;
          this.cName = this.incomeArray[0].name;
          this.getCategoriesDetailsById(this.incomeArray[0]._id);          
          this.getCategoriesDetailsById(this.incomeArray[0]._id);
        }
      }
    });

  }

  getCategorySummary() {
    this.isApiCalling = true;
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

  getCategoryMonthlyData(categoryId, type) {

    let payloadType = '';

    if (type == 'EXPENSE') {
      payloadType = 'OUT';
    } else {
      payloadType = 'IN';
    }

    var payload = {
      "groupId": this.groupId,
      "categoryId": categoryId,
      "type": payloadType
    }

    this.http.getMonthlySummarydata('categories/getMonthlyData', payload).subscribe((res: any) => {
      console.log("&&&&&&&&&&&&&&&&&&&&&&&&&", res.data[0].total);
      if (res.data) {
        this.MonthlyTotal = res.data[0].total;
      }
    });

  }

  pageChange(event) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.getCategoriesData();
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
      console.log('The dialog was closed');
      this.incomeArray = [];
      this.expenseArray = [];
      this.getCategoriesData();
    });
  }


  deleteCategory(id, categoryName) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'deleteCategory', title: 'Category', id: id, name: categoryName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getCategoriesData();
    });
  }

  editCategory(objEditData) {

    console.log(objEditData);

    const dialogRef = this.dialog.open(AddCategoryPopupComponent, {
      width: '523px',
      panelClass: 'edit-account-main', data: { type: this.type, groupId: this.groupId, objEditData: objEditData }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.incomeArray = [];
      this.expenseArray = [];
      this.getCategoriesData();
    });
  }

  closeAllModal() {
    this.dialog.closeAll();
  }

}
