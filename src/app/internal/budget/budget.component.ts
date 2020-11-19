import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { AddBudgetModalComponent } from 'src/app/shared/modals/add-budget-modal/add-budget-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  budgetName:any;
  budgetId:any;
  groupId: any;
  isApiCalling: boolean = false;
  type: any = "EXPENSE";
  expenseArray: any = [];
  incomeArray: any = [];
  budgets: any = [];
  budgetDetails:any;
  recordSelected: any = 0;
  bname:any;
  @ViewChild('deletePayeeDialog') DeletePayeeDialog: TemplateRef<any>;

  dialogRefofOtpModal: MatDialogRef<AddBudgetModalComponent>;
  constructor(public http: HttpService, private formBuilder: FormBuilder,private toastr: ToastrService, public sharedserive: SharedService, public dialog: MatDialog) { }

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
  selectRecord(i,b) {
    if (i || i == 0)
    this.recordSelected = i;
    this.bname = b.name;
    this.getBudgetDetailsById(b._id)
  }
  openDeleteDialog(id, name) {
    console.log(id);
    this.budgetId = id;
    this.budgetName = name;
    this.dialog.open(this.DeletePayeeDialog, {
      width: '350px',
      panelClass: 'custom-modalbox'
    });

  }
  getBudgetDetailsById(id) {
    this.isApiCalling = true;
    var payload = {
      year: 1,
      groupId: this.groupId,
      financialSourceId: id,
      type: this.type == 'EXPENSE' ? 'OUT' : 'IN'
    }
    this.http.get(ApiUrl.budgetMonths, payload).subscribe((res) => {
      this.isApiCalling = false;
      this.budgetDetails = res.data;
    })
  }
  deleteBudget() {
    this.isApiCalling = true;
    this.http.deleteAccount(ApiUrl.getBudget,this.budgetId).subscribe(
      (data: any) => {
        this.toastr.error("Budget Delete Successfully", "Success");
        this.isApiCalling = false;
        this.closeDeleteModal();
        this.getBudgets();
      }, err => {
        this.toastr.error("Oops! Something went wrong", 'Error');
        this.isApiCalling = false;
        this.closeDeleteModal();
      }
    )
  }
  closeDeleteModal() {
    this.dialog.closeAll();
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
            this.bname = this.expenseArray[0].name;
            this.getBudgetDetailsById(this.expenseArray[0]._id);
          } else {
            this.incomeArray = res.data.data;
            this.bname = this.incomeArray[0].name;
            this.getBudgetDetailsById(this.incomeArray[0]._id);
          }
      }
    });
  }
  nextStep() {
    this.step++;
  }
  setType(type) {
    this.type = type;
    this.recordSelected = 0;
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
      this.getBudgets();
    });
  }
  getValue(b) {
    let temp = 100 * b.currentBalance;
    let sum = temp / b.amount;
    return 100 - sum;
  }

}
