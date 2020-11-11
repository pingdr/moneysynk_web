import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { AddBudgetModalComponent } from 'src/app/shared/modals/add-budget-modal/add-budget-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {

  groupId: any;
  isApiCalling: boolean = false;
  type: any = "EXPENSE";
  expenseArray: any = [];
  incomeArray: any = [];
  budgets: any = [];
  recordSelected: any = 0;
  dialogRefofOtpModal: MatDialogRef<AddBudgetModalComponent>;
  constructor(public http: HttpService, private formBuilder: FormBuilder, public sharedserive: SharedService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      if (data) {
        this.getBudgets();
      }
    });
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }
  selectRecord(i) {
    if (i || i == 0)
    this.recordSelected = i;
  }
  getBudgets() {
    this.isApiCalling = true;
    var payload = {
      "groupId": this.groupId,
      "type": this.type
    }
    this.recordSelected = 0;
    this.http.getCategories(ApiUrl.getBudget, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      console.log(res);
      if (res.data != undefined) {
        // this.budgets = res.data.data;
          if (this.type === "EXPENSE") {
            this.expenseArray = res.data.data;
          } else {
            this.incomeArray = res.data.data;
          }
      }
    });
  }
  nextStep() {
    this.step++;
  }
  setType(type) {
    this.type = type;
    this.getBudgets();
  }
  prevStep() {
    this.step--;
  }



  openEditmodal(): void {
    const dialogRef = this.dialog.open(AddBudgetModalComponent, {
      width: '976px',
      panelClass: 'edit-account-main', data: { type: this.type, groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

}
