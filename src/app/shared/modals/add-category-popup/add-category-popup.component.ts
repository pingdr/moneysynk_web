import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { AddEditAccountComponent } from '../add-edit-account/add-edit-account.component';

@Component({
  selector: 'app-add-category-popup',
  templateUrl: './add-category-popup.component.html',
  styleUrls: ['./add-category-popup.component.scss']
})
export class AddCategoryPopupComponent implements OnInit {
  Addaccountentry: FormGroup;
  submitted = false;
  public loader = false;
  allParents: any;
  isApiCalling: boolean = false;
  isSpinnerLoding: boolean = false;
  icons: any;
  isSelected: any = 0;
  categoryData: any = {};

  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpService, private toastr: ToastrService, public dialogRef: MatDialogRef<AddEditAccountComponent>) {
    this.Addaccountentry = this.formBuilder.group({
      // title: ['', Validators.required],
      name: ['', Validators.required],
      icon: [''],
      parent: ['', Validators.required],
      note: [null],
      type: [this.data.type],
      groupId: [this.data.groupId]
    });
    this.getCategoriesData();
    this.getAllIcon();
  }
  getAllIcon() {
    this.isApiCalling = true;
    this.http.get(ApiUrl.icons).subscribe((res) => {
      this.isApiCalling = false;
      this.icons = res.data

      if (this.categoryData.icon != undefined) {
        this.isSelected = this.icons.findIndex(x => x.path === this.categoryData.icon);
        this.Addaccountentry.controls.icon.setValue(this.categoryData.icon);
      }
    })
  }
  getCategoriesData() {
    this.isApiCalling = true;
    this.http.getCategories(ApiUrl.getCategories + "?parent=true&type=" + this.data.type + "&groupId=" + this.data.groupId).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data != undefined) {
        this.allParents = res.data.data;
        // this.filter = res.data;
      }
    });

  }
  get f() { return this.Addaccountentry.controls; }
  selectIcon(i, path) {
    if (i || i == 0)
      this.isSelected = i;
    this.Addaccountentry.controls.icon.setValue(path);
  }

  onSubmit() {

    var regex = new RegExp("[a-zA-Z][a-zA-Z ]*");

    this.submitted = true;
    console.log(this.Addaccountentry.invalid);

    // stop here if form is invalid
    if (this.Addaccountentry.invalid) {
      return;
    }

    if (!regex.test(this.Addaccountentry.value.name)) {
      this.toastr.error('Please enter valid category name', 'Invalid');
    }
    else {
      this.loader = true;
      this.isApiCalling = true;
      this.isSpinnerLoding = true;
      if (this.categoryData._id) {
        this.http.addEditCategory(ApiUrl.addEditCategory + '/' + this.categoryData._id, this.Addaccountentry.value, false)
          .subscribe(res => {
            this.isApiCalling = false;
            let response = res;
            if (response.statusCode == 200) {
              this.toastr.success('Category updated successfully', 'success', {
                timeOut: 2000
              });
            }
            this.dialogRef.close(this.dialogRef);
            this.isSpinnerLoding = false;
            this.http.navigate('categories');
          },
            () => {
              this.isApiCalling = false;
              this.loader = false;
              this.isSpinnerLoding = false;
            });
      } else {


        if (this.Addaccountentry.value.icon != '') {

          var imageIcon = this.Addaccountentry.value.icon

        } else {
          var imageIcon = this.icons[0].path
        }

        var payload = {
          "groupId": this.data.groupId,
          "icon": imageIcon,
          "name": this.Addaccountentry.value.name,
          "note": this.Addaccountentry.value.note,
          "parent": this.Addaccountentry.value.parent,
          "type": this.data.type
        }

        this.http.addEditCategory(ApiUrl.addEditCategory, payload, false)
          .subscribe(res => {
            this.isApiCalling = false;
            let response = res;
            if (response.statusCode == 200) {
              this.toastr.success('Category added successfully', 'success', {
                timeOut: 2000
              });
            }
            this.dialogRef.close(this.dialogRef);
            this.isSpinnerLoding = false;
            this.http.navigate('categories');
          },
            () => {
              this.isApiCalling = false;
              this.loader = false;
              this.isSpinnerLoding = false;
            });
      }
    }

    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.editaccount.value, null, 4));
  }



  ngOnInit(): void {
    console.log(this.data)
    if (this.data.objEditData) {
      this.categoryData = this.data.objEditData;
    }
  }

}
