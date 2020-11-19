import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
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

  constructor(public http: HttpService, public dialogRef: MatDialogRef<AddBudgetModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.type = this.data.type
    this.editaccount = this.formBuilder.group({
      name: ['', Validators.required],
      type: [this.type],
      currentBalance: ['', Validators.required],
      groupId: [this.data.groupId],
      icon: ['', Validators.required],
      note: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  get f() { return this.editaccount.controls; }
  setType(type) {
    this.type = type;
  }


  ngOnInit(): void {
    this.getAllIcon();
  }


  onSubmit() {
    this.submitted = true;
    console.log(this.editaccount.invalid);

    // stop here if form is invalid
    if (this.editaccount.invalid) {
      return;
    }

    this.loader = true;
    this.isApiCalling = true;

    console.log(this.editaccount.value);

    const data = {
      "name": this.editaccount.value.name,
      "icon": this.editaccount.value.icon,
      "type": this.type,
      "startDate": new Date(this.editaccount.value.startDate),
      "currentBalance": this.editaccount.value.currentBalance,
      "endDate": new Date(this.editaccount.value.endDate),
      "cycle": {
        "period": "DAY",
        "value": "2"
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


  getAllIcon() {
    this.isApiCalling = true;
    this.http.get(ApiUrl.icons).subscribe((res) => {
      this.isApiCalling = false;
      this.icons = res.data;
      if (this.data.editdata != undefined) {
        this.isSelected = this.icons.findIndex(x => x.path === this.data.editdata.icon);
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
  // ----Popup-close----------//

}
