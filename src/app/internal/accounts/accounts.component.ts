import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/services/apiurl';
import { TableModel } from 'src/app/shared/models/table.common.model';
import { HttpService } from '../../services/http.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddEditAccountComponent } from 'src/app/shared/modals/add-edit-account/add-edit-account.component';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { Slick } from 'ngx-slickjs';



@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  accountDetails: any;
  accountSummary: any = [];
  accountSummaryId: any;
  isAccountSummaryType: any = false;
  accountSummaryData: any = [];
  arrayLength = 10;

  isApiCalling: boolean = false;
  isShimmerloading: boolean = false;
  monthlyData: any = '';

  accountName: string = '';
  config: Slick.Config = {
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 2,
    // dots: true,
    // autoplay: true,
    // autoplaySpeed: 2000 
  }

  getArray(count: number) {
    return new Array(count)
  }

  groupId: any;
  myModel: TableModel;
  search = new FormControl();
  accountList: any = [];
  accountTypeList: any = [];
  chartOptions = {
    responsive: true,
    weight: 4
  };

  //  ----------------for first chart-----------//
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public colors: any = [
    '#CA858B',
    '#8BC9D1',
    '#88DCBA',
    '#416B96',
    '#B543A4',
    '#D0C544',
    '#C2C2C2',
    '#A8C395',
    '#7FD1CD',
    '#957FD1',
  ];

  public donutColors: any[] = [
    {
      backgroundColor: [
      ]
    }
  ];

  filter = [];
  isSelected: any = 0;
  isRecordSelected: any = 0;
  resultsLength: any = 0;
  accountType_id: any;
  pageIndex: any = 0;
  constructor(public http: HttpService, public activeRoute: ActivatedRoute, public changeDetect: ChangeDetectorRef, public sharedserive: SharedService,
    private _router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog) {
    this.sharedserive.groupChange.subscribe((data) => {
      this.isSelected = null;
      if (data) {
        this.groupId = data;
        console.log(data);

        this.accountList = [];
        this.accountTypeList = [];
        // this.isSelected = 0
        this.accountType_id = "";
        this.getAccountTypedata();
        // this.getAccountdata();
      }
    });

  }

  ngOnInit(): void {


  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  getSummaryDetails(type) {
    if (type == "Income") {
      var payload = {
        "groupId": this.groupId,
        "accountId": this.accountSummaryId,
        "transactionType": "IN"
      }
      this.isAccountSummaryType = true;
    } else {
      var payload = {
        "groupId": this.groupId,
        "accountId": this.accountSummaryId,
        "transactionType": "OUT"
      }
      this.isAccountSummaryType = false;
    }


    this.http.get(ApiUrl.getAccountSummary, payload).subscribe((res) => {
      console.log('Account Summary Detail Data', res);
      if (res && res.data) {
        if (res.data.data != undefined) {
          this.accountSummaryData = res.data.data;
          this.setDoughnutChartData(res.data.data);
        } else {
          this.accountSummaryData = [];
          this.setDoughnutChartData(this.accountSummaryData);
        }
      }
    });
  }

  getMonthlyTransactionData(accountId) {
    console.log(accountId);

    const payload = {
      "year": "1",
      "groupId": this.groupId,
      "accountId": accountId
    }

    this.http.getMonthlySummarydata("accounts/getMonthlyData", payload).subscribe((res: any) => {
      debugger
      console.log(res);
      if (res.data) {
        this.monthlyData = res.data[0].total;
      }
    });
  }

  setDoughnutChartData(data) {
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    this.donutColors[0].backgroundColor = [];

    if (data.length != 0) {
      for (let index = 0; index < data.length; index++) {
        console.log(data[index]);
        this.doughnutChartLabels.push(data[index].name);
        this.doughnutChartData.push(data[index].percentage);

        var random_color = this.colors[Math.floor(Math.random() * this.colors.length)]
        this.donutColors[0].backgroundColor.push(random_color)
      }
    } else {
      this.doughnutChartData = [
        1
      ];
      this.doughnutChartLabels = [
        'Empty'
      ]
    }
  }


  getAccountSummary(id) {

    var payload = {
      "groupId": this.groupId,
      "accountId": id
    }

    this.http.get(ApiUrl.getAccountSummary, payload).subscribe((res) => {
      console.log('Account Summary', res);
      if (res && res.data) {
        this.accountSummary = res.data;
      }
    });

  }

  getAccountTypedata() {

    this.isShimmerloading = true;
    var payload = {
      "groupId": this.groupId
    }

    this.http.getAllAccountType(ApiUrl.getAllAccountType, payload).subscribe(res => {
      this.accountTypeList = [];
      if (res.data != undefined) {
        this.accountTypeList = res.data;
        console.log('this.accountTypeList');
        console.log(this.accountTypeList);
        this.accountType_id = res.data[0]._id;
        this.isSelected = 0;
        this.getAccountdata();
      }
    });

  }
  getAccountDetailsById(id) {
    this.isApiCalling = true;
    var payload = {
      year: 1,
      groupId: this.groupId,
      accountId: id
    }
    this.http.get(ApiUrl.accountMonths, payload).subscribe((res) => {
      this.isApiCalling = false;
      console.log('Account Details ', res);
      this.accountDetails = res.data;
    })
  }
  getAccountdata() {

    var payload = {
      "groupId": this.groupId,
      pageIndex: this.pageIndex,
      limit: 10,
      accountType: this.accountType_id
    }

    this.isApiCalling = true;
    this.isShimmerloading = true;
    this.http.getAccount(ApiUrl.getAccount, payload).subscribe(res => {

      this.isApiCalling = false;
      this.isShimmerloading = false;

      this.http.showLoader();
      if (res.data != undefined) {
        this.accountList = [];
        this.resultsLength = res.data.total;
        this.accountList = res.data.data;
        if (res.data.data.length > 0) {
          this.getAccountDetailsById(res.data.data[0]._id)
          this.getAccountSummary(res.data.data[0]._id)
          this.getMonthlyTransactionData(res.data.data[0]._id)
        }
        for (let i = 0; i < this.accountList.length; i++) {
          this.accountList[i]['isViewAmount'] = true;
        }
        // this.filter = res.data;
      }
    });
  }
  pageChange(event) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.getAccountdata();
  }
  toggleAmount(i) {
    this.accountList[i]['isViewAmount'] = !this.accountList[i]['isViewAmount']
  }

  recordSelected(i, id?) {
    if (i || i == 0)
      this.isRecordSelected = i;

    if (id) {
      this.getAccountDetailsById(id);
      this.getAccountSummary(id);
      this.getMonthlyTransactionData(id);
      this.accountSummaryId = id;
      this.getSummaryDetails('Expanse');
    }
  }


  editAccounts(data) {
    const dialogRef = this.dialog.open(AddEditAccountComponent, {
      panelClass: 'account-modal-main',
      data: { isforgot: false, editdata: data, groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.accountTypeList = [];
      this.accountList = [];
      this.getAccountTypedata();
      this.getAccountdata();
    });
  }

  deleteAccount(id, accountName, type) {

    console.log(id, accountName, type);

    let dialogRef: any;

    if (type == 'deleteAccountType') {
      dialogRef = this.dialog.open(DeleteModalComponent, {
        panelClass: 'account-modal-main',
        width: '350px',
        data: { type: type, title: 'Account Type', id: id, name: accountName }
      });
    } else {
      dialogRef = this.dialog.open(DeleteModalComponent, {
        panelClass: 'account-modal-main',
        width: '350px',
        data: { type: type, title: 'Account', id: id, name: accountName }
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.accountTypeList = [];
      this.accountList = [];
      this.getAccountTypedata();
      this.getAccountdata();
    });
  }

  getType(id, i?: any) {
    this.resultsLength = 0;
    if (i || i == 0)
      this.isSelected = i;
    this.accountType_id = id
    this.pageIndex = 0;
    var payload = {
      "groupId": this.groupId,
      "pageIndex": this.pageIndex,
      "limit": 10,
      "accountType": id

    }

    this.isApiCalling = true;
    this.isShimmerloading = true;
    this.http.getAccountById(ApiUrl.getAccountById, payload).subscribe(res => {
      this.isApiCalling = false;
      this.isShimmerloading = false;
      this.http.showLoader();
      if (res.data != undefined) {
        if (res.data.data.length > 0) {
          this.resultsLength = res.data.total;
        }
        this.accountList = res.data.data;

        // this.filter = res.data;
        if (res.data.data.length > 0) {
          this.getAccountDetailsById(res.data.data[0]._id)
          this.getAccountSummary(res.data.data[0]._id)
        } else {
          this.accountDetails = null
        }
        for (let i = 0; i < this.accountList.length; i++) {
          this.accountList[i]['isViewAmount'] = true;
        }
      }
    });
  }

}



