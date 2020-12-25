import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { dataUri } from '@rxweb/reactive-form-validators';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { AddPayeeComponent } from 'src/app/shared/modals/add-payee/add-payee.component';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';
import * as _ from 'lodash';

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
  sortPayeerArray: any = [];
  payersArray: any = [];
  monthlyTotal: any = '';
  pName: any = '';
  groupId: any;

  isRecordSelected: any = 0;
  isRecordSelected1: any = 0;

  isApiCalling: boolean = false;
  isShimmerLoading: boolean = false;

  payeeId;
  payeeName;
  total: any = 0;
  pageIndex: any = 0;

  payeeDetailPageIndex: any = 0;
  payeeIndexTotal: any = 0;
  selectedPayeeId: string = '';


  AddText: any = "Add Payee";
  payeeDetails: any = [];

  sortCharData: any = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ]

  payeePayer: any = [];

  constructor(public dialog: MatDialog, public sharedserive: SharedService, public http: HttpService, private toastr: ToastrService) { }

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
      groupId: this.groupId,
      year: 1,
      type: this.type == 'PAYEE' ? 'OUT' : 'IN',
      beneficiaryId: id,
      pageIndex: this.payeeDetailPageIndex,
      limit: 5

    }
    this.http.get(ApiUrl.payeeMonths, payload).subscribe((res) => {
      console.log("Payee Payer Detail ======>", res);      
      if (res.data.length != 0) {
        this.payeeIndexTotal = res.data[0].totalTransaction;
        this.payeeDetails = res.data[0];
      } else {
        this.payeeIndexTotal = 0;
        this.payeeDetails = [];
        this.payeeDetails.data = [];
      }

      this.isApiCalling = false;

    })
  }

  getPayees() {

    this.isApiCalling = true;
    this.isShimmerLoading = true;

    var payload = {
      "groupId": this.groupId,
      // "pageIndex": this.pageIndex,
      // "limit": 10,
      type: this.type
    }
    this.http.get(ApiUrl.getAllPayees, payload).subscribe(res => {

      this.isApiCalling = false;
      this.isShimmerLoading = false;

      this.http.showLoader();

      if (res.data.data != undefined) {
        this.total = res.data.totalFinancialBeneficiaries;

        if (this.type === "PAYEE") {
          this.payeesArray = res.data.data;
          this.sortOutByChar(this.payeesArray);
          this.pName = res.data.data[0].name;
          this.selectedPayeeId = res.data.data[0]._id;
          this.getPayeeDetailsById(this.payeesArray[0]._id);
          // this.getMonthlySummaryData(this.payeesArray[0]._id, this.payeesArray[0].type)
        } else {
          this.payersArray = res.data.data;
          this.sortOutByChar(this.payersArray);
          this.pName = res.data.data[0].name;
          this.selectedPayeeId = res.data.data[0]._id;
          this.getPayeeDetailsById(this.payersArray[0]._id);
          // this.getMonthlySummaryData(this.payersArray[0]._id, this.payersArray[0].type)
        }

      }
    });
  }

  sortOutByChar(data) {
    let temp: any = data;
    var grouBy = _.groupBy(temp, function (data) {
      return data.name.charAt(0).toUpperCase()
    });
    let array: any = [];
    Object.keys(grouBy).forEach((key) => {
      let newObj = {
        title: key,
        data: grouBy[key]
      };
      array.push(newObj);
    });
    this.payeePayer = array;
  }

  gotoPayersTop(char) {
    for (let index = 0; index < this.sortCharData.length; index++) {
      if (char === this.sortCharData[index]) {
        var setChar: any = document.getElementById('P' + char) as HTMLDivElement;
        setTimeout(() => {
          setChar.style.top = '-150px';
          setChar.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
          setChar.style.top = top;
        });
        break
      }
    }
  }

  gotoPayeesTop(char) {
    for (let index = 0; index < this.sortCharData.length; index++) {
      if (char === this.sortCharData[index]) {
        var setChar: any = document.getElementById(char) as HTMLDivElement;
        setTimeout(() => {
          setChar.style.top = '-150px';
          setChar.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
          setChar.style.top = top;
        });
        break
      }
    }
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

  getMonthlySummaryData(beneficiaryId, type) {

    const payload = {
      "groupId": this.groupId,
      "year": "1",
      "beneficiaryId": beneficiaryId
    }

    console.log(payload)
    this.http.getMonthlySummarydata('financialBeneficiaries/getMonthlyData', payload).subscribe((res: any) => {
      console.log(res);
      if (res.data) {
        this.monthlyTotal = res.data[0].total
      }
    });

  }


  pageChange(event) {
    this.pageIndex = event.pageIndex;
    this.payeePayer = [];
    this.getPayees();
  }

  payeeDetailPageChange(event) {
    this.payeeDetailPageIndex = event.pageIndex;
    this.getPayeeDetailsById(this.selectedPayeeId)


  }

  // recordSelected(i, payee) {
  //   if (i || i == 0)
  //     this.isRecordSelected = i;
  //   if (payee._id) {
  //     this.pName = payee.name;
  //     this.getPayeeDetailsById(payee._id);
  //   }
  // }

  recordSelected(i, j, payee) {
    if (i || i == 0)
      this.isRecordSelected = i;
    this.isRecordSelected1 = j;
    if (payee._id) {
      this.pName = payee.name;
      this.selectedPayeeId = payee._id;
      this.getPayeeDetailsById(payee._id);
      // this.getMonthlySummaryData(payee._id, payee.type);
    }

    this.payeeDetailPageIndex = 0;
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
    this.isRecordSelected1 = 0;
    this.payeeDetailPageIndex = 0;
    this.getPayees();
  }
  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  openCategorymodal() {
    this.total = 0;
    const dialogRef = this.dialog.open(AddPayeeComponent, {
      width: '523px',
      panelClass: 'edit-account-main',
      data: { id: '', type: this.type, groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.payeesArray = [];
      this.payersArray = [];
      this.payeePayer = [];
      this.isRecordSelected = 0;
      this.getPayees();
    });
  }

  updatePayeeOrPayer(objData) {
    console.log(objData);
    const dialogRef = this.dialog.open(AddPayeeComponent, {
      width: '523px',
      panelClass: 'edit-account-main',
      data: { id: objData._id, type: objData.type, groupId: this.groupId, objData: objData }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.payeesArray = [];
      this.payersArray = [];
      this.payeePayer = [];
      this.isRecordSelected = 0;
      this.getPayees();
    });
  }

  deletePayee(id, payeeName, type) {
    let dialogRef;

    if (type == 'deletePayee') {
      dialogRef = this.dialog.open(DeleteModalComponent, {
        panelClass: 'account-modal-main',
        width: '350px',
        data: { type: type, title: 'Payee', id: id, name: payeeName }
      });
    } else {
      dialogRef = this.dialog.open(DeleteModalComponent, {
        panelClass: 'account-modal-main',
        width: '350px',
        data: { type: type, title: 'Payer', id: id, name: payeeName }
      });
    }


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.payeePayer = [];
      this.isRecordSelected = 0;
      this.getPayees();
    });
  }

  closeDeleteModal() {
    this.dialog.closeAll();
  }
}
