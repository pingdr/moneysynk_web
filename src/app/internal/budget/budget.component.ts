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
  type: any = "EXPENSE"
  dialogRefofOtpModal: MatDialogRef<AddBudgetModalComponent>;
  constructor(public http: HttpService,private formBuilder: FormBuilder, public sharedserive: SharedService, public dialog: MatDialog) { }

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
  getBudgets() {
    this.isApiCalling = true;
    this.http.getCategories(ApiUrl.getBudget + "?groupId=" + this.groupId).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      // if (res.data != undefined) {
      //   for (let index = 0; index < res.data.length; index++) {
      //     if (res.data[index].type === "EXPENSE") {
      //       this.expenseArray.push(res.data[index]);
      //     } else {
      //       this.incomeArray.push(res.data[index]);
      //     }
      //   }
      // }
    });
  }
  nextStep() {
    this.step++;
  }
  setType(type) {
    this.type = type;
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
