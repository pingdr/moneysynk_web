import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { billperpage } from 'src/app/services/CustomPaginatorConfiguration';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: billperpage() }
  ]
})

export class BillListComponent implements OnInit {
  groupId: any;

  isApiCalling: boolean = false;
  isShimmerloding: boolean = false;


  transactionList: any;
  pageIndex: any = 0;
  resultsLength: any = 0;

  startDate: any = '';
  endDate: any = '';

  searchChangeEventSubscription: Subscription;

  constructor(
    public http: HttpService,
    public sharedserive: SharedService,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit() {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      console.log(this.groupId)
      if (data) {
        this.getTansactionData();
      }
    });

    this.searchChangeEventSubscription = this.sharedserive.searchDataChange.subscribe((data) => {
      console.log('subscribe Data', data);
      if (data) {
        this.searchData(data);
      }

      else {
        this.getTansactionData();
      }
    })

  }


  searchData(searchValue) {
    var payload = {
      'groupId': this.groupId,
      'value': searchValue
    }

    this.isApiCalling = true;
    this.isShimmerloding = true;

    this.http.getAccount(ApiUrl.getTransactionsSearch, payload).subscribe(res => {

      this.isApiCalling = false;
      this.isShimmerloding = false;

      this.http.showLoader();
      if (res.data != undefined) {
        this.transactionList = [];
        this.resultsLength = res.data.totalTransactions;
        this.transactionList = res.data;
        console.log(this.transactionList)
      }
    });

  }



  getTansactionData() {

    this.isApiCalling = true;
    this.isShimmerloding = true;

    if (this.groupId) {
      var payload = {
        pageIndex: this.pageIndex,
        limit: 10,
        startDate: this.startDate,
        endDate: this.endDate,
        'groupId': this.groupId
      }

      this.http.getAccount(ApiUrl.getbill, payload).subscribe(res => {

        this.isApiCalling = false;
        this.isShimmerloding = false;

        this.http.showLoader();
        if (res.data != undefined) {
          this.transactionList = [];
          this.resultsLength = res.data.totalTransactions;
          this.transactionList = res.data.data;
          console.log(this.transactionList)
        }
      });
    }
  }


  onFilterChange(type) {
    console.log(type);

    switch (type) {
      case 'Daily':
        this.onDailyList();
        break;
      case 'Weekly':
        this.onWeeklyList();
        break;
      case 'Monthly':
        this.onMonthlyList();
        break;
      case 'Quaterly':
        this.onQuaterlyList();
        break;
      case 'Yearly':
        this.onYearlyList();
        break;
      default:
        break;
    }
  }


  onDailyList() {
    this.startDate = "";
    this.startDate = "";
    this.pageIndex = 0;
    this.resultsLength = 0;
    this.getTansactionData();
  }

  onWeeklyList() {
    let startOfWeek: any = moment().startOf('isoWeek');;
    let endOfWeekany: any = moment().endOf('isoWeek');

    this.startDate = moment(startOfWeek).format('YYYY-MM-DD');
    this.endDate = moment(endOfWeekany).add(1, 'day').format('YYYY-MM-DD');
    this.pageIndex = 0;
    this.resultsLength = 0;

    if (this.startDate && this.endDate) {
      this.getTansactionData();
    }
  }


  onMonthlyList() {
    let month: any;

    this.startDate = moment(month).startOf('month').format('YYYY-MM-DD');
    this.endDate = moment(month).endOf('month').add(1, 'day').format('YYYY-MM-DD');
    this.pageIndex = 0;
    this.resultsLength = 0;

    console.log(this.startDate, this.endDate);

    if (this.startDate && this.endDate) {
      this.getTansactionData();
    }
  }

  onQuaterlyList() {
    let quater: any;

    this.startDate = moment(quater).startOf('quarter').format('YYYY-MM-DD');
    this.endDate = moment(quater).endOf('quarter').add(1, 'day').format('YYYY-MM-DD');
    this.pageIndex = 0;
    this.resultsLength = 0;

    console.log(this.startDate, this.endDate);

    if (this.startDate && this.endDate) {
      this.getTansactionData();
    }
  }


  onYearlyList() {
    let year: any;

    this.startDate = moment(year).startOf('year').format('YYYY-MM-DD');
    this.endDate = moment(year).endOf('year').add(1, 'day').format('YYYY-MM-DD');
    this.pageIndex = 0;
    this.resultsLength = 0;

    console.log(this.startDate, this.endDate);

    if (this.startDate && this.endDate) {
      this.getTansactionData();
    }
  }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    let startDate: Date = new Date(dateRangeStart.value);
    let endDate: Date = new Date(dateRangeEnd.value);

    let startMonth = startDate.getMonth() + 1;
    let endMonth = endDate.getMonth() + 1;

    let endGetDate = endDate.getDate() + 1;

    this.startDate = startDate.getFullYear() + '-' + startMonth + '-' + startDate.getDate();
    this.endDate = endDate.getFullYear() + '-' + endMonth + '-' + endGetDate;

    if (dateRangeStart.value && dateRangeEnd.value) {
      this.getTansactionData();
    }
  }

  pageChange(event) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.getTansactionData();
  }


  editEntry(id) {
    this.router.navigate(['/update-entry/' + id]);
  }

  deleteTransaction(id, beneficiaryName) {
    console.log(id, beneficiaryName)
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
