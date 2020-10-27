import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-budget-modal',
  templateUrl: './add-budget-modal.component.html',
  styleUrls: ['./add-budget-modal.component.scss']
})
export class AddBudgetModalComponent implements OnInit {

  selected = 'option2';
  editaccount: FormGroup;
  submitted = false;
  type:any;
  constructor(public dialogRef: MatDialogRef<AddBudgetModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
    this.type = this.data.type
    this.editaccount = this.formBuilder.group({
      name: ['', Validators.required],
      type: [this.data.type],
      amount: ['', Validators.required],
      groupId: [this.type],
      icon: ['', Validators.required],
      note: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  get f() { return this.editaccount.controls; }
  setType(type) {
    this.type = type;
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editaccount.invalid) {
      return;
    }

    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.editaccount.value, null, 4));
  }





  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  // ----Popup-close----------//

}
