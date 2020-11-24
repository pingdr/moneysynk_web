import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transfer-modal',
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss']
})
export class TransferModalComponent implements OnInit {

  transferForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TransferModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.transferForm = this.formBuilder.group({
      fromBudget: ['', Validators.required],
      toBudget: ['', Validators.required],
      amount: ['', Validators.required],
      dateTime: ['', Validators.required],
      note: ['']
    });
  }

  get f() { return this.transferForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.transferForm.invalid) {
      return;
    }

    console.log('Success', this.transferForm.value);
  }

}
