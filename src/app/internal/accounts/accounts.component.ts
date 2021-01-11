import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/services/apiurl';
import { TableModel } from 'src/app/shared/models/table.common.model';
import { HttpService } from '../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddEditAccountComponent } from 'src/app/shared/modals/add-edit-account/add-edit-account.component';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { Slick } from 'ngx-slickjs';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from 'src/app/services/CustomPaginatorConfiguration';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class AccountsComponent implements OnInit {

  accountDetails: any = [];
  accountSummary: any = [];
  accountSummaryId: any;
  isAccountSummaryType: any = false;
  accountSummaryData: any = [];
  arrayLength = 10;
  accountDetailShimmer = true
  accountSummaryDataShimmer = true
  summeryType: string
  accountSummaryDataTotal = '';

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

  accountSummaryPageIndex = 0;
  accountSummarydataPageIndex = 0;
  accountSummaryPageIndexTotal = '';

  searchChangeEventSubscription: Subscription;



  constructor(public http: HttpService, public activeRoute: ActivatedRoute, public changeDetect: ChangeDetectorRef, public sharedserive: SharedService,
    private _router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.accountTypeList = [];

    this.sharedserive.groupChange.subscribe((data) => {
      this.isSelected = null;
      if (data) {
        this.groupId = data;
        console.log(data);

        this.accountList = [];
        this.accountTypeList = [];
        this.accountDetails = [];
        this.accountSummary = [];
        this.accountSummaryData = [];

        this.accountSummaryId = '';
        this.isAccountSummaryType = false;
        this.accountDetailShimmer = true;

        this.accountSummaryPageIndex = 0;
        this.accountSummaryPageIndexTotal = '';


        this.donutColors = [
          {
            backgroundColor: [
            ]
          }
        ];

        this.doughnutChartData = [
          1
        ];
        this.doughnutChartLabels = [
          'Empty'
        ]

        this.accountType_id = "";
        this.getAccountTypedata();

      }
    });

    this.searchChangeEventSubscription = this.sharedserive.searchDataChange.subscribe((data) => {
      console.log('subscribe Data', data);
      if (data) {
        this.searchData(data);
      } else {
        this.accountTypeList = [];
        this.getAccountTypedata();
      }
    })

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
    this.accountSummaryDataShimmer = true
    this.summeryType = type
    if (this.summeryType == "Income") {
      var payload = {
        "groupId": this.groupId,
        "accountId": this.accountSummaryId,
        "transactionType": "IN",
        "pageIndex": this.accountSummarydataPageIndex,
        "limit": 5,

      }
      this.isAccountSummaryType = true;
    } else {
      var payload = {
        "groupId": this.groupId,
        "accountId": this.accountSummaryId,
        "transactionType": "OUT",
        "pageIndex": this.accountSummarydataPageIndex,
        "limit": 5,
      }
      this.isAccountSummaryType = false;
    }


    this.http.get(ApiUrl.getAccountSummary, payload).subscribe((res) => {
      console.log('Account Summary Detail Data', res);
      if (res && res.data) {
        if (res.data.data != undefined) {
          this.accountSummaryDataShimmer = false
          this.accountSummaryData = res.data.data;
          this.accountSummaryDataTotal = res.data.totalTransaction
          console.log('totalnumber', this.accountSummaryDataTotal);
          this.setDoughnutChartData(res.data.data);
        } else {
          this.accountSummaryData = [];
          this.setDoughnutChartData(this.accountSummaryData);
        }
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
    if (this.groupId) {
      var payload = {
        "groupId": this.groupId
      }

      this.http.getAllAccountType(ApiUrl.getAllAccountType, payload).subscribe(res => {
        if (res.data != undefined) {
          if (this.accountTypeList.length == 0) {
            this.accountTypeList = res.data;
            console.log('this.accountTypeList');
            console.log(this.accountTypeList);
            this.accountType_id = res.data[0]._id;
            this.isSelected = 0;
          }
          this.getAccountdata();
        }
      });
    }

  }
  getAccountDetailsById(id) {
    this.isApiCalling = true;
    var payload = {
      year: 1,
      groupId: this.groupId,
      accountId: id,
      limit: 5,
      pageIndex: this.accountSummaryPageIndex
    }
    this.http.get(ApiUrl.accountMonths, payload).subscribe((res) => {
      this.accountDetailShimmer = false;
      console.log('Account Details ', res);
      if (res.data.length != 0) {
        this.accountDetails = res.data;
        console.log('this.accountDetails')
        console.log(this.accountDetails)

        if (this.accountSummaryPageIndexTotal != '' || !this.accountSummaryPageIndexTotal) {
          this.accountSummaryPageIndexTotal = res.data[0].totalTransaction;
        }
      } else {
        this.accountSummaryPageIndexTotal = '0';
        this.accountDetails = [];
      }
      this.isApiCalling = false;
    })
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

  totalBalance(totalIncom, totalExpanse) {
    let totalBalance = totalIncom - totalExpanse;
    return Math.abs(totalBalance);
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
        this.accountDetailShimmer = false
        this.accountList = [];
        this.resultsLength = res.data.total;
        this.accountList = res.data.data;

        if (res.data.data.length > 0) {
          this.getAccountDetailsById(res.data.data[0]._id)
          this.getAccountSummary(res.data.data[0]._id)
        }
        for (let i = 0; i < this.accountList.length; i++) {
          this.accountList[i]['isViewAmount'] = true;
        }
      }
    });

    setTimeout(() => {
      let elem = document.getElementById('accountList0') as HTMLDivElement;
      if (elem) {
        elem.click();
      }
    }, 1000)
  }

  pageChange(event) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.getAccountdata();
  }

  accountSummaryDataEvent(event) {
    this.accountSummarydataPageIndex = event.pageIndex
    this.getSummaryDetails(this.summeryType)
  }

  accountDetailPageChange(event) {
    console.log(event, this.accountSummaryId);
    this.accountSummaryPageIndex = event.pageIndex;
    this.getAccountDetailsById(this.accountSummaryId);
  }

  toggleAmount(i) {
    this.accountList[i]['isViewAmount'] = !this.accountList[i]['isViewAmount']
  }

  recordSelected(i, id?) {
    this.accountDetailShimmer = true;
    this.accountSummaryDataShimmer = true;
    if (i || i == 0)
      this.isRecordSelected = i;

    if (id) {
      this.getAccountDetailsById(id);
      this.getAccountSummary(id);
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

    this.accountDetails = [];
    this.accountSummaryData = []
    this.accountDetailShimmer = true

    console.log('Acount Type ID :: ', id);


    this.resultsLength = 0;
    if (i || i == 0)
      this.isSelected = i;
    this.accountType_id = id
    this.pageIndex = 0;
    this.isRecordSelected = 0;


    var payload = {
      "groupId": this.groupId,
      "pageIndex": this.pageIndex,
      "limit": 10,
      "accountType": id

    }

    this.isApiCalling = true;
    this.isShimmerloading = true;
    this.http.getAccountById(ApiUrl.getAccountById, payload).subscribe(res => {
      this.accountDetailShimmer = false
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
          this.getAccountdata();
          this.getAccountDetailsById(res.data.data[0]._id)
          this.getAccountSummary(res.data.data[0]._id)
        } else {
          this.accountDetails = [];
          this.accountSummary = [];
          this.accountSummaryData = [];

          this.accountSummaryId = '';
          this.isAccountSummaryType = false;
          this.accountSummaryPageIndex = 0;
          this.accountSummaryPageIndexTotal = '';


          this.donutColors = [
            {
              backgroundColor: [
              ]
            }
          ];

          this.doughnutChartData = [
            1
          ];
          this.doughnutChartLabels = [
            'Empty'
          ]
        }
        for (let i = 0; i < this.accountList.length; i++) {
          this.accountList[i]['isViewAmount'] = true;
        }
      }
    });
  }

  searchData(searchValue) {
    console.log(searchValue)

    const payload = {
      'value': searchValue,
      'groupId': this.groupId,
    }

    this.isApiCalling = true;
    this.isShimmerloading = true;
    this.http.getAccount(ApiUrl.searchAccount, payload).subscribe(res => {

      this.isApiCalling = false;
      this.isShimmerloading = false;

      this.http.showLoader();
      console.log(res)

      if (res.data != undefined) {
        this.accountList = [];
        this.resultsLength = res.data.total;
        this.accountList = res.data;

        if (res.data.data.length > 0) {
          this.getAccountDetailsById(res.data[0]._id)
          this.getAccountSummary(res.data[0]._id)
        }
        for (let i = 0; i < this.accountList.length; i++) {
          this.accountList[i]['isViewAmount'] = true;
        }
      }
    });


  }

}



