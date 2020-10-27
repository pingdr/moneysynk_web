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
  public accountreportsLabels: string[] = ['Income', 'Expense'];
  public accountreports: number[] = [600, 100];

  public accountColors: any[] = [
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
  resultsLength: any;
  accountType_id: any;
  constructor(public http: HttpService, public activeRoute: ActivatedRoute, public changeDetect: ChangeDetectorRef, public sharedserive: SharedService,
    private _router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog) {


  }

  ngOnInit(): void {

    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      if (data) {
        this.accountList = [];
        this.accountTypeList = [];
        this.isSelected = 0
        this.changeDetect.detectChanges();
        this.getAccountTypedata();
        // this.getAccountdata();
      }
    });
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


  getAccountTypedata() {

    var payload = {
      "groupId": this.groupId
    }

    this.http.getAllAccountType(ApiUrl.getAllAccountType, payload).subscribe(res => {
      if (res.data != undefined) {
        this.accountTypeList = [];
        this.accountTypeList = res.data;
        console.log('this.accountTypeList');
        console.log(this.accountTypeList);
        this.accountType_id = res.data[0]._id;

        this.getAccountdata();

      }
    });

  }

  getAccountdata() {

    var payload = {
      "groupId": this.groupId,
      pageIndex: 0,
      limit: 10,
      accountType: this.accountType_id
    }

    this.isApiCalling = true;
    this.http.getAccount(ApiUrl.getAccount, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data != undefined) {
        this.accountList = [];
        this.resultsLength = res.data.data.length;
        this.accountList = res.data.data;
        for (let i = 0; i < this.accountList.length; i++) {
          this.accountList[i]['isViewAmount'] = true;
        }
        // this.filter = res.data;
      }
    });

  }
  toggleAmount(i) {
    this.accountList[i]['isViewAmount'] = !this.accountList[i]['isViewAmount']
  }

  deleteAccounts(id, name) {
    let self = this;
    this.accountName = name;
    let dialogRef = this.dialog.open(this.DeleteAccountDialog, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {
      // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
      if (result !== undefined) {
        if (result === 'yes') {
          this.isApiCalling = true;
          this.http.deleteAccount(ApiUrl.deleteAccount, id, false).subscribe(res => {
            this.toastr.success('Account deleted successfully', 'success', {
              timeOut: 2000
            });
            this.isApiCalling = false;
            this.getAccountdata();
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
  recordSelected(i) {
    if (i || i == 0)
      this.isRecordSelected = i;
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
      // this.getAccountTypedata();
      // this.getAccountdata();
      window.location.reload()
    });
  }

  getType(id, i?: any) {
    if (i || i == 0)
      this.isSelected = i;
    this.accountType_id = id
    var payload = {
      "groupId": this.groupId,
      "pageIndex": 0,
      "limit": 10,
      "accountType": id

    }

    this.isApiCalling = true;
    this.http.getAccountById(ApiUrl.getAccountById, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data != undefined) {
        this.accountList = res.data.data;
        // this.filter = res.data;
      }
    });
  }

  deleteType(id, categoryName) {
    this.accountName = categoryName;
    let typeDialogRef = this.dialog.open(this.DeleteAccountTypeDialog, {
      width: '350px'
    });

    typeDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'yes') {
          this.isApiCalling = true;
          this.http.deleteAccountTypes(ApiUrl.deleteAccountTypes, id, false).subscribe(res => {
            this.toastr.success('Account type deleted successfully', 'success', {
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



