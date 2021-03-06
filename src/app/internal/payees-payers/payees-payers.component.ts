import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { dataUri } from '@rxweb/reactive-form-validators';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { AddPayeeComponent } from 'src/app/shared/modals/add-payee/add-payee.component';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { transactionLists } from 'src/app/services/CustomPaginatorConfiguration';

@Component({
  selector: 'app-payees-payers',
  templateUrl: './payees-payers.component.html',
  styleUrls: ['./payees-payers.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: transactionLists() }
  ]
})
export class PayeesPayersComponent implements OnInit, OnDestroy {
  dialogRefofOtpModal: MatDialogRef<AddPayeeComponent>;
  type: any = "PAYEE";
  payeeSummary: any = [];
  payeesArray: any = [];
  sortPayeerArray: any = [];
  payersArray: any = [];
  pName: any = '';
  groupId: any;
  deletePayees: any

  isRecordSelected: any = 0;
  isRecordSelected1: any = 0;
  isRecordAction: boolean = false;

  isApiCalling: boolean = false;
  isShimmerLoading: boolean = false;
  payeePayerShimmarLoding = true;

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
  searchChangeEventSubscription: Subscription;

  subscribers: any = []

  constructor(
    public dialog: MatDialog,
    public sharedserive: SharedService,
    public http: HttpService,
    private toastr: ToastrService,
    private _router: Router
  ) { }

  ngOnInit(): void {

    this.subscribers.push(this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;

      this.payeeSummary = [];
      this.payeesArray = [];
      this.sortPayeerArray = [];
      this.payersArray = [];
      this.payeeDetails = [];

      this.payeeDetailPageIndex = 0;
      this.payeePayerShimmarLoding = true;
      this.payeeIndexTotal = 0;
      this.selectedPayeeId = '';
      this.pName = '';

      if (data) {
        this.getPayees();
        this.getPayeeSummary();
      }
    }))

    this.searchChangeEventSubscription = this.sharedserive.searchDataChange.subscribe((data) => {
      console.log('subscribe Data', data);
      if (data) {
        this.searchData(data);
      }
    })
  }

  step = 0;

  getPayeeDetailsById(id) {
    this.isApiCalling = true;
    this.payeePayerShimmarLoding = true;
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

      if (res.data != null) {
        if (res.data.length != 0) {
          this.payeeIndexTotal = res.data[0].totalTransaction;
          this.payeeDetails = res.data;
        } else {
          this.payeeIndexTotal = 0;
          this.payeeDetails = [];
          this.payeeDetails.data = [];
        }
      } else {
        this.payeeIndexTotal = 0;
        this.payeeDetails = [];
        this.payeeDetails.data = [];
      }


      this.isApiCalling = false;
      this.payeePayerShimmarLoding = false;

    })
  }

  getPayees() {

    this.isApiCalling = true;
    this.isShimmerLoading = true;
    this.payeePayerShimmarLoding = true;

    if (this.groupId) {
      var payload = {
        "groupId": this.groupId,
        // "pageIndex": this.pageIndex,
        // "limit": 10,
        type: this.type
      }
      this.http.get(ApiUrl.getAllPayees, payload).subscribe(res => {

        this.isApiCalling = false;
        this.isShimmerLoading = false;
        this.payeePayerShimmarLoding = false;

        this.http.showLoader();

        if (res.data.data != undefined) {
          this.total = res.data.totalFinancialBeneficiaries;

          if (this.type === "PAYEE") {
            this.payeesArray = res.data.data;
            this.sortOutByChar(this.payeesArray);
            this.pName = res.data.data[0].name;
            this.selectedPayeeId = res.data.data[0]._id;
            this.getPayeeDetailsById(this.payeesArray[0]._id);
          } else {
            this.payersArray = res.data.data;
            this.sortOutByChar(this.payersArray);
            this.pName = res.data.data[0].name;
            this.selectedPayeeId = res.data.data[0]._id;
            this.getPayeeDetailsById(this.payersArray[0]._id);
          }

        }
      });
    }
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

  editTransaction(d) {
    this._router.navigate(['/update-entry/' + d._id]);
  }

  convertNumberinPositive(num) {
    return Math.abs(num);
  }

  transactionMonth(month, year) {
    let today = new Date()
    today.setMonth(month - 1);
    today.setUTCFullYear(year);
    return today;
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

    if (this.groupId) {
      var payload = {
        "groupId": this.groupId,
        type: this.type
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

  recordSelected(i, j, payee) {
    if (!this.isRecordAction) {
      if (i || i == 0)
        this.isRecordSelected = i;
      this.isRecordSelected1 = j;
      if (payee._id) {
        this.pName = payee.name;
        this.selectedPayeeId = payee._id;
        this.getPayeeDetailsById(payee._id);
      }

      this.payeeDetailPageIndex = 0;
      this.isRecordAction = false;
    } else {
      this.isRecordAction = false;
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
    this.isRecordSelected1 = 0;
    this.payeeDetailPageIndex = 0;

    this.payeeIndexTotal = 0;
    this.payeeDetails = [];
    this.payeeDetails.data = [];
    this.pName = '';
    this.getPayees();
    this.getPayeeSummary();
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
      if (result != "no") {
        console.log('The dialog was closed');
        this.payeesArray = [];
        this.payersArray = [];
        this.payeePayer = [];
        this.isRecordSelected = 0;
        this.getPayees();
      }
    });
  }

  updatePayeeOrPayer(objData) {
    this.isRecordAction = true;
    console.log(objData);
    const dialogRef = this.dialog.open(AddPayeeComponent, {
      width: '523px',
      panelClass: 'edit-account-main',
      data: { id: objData._id, type: objData.type, groupId: this.groupId, objData: objData }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != "no") {
        console.log('The dialog was closed');
        this.payeesArray = [];
        this.payersArray = [];
        this.payeePayer = [];
        this.isRecordSelected = 0;
        this.getPayees();
      }
    });
  }

  deletePayee(id, payeeName, type) {
    this.isRecordAction = true;
    console.log(type)
    let dialogRef;

    if (type == 'AddText') {
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
      if (result != "no") {
        console.log('The dialog was closed');
        this.payeePayer = [];
        this.isRecordSelected = 0;
        this.getPayees();
      }
    });
  }


  searchData(searchValue) {
    console.log("============================ Payee/ Payer", searchValue)

    this.isApiCalling = true;
    this.isShimmerLoading = true;

    const payload = {
      'type': this.type,
      'groupId': this.groupId,
      'value': searchValue
    }

    this.http.get(ApiUrl.searchPayeePayer, payload).subscribe(res => {

      console.log(res);
      this.isApiCalling = false;
      this.isShimmerLoading = false;

      this.http.showLoader();

      if (res.data != undefined) {
        this.total = res.data.totalFinancialBeneficiaries;

        if (this.type === "PAYEE") {
          this.payeesArray = res.data;
          this.sortOutByChar(this.payeesArray);
          this.pName = res.data[0].name;
          this.selectedPayeeId = res.data[0]._id;
          this.getPayeeDetailsById(this.payeesArray[0]._id);
        } else {
          this.payersArray = res.data;
          this.sortOutByChar(this.payersArray);
          this.pName = res.data[0].name;
          this.selectedPayeeId = res.data[0]._id;
          this.getPayeeDetailsById(this.payersArray[0]._id);
        }

      }
    });

  }

  closeDeleteModal() {
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    for (let index = 0; index < this.subscribers.length; index++) {
      this.subscribers[index].unsubscribe();
    }
    this.searchChangeEventSubscription.unsubscribe();
  }
}
