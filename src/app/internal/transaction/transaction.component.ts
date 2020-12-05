import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  groupId: any;
  isApiCalling: boolean = false;
  transactionList: any;
  pageIndex: any = 0;
  resultsLength: any = 0;

  startDate: any = '';
  endDate: any = '';

  constructor(
    public http: HttpService,
    public sharedserive: SharedService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      if (data) {
        this.getTansactionData();
      }
    });
  }

  getTansactionData() {
    var payload = {
      pageIndex: this.pageIndex,
      limit: 10,
      startDate: this.startDate,
      endDate: this.endDate
    }

    this.isApiCalling = true;
    this.http.getAccount(ApiUrl.getTransactions, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data != undefined) {
        this.transactionList = [];
        this.resultsLength = res.data.totalTransactions;
        this.transactionList = res.data.data;
      }
    });
  }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    let startDate: Date = new Date(dateRangeStart.value);
    let endDate: Date = new Date(dateRangeEnd.value);

    let startMonth = startDate.getMonth() + 1;
    let endMonth = endDate.getMonth() + 1;

    this.startDate = startDate.getFullYear() + '-' + startMonth + '-' + startDate.getDay();
    this.endDate = endDate.getFullYear() + '-' + endMonth + '-' + endDate.getDay();

    if (dateRangeStart.value && dateRangeEnd.value) {
      this.getTansactionData();
    }
  }

  pageChange(event) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.getTansactionData();
  }

  deleteTransaction(id, beneficiaryName) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'deleteTransaction', title: 'Transaction', id: id, name: beneficiaryName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getTansactionData();
    });
  }
}
