import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { id } from '@swimlane/ngx-charts';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transfer-modal',
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss']
})
export class TransferModalComponent implements OnInit {

  transferForm: FormGroup;
  submitted = false;

  fromBudgetList: any = [];
  toBudgetList: any = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TransferModalComponent>,
    public http: HttpService,
    private toastr: ToastrService,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {

    this.getBudgetList();

    this.transferForm = this.formBuilder.group({
      fromBudget: ['', Validators.required],
      toBudget: ['', Validators.required],
      amount: ['', Validators.required],
      dateTime: ['', Validators.required],
      note: ['']
    });

    console.log(this.data);
  }

  get f() { return this.transferForm.controls; }

  getBudgetList() {
    var payload = {
      "groupId": this.data.groupId,
      "type": this.data.type
    }

    this.http.getCategories(ApiUrl.getBudget, payload).subscribe((res: any) => {
      this.http.showLoader();
      console.log(res);
      if (res && res.data) {
        this.fromBudgetList = res.data.data;
        this.toBudgetList = res.data.data;
      }
    });
  }


  loadFromData(event: any) {
    console.log(event.value)
    let temp: any = [];


    for (let index = 0; index < this.fromBudgetList.length; index++) {
      if (this.fromBudgetList[index]._id != event.value) {
        temp.push(this.fromBudgetList[index]);
      }
    }

    this.toBudgetList = temp;
  }


  onSubmit() {
    this.submitted = true;

    if (this.transferForm.invalid) {
      return;
    }

    const data = {
      "from": this.transferForm.value.fromBudget,
      "to": this.transferForm.value.toBudget,
      "note": this.transferForm.value.note,
      "amount": this.transferForm.value.amount,
      "dateTime": new Date(this.transferForm.value.dateTime)
    }

    this.http.post(ApiUrl.addTransfer, data).subscribe((res: any) => {
      console.log(res);
      if (res.statusCode == 200) {
        this.toastr.success('Budget Transferred successfully')
        this.hideModal();
      }
    });
  }

  hideModal() {
    this.dialogRef.close(this.dialogRef);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
