import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  categories: any;
  isApiCalling: boolean = false;

  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpService, private toastr: ToastrService, public dialogRef: MatDialogRef<AddPayeeComponent>) {
    this.Addaccountentry = this.formBuilder.group({
      // title: ['', Validators.required],
      name: ['', Validators.required],
      // Icon: ['', Validators.required],
      categoryId: ['', Validators.required],
      groupId: [this.data.groupId],
      type: [this.data.type],
      note: ['', Validators.required]
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
    this.isApiCalling = true;
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
    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.editaccount.value, null, 4));
  }

  getAllCategories() {
    var payload = {
      "groupId": this.data.groupId,
      // "pageIndex": this.pageIndex,
      // "limit": 10,
      type: this.data.type === "PAYEE" ? "EXPENSE" : "INCOME"

    }
    this.isApiCalling = true;
    this.http.getCategories(ApiUrl.getCategories,payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data.data != undefined) {
        this.categories = res.data.data;
        // this.filter = res.data;
      }
    });
  }

  ngOnInit(): void {
    this.getAllCategories()
  }

}
