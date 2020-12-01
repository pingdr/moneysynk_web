import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
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
  categories: any = {};
  isApiCalling: boolean = false;
  selectedChild: any
  childs: any
  isEdit: boolean = false;

  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpService, private toastr: ToastrService, public dialogRef: MatDialogRef<AddPayeeComponent>) {
    this.Addaccountentry = this.formBuilder.group({
      // title: ['', Validators.required],
      name: ['', Validators.required],
      // Icon: ['', Validators.required],
      categoryId: ['', Validators.required],
      groupId: [this.data.groupId],
      type: [this.data.type],
      note: ['']
    });
  }

  get f() { return this.Addaccountentry.controls; }
  parentSelected(event) {
    console.log(event.value);
    this.childs = this.categories[this.categories.findIndex(x => x._id === event.value)].child;
  }
  subSelected(event) {
    if (event.value != "") {
      this.selectedChild = event.value;
    }
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.Addaccountentry.invalid) {
      return;
    }
    this.loader = true;
    this.isApiCalling = true;
    if (this.selectedChild) {
      this.Addaccountentry.value.categoryId = this.selectedChild;
    }
    if (this.data.objData._id) {
      this.http.post(ApiUrl.addEditPayee + '/' + this.data.objData._id, this.Addaccountentry.value, false)
        .subscribe(res => {
          this.isApiCalling = false;
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Payee update successfully', 'success', {
              timeOut: 2000
            });
          }
          this.dialogRef.close(this.dialogRef);
          this.http.navigate('payees');
        },
          () => {
            this.loader = false;
            this.isApiCalling = false;
          });
    } else {
      this.http.post(ApiUrl.addEditPayee, this.Addaccountentry.value, false)
        .subscribe(res => {
          this.isApiCalling = false;
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Payee added successfully', 'success', {
              timeOut: 2000
            });
          }
          this.dialogRef.close(this.dialogRef);
          this.http.navigate('payees');
        },
          () => {
            this.loader = false;
            this.isApiCalling = false;
          });
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
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data.data != undefined) {
        this.categories = res.data.data;
        // this.filter = res.data;
      }
    });
  }

  ngOnInit(): void {
    console.log(this.data);

    if (this.data.id == '') {
      this.isEdit = false;
    } else {
      this.isEdit = true;
    }

    this.getAllCategories()
  }

}
