import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { AddPayeeComponent } from 'src/app/shared/modals/add-payee/add-payee.component';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-payees-payers',
  templateUrl: './payees-payers.component.html',
  styleUrls: ['./payees-payers.component.scss']
})
export class PayeesPayersComponent implements OnInit {
  dialogRefofOtpModal: MatDialogRef<AddPayeeComponent>;
  type: any = "PAYEE";
  payeeSummary: any = [];
  payeesArray: any = [];
  payersArray: any = [];
  groupId: any;
  isRecordSelected: any = 0;
  isApiCalling: boolean = false;
  payeeId;
  payeeName;
  total: any;
  pageIndex: any = 0;
  AddText: any = "Add Payee";
  payeeDetails: any;
  constructor(public dialog: MatDialog, public sharedserive: SharedService, public http: HttpService, private toastr: ToastrService) { }

  @ViewChild('deletePayeeDialog') DeletePayeeDialog: TemplateRef<any>;

  ngOnInit(): void {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      if (data) {
        this.getPayees();
        this.getPayeeSummary();
      }
    });
  }
  step = 0;
  getPayeeDetailsById(id) {
    this.isApiCalling = true;
    var payload = {
      year: 1,
      groupId: this.groupId,
      beneficiaryId: id,
      type: this.type == 'PAYEE' ? 'OUT' : 'IN'
    }
    this.http.get(ApiUrl.payeeMonths, payload).subscribe((res) => {
      this.isApiCalling = false;
      this.payeeDetails = res.data;
    })
  }
  getPayees() {
    this.isApiCalling = true;
    var payload = {
      "groupId": this.groupId,
      "pageIndex": this.pageIndex,
      "limit": 10,
      type: this.type
    }
    this.http.get(ApiUrl.getAllPayees, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data.data != undefined) {
        if (this.type === "PAYEE") {
          this.payeesArray = res.data.data;
          this.getPayeeDetailsById(this.payeesArray[0]._id);
        } else {
          this.payersArray = res.data.data;
          this.getPayeeDetailsById(this.payersArray[0]._id);
        }
        this.total = res.data.totalFinancialBeneficiaries;
      }
    });
  }

  getPayeeSummary() {
    this.isApiCalling = true;
    var payload = {
      "groupId": this.groupId,
    }

    this.http.get(ApiUrl.getPayeeSummary, payload).subscribe((res) => {
      this.isApiCalling = false;
      this.http.showLoader();
      console.log('Payee Summary Data', res);
      if (res && res.data) {
        this.payeeSummary = res.data;
      }
    });
  }

  pageChange(event) {
    this.pageIndex = event.pageIndex;
    this.getPayees();
  }
  recordSelected(i, id?) {
    if (i || i == 0)
      this.isRecordSelected = i;
    if (id) {
      this.getPayeeDetailsById(id);
    }
  }

  setStep(index: number) {
    this.step = index;
  }
  setType(type) {
    this.type = type;
    if (type === "PAYEE")
      this.AddText = "Add Payee"
    else
      this.AddText = "Add Payer"
    this.pageIndex = 0;
    this.isRecordSelected = 0;
    this.getPayees();
  }
  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  openCategorymodal() {
    const dialogRef = this.dialog.open(AddPayeeComponent, {
      width: '523px',
      panelClass: 'edit-account-main',
      data: { type: this.type, groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.payeesArray = [];
      this.payersArray = [];
      this.getPayees();
    });
  }

  openDeleteDialog(id, name) {
    console.log(id);
    this.payeeId = id;
    this.payeeName = name;
    this.dialog.open(this.DeletePayeeDialog, {
      width: '350px',
      panelClass: 'custom-modalbox'
    });

  }

  deletePayee(id, payeeName) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'deletePayee', title: 'Payee', id: id, name: payeeName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getPayees();
    });
  }

  // deletePayee() {
  //   this.isApiCalling = true;
  //   this.http.deletePayees(this.payeeId).subscribe(
  //     (data: any) => {
  //       this.toastr.error("Payees Delete Successfully", "Success");
  //       this.isApiCalling = false;
  //       this.closeDeleteModal();
  //       this.getPayees();
  //     }, err => {
  //       this.toastr.error("Oops! Something went wrong", 'Error');
  //       this.isApiCalling = false;
  //       this.closeDeleteModal();
  //     }
  //   )
  // }

  closeDeleteModal() {
    this.dialog.closeAll();
  }
}
