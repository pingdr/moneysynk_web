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
  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpService, private toastr: ToastrService, public dialogRef: MatDialogRef<AddEditAccountComponent>) {
    this.Addaccountentry = this.formBuilder.group({
      // title: ['', Validators.required],
      name: ['', Validators.required],
      icon: ['', Validators.required],
      parent: ['', Validators.required],
      note: [''],
      type:[this.data.type],
      groupId:[localStorage.getItem('group_id')]
    });
    this.getCategoriesData();
  }
  getCategoriesData() {
    this.http.getCategories(ApiUrl.getCategories + "?parent=true").subscribe(res => {
      this.http.showLoader();
      if (res.data != undefined) {
        this.allParents = res.data;
        // this.filter = res.data;
      }
    });

  }
  get f() { return this.Addaccountentry.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.Addaccountentry.invalid) {
      return;
    }
    this.loader = true;
    this.http.addEditCategory(ApiUrl.addEditCategory, this.Addaccountentry.value, false)
      .subscribe(res => {
        let response = res;
        if (response.statusCode == 200) {
          this.toastr.success('Account added successfully', 'success', {
            timeOut: 2000
          });
        }
        this.dialogRef.close(this.dialogRef);
        this.http.navigate('accounts');
      },
        () => {
          this.loader = false;
        });
    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.editaccount.value, null, 4));
  }



  ngOnInit(): void {
  }

}
