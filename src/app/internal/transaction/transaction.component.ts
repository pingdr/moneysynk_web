import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

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

  downloadExcel() {
    let json_data: any = []

    for (let index = 0; index < this.transactionList.length; index++) {
      let tempData = {
        "srNo": index + 1,
        "payee/payes": this.transactionList[index].beneficiaryId.name,
        "amount": this.transactionList[index].amount,
        "accountType": this.transactionList[index].accountId.name,
        "Category": this.transactionList[index].categoryId.name,
        "CreatedDate": this.transactionList[index].dateTime,
        "Class": this.transactionList[index].classId.name
      }

      json_data.push(tempData);
    }

    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet('Transaction');

    let header = ["SrNo", "Payee/Payer", "Amount", "Account Type", "Category", "Created Date", "Class"];
    let headerRow = worksheet.addRow(header);

    for (let x1 of json_data) {
      let x2 = Object.keys(x1);
      let temp = [];

      for (let y of x2) {
        temp.push(x1[y]);
      }

      worksheet.addRow(temp);
    }

    //set downloadable file name
    let fname = "Transaction Data " + new Date();

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
  }
}
