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
// import { AddCategoryPopupComponent } from 'src/app/popup/add-category-popup/add-category-popup.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @ViewChild('deleteCategoryDialog') DeleteCategoryDialog: TemplateRef<any>;

  categories: any;
  type: any = "EXPENSE"
  dialogRefofOtpModal: MatDialogRef<AddCategoryPopupComponent>;
  groupId: any;
  expenseArray: any = [];
  incomeArray: any = [];
  isApiCalling: boolean = false;
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
      }
    });
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }
  setType(type) {
    this.type = type;
  }
  getCategoriesData() {
    this.isApiCalling = true;
    this.http.getCategories(ApiUrl.getCategories + "?groupId=" + this.groupId).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data != undefined) {
        for (let index = 0; index < res.data.length; index++) {
          if (res.data[index].type === "EXPENSE") {
            this.expenseArray.push(res.data[index]);
          } else {
            this.incomeArray.push(res.data[index]);
          }
        }
        // this.categories = res.data;
        // this.filter = res.data;
      }
    });

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

  deleteCategory(id) {
    let typeDialogRef = this.dialog.open(this.DeleteCategoryDialog);

    typeDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'yes') {
          console.log('clicked yes');
        }
      }
    })
  }

}
