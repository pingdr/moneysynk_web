import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-edit-group-modal',
  templateUrl: './edit-group-modal.component.html',
  styleUrls: ['./edit-group-modal.component.scss']
})
export class EditGroupModalComponent implements OnInit {


  groupName: any;

  constructor(
    public dialogRef: MatDialogRef<EditGroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public http: HttpService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {    
    if (this.data.name) {
      this.groupName = this.data.name;
    }
  }

  editGroup() {    
    if (this.groupName != '') {
      if (!isNaN(this.groupName)) {
        this.toastr.error('only number is not allow', 'error', {
          timeOut: 2000
        });
        return;
      }
           
      this.http.editGroup(this.data.id, { name: this.groupName }).subscribe((res:any) => {
        console.log('Group Response',res);  
        if(res.statusCode==200){
          this.toastr.success('Group updated Successfully');
        }
        this.hideModal();                      
      })
    }
  }


  hideModal() {
    this.dialogRef.close(this.dialogRef);
  }


  special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));


  }


}
