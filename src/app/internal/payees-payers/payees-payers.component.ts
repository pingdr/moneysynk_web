import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { AddPayeeComponent } from 'src/app/shared/modals/add-payee/add-payee.component';

@Component({
  selector: 'app-payees-payers',
  templateUrl: './payees-payers.component.html',
  styleUrls: ['./payees-payers.component.scss']
})
export class PayeesPayersComponent implements OnInit {
  dialogRefofOtpModal: MatDialogRef<AddPayeeComponent>;
  type: any = "PAYEE";
  payeesArray: any = [];
  payersArray: any = [];
  groupId: any;
  isRecordSelected: any = 0;
  constructor(public dialog: MatDialog, public sharedserive: SharedService, public http: HttpService,) { }

  ngOnInit(): void {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;
      if (data) {
        this.getPayees();
      }
    });
  }
  step = 0;
  getPayees() {
    this.http.get(ApiUrl.getAllPayees + "?groupId=" + this.groupId).subscribe(res => {
      this.http.showLoader();
      if (res.data != undefined) {
        for (let index = 0; index < res.data.length; index++) {
          if (res.data[index].type === "PAYEE") {
            this.payeesArray.push(res.data[index]);
          } else {
            this.payersArray.push(res.data[index]);
          }
        }
        // this.categories = res.data;
        // this.filter = res.data;
      }
    });
  }
  recordSelected(i) {
    if (i || i == 0)
    this.isRecordSelected = i;
  }

  setStep(index: number) {
    this.step = index;
  }
  setType(type) {
    this.type = type;
  }
  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  openCategorymodal() {
    const dialogRef = this.dialog.open(AddPayeeComponent, {
      width: '523px',
      panelClass: 'edit-account-main',
      data: { type: this.type, groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.payeesArray = [];
      this.payersArray = [];
      this.getPayees();
    });
  }

}
