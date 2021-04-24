import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-edit-group-modal',
  templateUrl: './edit-group-modal.component.html',
  styleUrls: ['./edit-group-modal.component.scss']
})
export class EditGroupModalComponent implements OnInit {


  groupName: any;
  isEditGroup: Boolean = false;
  isSpinnerLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditGroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public http: HttpService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.data.name) {
      this.groupName = this.data.name;
      this.isEditGroup = true;
    } else {
      this.groupName = '';
      this.isEditGroup = false;
    }
  }

  editGroup() {
    if (this.groupName != '') {
      // if (!isNaN(this.groupName)) {
      //   this.toastr.error('only number is not allow', 'error', {
      //     timeOut: 2000
      //   });
      //   return;
      // }
      var regex = new RegExp("[a-zA-Z][a-zA-Z ]*");

      if (!regex.test(this.groupName)) {
        this.toastr.error('Please enter valid group name', 'Invalid');
      } else {

        this.isSpinnerLoading = true;

        if (this.isEditGroup) {
          this.http.editGroup(this.data.id, { name: this.groupName }).subscribe((res: any) => {
            console.log('Group Response', res);
            if (res.statusCode == 200) {
              this.toastr.success('Group updated Successfully');
            }
            this.dialogRef.close('Updated');
            this.isSpinnerLoading = false;
          }, () => {
            this.isSpinnerLoading = false;
          })
        } else {

          var payload = {
            "name": this.groupName
          }

          this.http.addGroup(ApiUrl.addGrop, payload, false)
            .subscribe(res => {
              let response = res;
              if (response.statusCode == 200) {
                this.toastr.success('Group added successfully', 'success')
                // this.sharedService.getSettingsGroupList();

                this.dialogRef.close('Added');
                this.isSpinnerLoading = false;
              }

            }, () => {
              this.isSpinnerLoading = false;
            });
        }

      }
    }
  }


  hideModal() {
    this.dialogRef.close('no');
  }


  special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));


  }


}
