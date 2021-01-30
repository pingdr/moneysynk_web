import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-add-payee',
  templateUrl: './add-payee.component.html',
  styleUrls: ['./add-payee.component.scss']
})
export class AddPayeeComponent implements OnInit {

  Addaccountentry: FormGroup;
  submitted = false;
  public loader = false;
  categories: any = [];
  subcategories: any = [];
  isApiCalling: boolean = false;
  selectedChild: any
  childs: any
  isEdit: boolean = false;
  catgroyDetails: any = {};
  categoryName: string = '';
  childCategoryName: string = '';
  isShowChildCategory: boolean = false;
  isSpinnerLoading: boolean = false;

  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpService, private toastr: ToastrService, public dialogRef: MatDialogRef<AddPayeeComponent>) {
    this.Addaccountentry = this.formBuilder.group({
      // title: ['', Validators.required],
      name: ['', Validators.required],
      // Icon: ['', Validators.required],
      categoryId: ['', Validators.required],
      groupId: [this.data.groupId],
      type: [this.data.type],
      note: [''],
      categoryName: [''],
      childcategoryName: [''],
    });
  }

  get f() { return this.Addaccountentry.controls; }
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
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  onSubmit() {

    var regex = new RegExp("^[a-zA-Z]");

    this.submitted = true;

    // stop here if form is invalid

    if (this.Addaccountentry.invalid && !this.isEdit) {
      return;
    }

    if (!regex.test(this.Addaccountentry.value.name)) {
      this.toastr.error(`Please enter valid ${(this.data.type).toLowerCase()} name`, 'Invalid');
    } else {
      this.loader = true;
      this.isApiCalling = true;
      this.isSpinnerLoading=true;
      if (this.selectedChild) {
        this.Addaccountentry.value.categoryId = this.selectedChild;
      }

      if (this.catgroyDetails._id != undefined) {
        const data = {
          "name": this.capitalizeFirstLetter(this.Addaccountentry.value.name),
          "categoryId": this.catgroyDetails.categoryId,
          "type": this.Addaccountentry.value.type,
          "note": this.Addaccountentry.value.note,
          "groupId": this.data.groupId
        }

        this.http.post(ApiUrl.addEditPayee + '/' + this.data.objData._id, data, false)
          .subscribe(res => {
            this.isApiCalling = false;            
            let response = res;
            if (response.statusCode == 200) {
              if(this.data.type=="PAYEE"){
              this.toastr.success('Payee updated successfully', 'success', {
                timeOut: 2000
              });
            }else {

              this.toastr.success('Payer updated successfully', 'success', {
                timeOut: 2000
              });

            }

            }
            this.dialogRef.close(this.dialogRef);
            this.isSpinnerLoading=false;
            this.http.navigate('payees');
          },
            () => {
              this.loader = false;
              this.isApiCalling = false;
              this.isSpinnerLoading=false;
            });
      } else {

        const data = {
          "name": this.capitalizeFirstLetter(this.Addaccountentry.value.name),
          "categoryId": this.Addaccountentry.value.categoryId,
          "type": this.Addaccountentry.value.type,
          "note": this.Addaccountentry.value.note,
          "groupId": this.data.groupId
        }

        this.http.post(ApiUrl.addEditPayee, data, false)
          .subscribe(res => {
            this.isApiCalling = false;
            let response = res;
            if (response.statusCode == 200) {
              if(this.data.type=="PAYEE"){
                this.toastr.success('Payee added successfully', 'success', {
                  timeOut: 2000
                });
              }else{
                this.toastr.success('Payer added successfully', 'success', {
                  timeOut: 2000
                });
              }
            
            }
            this.dialogRef.close(this.dialogRef);
            this.isSpinnerLoading=false;
            this.http.navigate('payees');
          },
            () => {
              this.loader = false;
              this.isApiCalling = false;
              this.isSpinnerLoading=false;
            });
      }

    }


    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.editaccount.value, null, 4));
  }

  getAllCategories() {
    var payload = {
      "groupId": this.data.groupId,
      // "pageIndex": this.pageIndex,
      // "limit": 10,
      parent: true,
      type: this.data.type === "PAYEE" ? "EXPENSE" : "INCOME"

    }
    this.isApiCalling = true;
    this.http.getCategories(ApiUrl.getCategories, payload).subscribe(res => {
      console.log(res)
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data.data != undefined) {
        this.categories = res.data.data;
        console.log(this.categories)
        // this.filter = res.data;
      }
    });
  }

  getAllCategoriesReal(id) {
    var payload = {
      "groupId": this.data.groupId,
      // "pageIndex": this.pageIndex,
      // "limit": 10,
      // parent: true,
      type: this.data.type === "PAYEE" ? "EXPENSE" : "INCOME"

    }
    this.isApiCalling = true;
    this.http.getCategories(ApiUrl.getCategories, payload).subscribe(res => {
      console.log(res)
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data.data != undefined) {
        this.subcategories = res.data.data;
        this.subcategories.map((cat) => {
          if (cat._id === id) {
            if (cat.parent != null) {
              console.log(cat.name);
              if (cat.name) {
                this.isShowChildCategory = true;
              }

              this.childCategoryName = cat.name;
              this.categories.map((parentCat) => {
                if (parentCat._id === cat.parent) {
                  console.log(parentCat.name);
                  this.categoryName = parentCat.name;
                }
              })
            } else {
              console.log(cat.name);
              this.categoryName = cat.name
            }
          }
        })
        console.log(this.subcategories);

      }
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.getAllCategories();

    if (this.data.objData) {
      this.catgroyDetails = this.data.objData;
      this.getAllCategoriesReal(this.catgroyDetails.categoryId);
    }

    if (this.data.id == '') {
      this.isEdit = false;
    } else {
      this.isEdit = true;
    }
  }

  ngOnDestroy() {
    this.categoryName = '';
    this.childCategoryName = '';
  }

}
