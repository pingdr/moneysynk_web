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
      this.http.editGroup(this.data.id, { name: this.groupName }).subscribe((res:any) => {
        console.log('Group Response',res);  
        if(res.statusCode==200){
          this.toastr.success('Group Updated Successfully');
        }
        this.hideModal();                      
      })
    }
  }


  hideModal() {
    this.dialogRef.close(this.dialogRef);
  }

}
