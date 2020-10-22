import { Component, OnInit } from '@angular/core';
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


  arrayLength = 10;

  config: Slick.Config = {
      infinite: false,
      slidesToShow: 6,
      // slidesToScroll: 2,
      // dots: true,
      // autoplay: true,
      // autoplaySpeed: 2000 
    }

  getArray(count: number) {
    return new Array(count)
  }

 
  groupId:any;
  myModel: TableModel;
  search = new FormControl();
  accountList:any = [];
  accountTypeList:any = [];
  filter = [];
  isSelected: any = 0;
  isRecordSelected: any = 0;
  constructor(public http: HttpService, public activeRoute: ActivatedRoute,public sharedserive:SharedService,
    private _router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog) {
   

  }

  ngOnInit(): void {

    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
     if(data){
      this.accountList = [];
      this.accountTypeList = [];
      this.getAccountdata();
      this.getAccountTypedata();
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
      "groupId":this.groupId
    }
  
    this.http.getAllAccountType(ApiUrl.getAllAccountType,payload).subscribe(res => {
      if (res.data != undefined) {
        this.accountTypeList = [];
        this.accountTypeList = res.data;
       
      }
    });

  }

  getAccountdata() {

    var payload = {
      "groupId":this.groupId
    }
  

    this.http.getAccount(ApiUrl.getAccount,payload).subscribe(res => {
      this.http.showLoader();
      if (res.data != undefined) {
        this.accountList = [];
        this.accountList = res.data;
        // this.filter = res.data;
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
  // filterData(i, id) {
  //   if (i || i == 0)
  //     this.isSelected = i;
  //   this.accountList = this.filter.filter(filter => filter.accountType === id);
  // }

  editAccounts(data) {
    const dialogRef = this.dialog.open(AddEditAccountComponent, {
      panelClass: 'account-modal-main',
      data: { isforgot: false, editdata: data,groupId:this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAccountTypedata();
      this.getAccountdata();
     
    });
  }

  getType(id,i?: any){
    if (i || i == 0)
    this.isSelected = i;
    
    var payload = {
      "groupId":this.groupId,
      "pageIndex":0,
      "limit":2,
      "accountType":id

    }
  

    this.http.getAccountById(ApiUrl.getAccountById,payload).subscribe(res => {
      this.http.showLoader();
      if (res.data != undefined) {
        this.accountList = res.data;
        // this.filter = res.data;
      }
    });
  }

  deleteType(id){
    const options: SweetAlertOptions = {
      title: 'Are you sure you want to delete this Account type?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      focusCancel: true
    };
    Swal.fire(options).then((result) => {
      if (result.value) {

        this.http.deleteAccountTypes(ApiUrl.deleteAccountTypes, id, false).subscribe(res => {
          this.toastr.success('Account type deleted successfully', 'success', {
            timeOut: 2000
          });
          this.getAccountTypedata();

        });

      }
    })
  }





}
