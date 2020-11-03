import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { AddGroupComponent } from 'src/app/shared/modals/add-group/add-group.component';
import { AddExpenseComponent } from 'src/app/shared/modals/add-expense/add-expense.component';

@Component({
  selector: 'app-splitwise',
  templateUrl: './splitwise.component.html',
  styleUrls: ['./splitwise.component.scss']
})
export class SplitwiseComponent implements OnInit {

  dialogRefofOtpModal :MatDialogRef<AddGroupComponent>; 
  dialogRefofAddexpense: MatDialogRef<AddExpenseComponent>; 
  
  constructor(private formBuilder: FormBuilder, public dialog: MatDialog){}

  ngOnInit(): void {
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;     
  }

  openAddgroupl(): void {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      width: '523px',
      panelClass: 'edit-account-main',
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
     
    });
  }

  openAddexpense(): void {
    const dialogRef = this.dialog.open(AddExpenseComponent, {
      width: '523px',
      panelClass: 'edit-account-main',
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
     
    });
  }

}
  