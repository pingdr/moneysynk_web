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

  @ViewChild('deleteAccountDialog') DeleteAccountDialog: TemplateRef<any>;
  @ViewChild('deleteAccountTypeDialog') DeleteAccountTypeDialog: TemplateRef<any>;
  accountDetails: any;
  accountSummary: any = [];
  arrayLength = 10;
  isApiCalling: boolean = false;
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
  public doughnutChartLabels: string[] = ['Income', 'Expense'];
  public doughnutChartData: number[] = [100, 600];

  public donutColors: any[] = [
    {
      backgroundColor: [
        '#CA858B',
        '#8BC9D1',

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
    this.http.getAccount(ApiUrl.getAccount, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data != undefined) {
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

  deleteAccounts(id, name) {
    let self = this;
    this.accountName = name;
    let dialogRef = this.dialog.open(this.DeleteAccountDialog, {
      width: '350px',
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
      if (result !== undefined) {
        if (result === 'yes') {
          this.isApiCalling = true;
          this.http.deleteAccount(ApiUrl.deleteAccount, id, false).subscribe(res => {
            this.accountList = [];
            this.accountTypeList = [];
            this.isSelected = 0;
            this.isRecordSelected = 0;
            this.toastr.error('Account deleted successfully', 'success', {
              timeOut: 2000
            });
            this.isApiCalling = false;
            this.getAccountdata();
            this.getAccountTypedata();
          });
        } else if (result === 'no') {

          console.log('User clicked no.');
        }
      }
    })

    // const options: SweetAlertOptions = {
    //   title: 'Are you sure you want to delete this Account?',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: "Confirm",
    //   cancelButtonText: "No",
    //   focusCancel: true,
    // };
    // Swal.fire(options).then((result) => {
    //   if (result.value) {

    //     this.http.deleteAccount(ApiUrl.deleteAccount, id, false).subscribe(res => {
    //       this.toastr.success('Account deleted successfully', 'success', {
    //         timeOut: 2000
    //       });
    //       this.getAccountdata();

    //     });

    //   }
    // })
  }


  // }

  // openDeleteAccountDialog(id) {
  //     this.dialog.open()
  // }
  recordSelected(i, id?) {
    if (i || i == 0)
      this.isRecordSelected = i;

    if (id) {
      this.getAccountDetailsById(id);
      this.getAccountSummary(id);
    }
  }
  // filterData(i, id) {
  //   if (i || i == 0)
  //     this.isSelected = i;
  //   this.accountList = this.filter.filter(filter => filter.accountType === id);
  // }

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
      // this.getAccountdata();
      // window.location.reload()
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
    this.http.getAccountById(ApiUrl.getAccountById, payload).subscribe(res => {
      this.isApiCalling = false;
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

  deleteType(id, categoryName) {
    this.accountName = categoryName;
    let typeDialogRef = this.dialog.open(this.DeleteAccountTypeDialog, {
      width: '350px',
      panelClass: 'custom-modalbox'
    });

    typeDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'yes') {
          this.isApiCalling = true;
          this.http.deleteAccountTypes(ApiUrl.deleteAccountTypes, id, false).subscribe(res => {
            this.accountTypeList = [];
            this.accountList = [];
            this.isSelected = 0;
            this.isRecordSelected = 0;
            this.toastr.error('Account type deleted successfully', 'success', {
              timeOut: 2000
            });
            this.getAccountTypedata();
            this.isApiCalling = false;
          }, () => {
            this.toastr.error('Something went wrong', 'OOPS!');
            this.isApiCalling = false;
          });
        }
      }
    })


    // const options: SweetAlertOptions = {
    //   title: 'Are you sure you want to delete this Account type?',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: "Yes",
    //   cancelButtonText: "No",
    //   focusCancel: true
    // };
    // Swal.fire(options).then((result) => {
    //   if (result.value) {

    //     this.http.deleteAccountTypes(ApiUrl.deleteAccountTypes, id, false).subscribe(res => {
    //       this.toastr.success('Account type deleted successfully', 'success', {
    //         timeOut: 2000
    //       });
    //       this.getAccountTypedata();

    //     });

    //   }
    // })
  }

}



