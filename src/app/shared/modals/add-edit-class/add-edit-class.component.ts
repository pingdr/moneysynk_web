import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
declare var $:any

@Component({
  selector: 'app-add-edit-class',
  templateUrl: './add-edit-class.component.html',
  styleUrls: ['./add-edit-class.component.scss']
})
export class AddEditClassComponent implements OnInit {

  submitted: boolean = false;
  classForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddEditClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public http: HttpService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    
    this.classForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    console.log(this.data);
  }

  get f() { return this.classForm.controls; }

  onSubmit() {

    this.submitted = true;
    if (this.classForm.invalid) {
      return;
    }

    var payload = {
      "groupId": this.data.groupId,
      "name": this.classForm.value.name,
    }

    if (this.data.id != undefined) {
      this.http.addAccountType(ApiUrl.classes + '/' + this.data.id, payload, false)
        .subscribe(res => {
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Class updated successfully', 'success', {
              timeOut: 2000
            });
          }

          this.hideModal();

        });
    } else {
      this.http.addAccountType(ApiUrl.classes, payload, false)
        .subscribe(res => {
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Class added successfully', 'success', {
              timeOut: 2000
            });
          }

          this.hideModal();

        });
    }
  }

  hideModal() {
    this.dialogRef.close(this.dialogRef);
  }

  special_char(event)
  {   
     var k;  
     k = event.charCode;  //         k = event.keyCode;  (Both can be used)
     return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  

  }

}
