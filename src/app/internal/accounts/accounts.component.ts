import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrl } from 'src/app/services/apiurl';
import { TableModel } from 'src/app/shared/models/table.common.model';
import { HttpService } from '../../services/http.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddEditAccountComponent } from 'src/app/shared/modals/add-edit-account/add-edit-account.component';



@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  myModel: TableModel;
  search = new FormControl();
  accountList = [];
  accountTypeList = [];
  filter = [];
  isSelected: any = 0;
  isRecordSelected: any = 0;
  constructor(public http: HttpService, public activeRoute: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private _router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,) {
    // this.myModel = new TableModel();

    // const tab = this.activeRoute.snapshot.queryParams.tab;
    // const search = this.activeRoute.snapshot.queryParams.search;

  }

  ngOnInit(): void {
    this.getAccountdata();
    this.getAccountTypedata();
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


    this.http.getAllAccountType(ApiUrl.getAllAccountType).subscribe(res => {
      this.SpinnerService.show();
      if (res.data != undefined) {
        this.accountTypeList = res.data;
        console.log(this.accountTypeList);
      }
    });

  }

  getAccountdata() {


    this.http.getAccount(ApiUrl.getAccount).subscribe(res => {
      if (res.data != undefined) {
        this.accountList = res.data;
        this.filter = res.data;
      }
    });

  }


  deleteAccounts(id) {
    let self = this;
    const options: SweetAlertOptions = {
      title: 'Are you sure you want to delete this Account?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      focusCancel: true
    };
    Swal.fire(options).then((result) => {
      if (result.value) {

        this.http.deleteAccount(ApiUrl.deleteAccount, id, false).subscribe(res => {
          this.toastr.success('Account deleted successfully', 'success', {
            timeOut: 2000
          });
          this.getAccountdata();

        });

      }
    })


  }
  recordSelected(i) {
    if (i || i == 0)
    this.isRecordSelected = i;
  }
  filterData(i, id) {
    if (i || i == 0)
      this.isSelected = i;
    this.accountList = this.filter.filter(filter => filter.accountType === id);
  }

  editAccounts(data) {
    const dialogRef = this.dialog.open(AddEditAccountComponent, {
      panelClass: 'account-modal-main',
      data: { isforgot: false, editdata: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }





}
