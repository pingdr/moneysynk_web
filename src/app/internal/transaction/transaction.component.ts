import { Component, OnInit } from '@angular/core';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  groupId:any;
  isApiCalling:boolean = false;
  transactionList:any;
  pageIndex:any = 0;
  resultsLength: any;
  constructor(public http: HttpService,public sharedserive:SharedService,) { }

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
}
