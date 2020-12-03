import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { range } from 'rxjs';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-add-budget-modal',
  templateUrl: './add-budget-modal.component.html',
  styleUrls: ['./add-budget-modal.component.scss']
})
export class AddBudgetModalComponent implements OnInit {

  selected = 'option2';
  editaccount: FormGroup;
  submitted = false;
  type: any;
  icons: any;
  public loader = false;
  isApiCalling: boolean = false;;
  isSelected: any = 0;
  isDisabledCycleDatys: boolean = false;
  budgetData: any = {};
  isEdit: boolean = false;

  cyclePeriod: any = [
    { value: 'NO_CYCLE', name: 'No Cycle' },
    { value: 'DAY', name: 'Day' },
    { value: 'WEEK', name: 'Week' },
    { value: 'SEMIMONTHLY', name: 'Semimonthly' },
    { value: 'MONTH', name: 'Month' },
    { value: 'YEAR', name: 'Year' }
  ]

  cycleValue: Array<any> = []

  constructor(public http: HttpService, public dialogRef: MatDialogRef<AddBudgetModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.type = this.data.type
    this.editaccount = this.formBuilder.group({
      name: ['', Validators.required],
      type: [this.type],
      currentBalance: ['', Validators.required],
      groupId: [this.data.groupId],
      icon: ['', Validators.required],
      note: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      cyclePeriod: ['', Validators.required],
      cycleValue: ['', Validators.required],

    });
  }

  get f() { return this.editaccount.controls; }
  setType(type) {
    this.type = type;
  }


  ngOnInit(): void {
    this.cycleValue = Array.from({ length: 60 }, (i, k) => k + 1);

    if (this.data.objBudget) {
      this.budgetData = this.data.objBudget;
      this.budgetData.cycle.value = parseInt(this.budgetData.cycle.value);
      this.isEdit = true;

      this.checkCycleType(this.budgetData.cycle)
    }

    this.getAllIcon();
  }

  checkCycleType(data) {
    if (data.period == 'NO_CYCLE' || data.period == 'SEMIMONTHLY') {
      this.isDisabledCycleDatys = true;
    } else {
      this.isDisabledCycleDatys = false;
    }
  }


  onSelectCycleType(event) {
    if (event.value == 'NO_CYCLE' || event.value == 'SEMIMONTHLY') {
      this.isDisabledCycleDatys = true;
      this.editaccount.controls.cycleValue.setValue('');
    } else {
      this.isDisabledCycleDatys = false;
    }
  }

  onSubmit() {

    this.submitted = true;
    console.log(this.editaccount.invalid);

    console.log(this.editaccount.value);

    // stop here if form is invalid
    if (this.editaccount.invalid && !this.isDisabledCycleDatys) {
      return;
    }

    this.loader = true;
    this.isApiCalling = true;


    if (this.budgetData._id) {
      const data = {
        "name": this.editaccount.value.name,
        "icon": this.editaccount.value.icon,
        "type": this.type,
        "startDate": new Date(this.editaccount.value.startDate),
        "endDate": new Date(this.editaccount.value.endDate),
        "cycle": {
          "period": this.editaccount.value.cyclePeriod,
          "value": this.editaccount.value.cycleValue.toString()
        },
        "note": this.editaccount.value.note,
        "groupId": this.editaccount.value.groupId
      };

      this.http.addEditBudget(ApiUrl.addEditBudget + '/' + this.budgetData._id, data, false)
        .subscribe(res => {
          this.isApiCalling = false;
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Budget Update successfully', 'success', {
              timeOut: 2000
            });
          }
          this.dialogRef.close(this.dialogRef);
          this.http.navigate('budget');
        },
          () => {
            this.isApiCalling = false;
            this.loader = false;
          });
    } else {

      const data = {
        "name": this.editaccount.value.name,
        "icon": this.editaccount.value.icon,
        "type": this.type,
        "startDate": new Date(this.editaccount.value.startDate),
        "endDate": new Date(this.editaccount.value.endDate),
        "currentBalance":this.editaccount.value.currentBalance,
        "cycle": {
          "period": this.editaccount.value.cyclePeriod,
          "value": this.editaccount.value.cycleValue.toString()
        },
        "note": this.editaccount.value.note,
        "groupId": this.editaccount.value.groupId
      };

      this.http.addEditBudget(ApiUrl.addEditBudget, data, false)
        .subscribe(res => {
          this.isApiCalling = false;
          let response = res;
          if (response.statusCode == 200) {
            this.toastr.success('Budget added successfully', 'success', {
              timeOut: 2000
            });
          }
          this.dialogRef.close(this.dialogRef);
          this.http.navigate('budget');
        },
          () => {
            this.isApiCalling = false;
            this.loader = false;
          });
    }
  }


  getAllIcon() {
    this.isApiCalling = true;
    this.http.get(ApiUrl.icons).subscribe((res) => {
      this.isApiCalling = false;
      this.icons = res.data;
      if (this.data.editdata != undefined) {
        this.isSelected = this.icons.findIndex(x => x.path === this.data.editdata.icon);
      }

      if (this.budgetData.icon != undefined) {
        this.isSelected = this.icons.findIndex(x => x.path === this.budgetData.icon);
        this.editaccount.controls.icon.setValue(this.budgetData.icon);
      }
    })
  }

  selectIcon(i, path) {
    if (i || i == 0)
      this.isSelected = i;
    this.editaccount.controls.icon.setValue(path);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  // ----Popup-close----------//

}
