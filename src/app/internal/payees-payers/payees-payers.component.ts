import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { AddPayeeComponent } from 'src/app/shared/modals/add-payee/add-payee.component';

@Component({
  selector: 'app-payees-payers',
  templateUrl: './payees-payers.component.html',
  styleUrls: ['./payees-payers.component.scss']
})
export class PayeesPayersComponent implements OnInit {
  dialogRefofOtpModal: MatDialogRef<AddPayeeComponent>;
  type: any = "PAYEE";
  payeesArray: any = [];
  payersArray: any = [];
  groupId: any;
  isRecordSelected: any = 0;
  isApiCalling: boolean = false;
  payeeId;
  payeeName;
  total: any;
  pageIndex: any = 0;
  constructor(public dialog: MatDialog, public sharedserive: SharedService, public http: HttpService, private toastr: ToastrService) { }

  @ViewChild('deletePayeeDialog') DeletePayeeDialog: TemplateRef<any>;

  ngOnInit(): void {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      if (data) {
        this.getPayees();
      }
    });
  }
  step = 0;

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
        } else {
          this.payeesArray = res.data.data;
        }
        this.total = res.data.totalFinancialBeneficiaries;
        // for (let index = 0; index < res.data.data.length; index++) {
        //   if (res.data.data[index].type === "PAYEE") {
        //     this.payeesArray.push(res.data.data[index]);
        //   } else {
        //     this.payersArray.push(res.data.data[index]);
        //   }
        // }
        // this.categories = res.data;
        // this.filter = res.data;
      }
    });
  }
  pageChange(event) {
    this.pageIndex = event.pageIndex;
    this.getPayees();
  }
  recordSelected(i) {
    if (i || i == 0)
      this.isRecordSelected = i;
  }

  setStep(index: number) {
    this.step = index;
  }
  setType(type) {
    this.type = type;
    this.pageIndex = 0;
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
      width: '350px'
    });

  }

  deletePayee() {
    this.isApiCalling = true;
    this.http.deletePayees(this.payeeId).subscribe(
      (data: any) => {
        this.toastr.success("Payees Delete Successfully", "Success");
        this.isApiCalling = false;
        this.closeDeleteModal();
        this.getPayees();
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
}
