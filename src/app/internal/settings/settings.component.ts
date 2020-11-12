import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  isApiCalling: boolean = false;
  groupList: any = [];
  groupId: any = '';
  groupName: any = '';

  @ViewChild('deleteGroupDialog') deleteGroupDialog: TemplateRef<any>;
  @ViewChild('editGroupDialog') editGroupDialog: TemplateRef<any>;

  constructor(public http: HttpService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllGroup();
  }
  getAllGroup() {

    this.http.getAllGroup(ApiUrl.addGrop).subscribe(res => {
      if (res.data != undefined) {
        this.groupList = res.data;
      }
    });

  }

  openDeleteGroupDialog(id, name) {
    this.groupId = id;
    this.groupName = name;
    this.dialog.open(this.deleteGroupDialog, {
      width: '350px',
      panelClass: 'custom-modalbox'
    });
  }
  openEditGroupDialog(id, name) {
    this.groupId = id;
    this.groupName = name;
    this.dialog.open(this.editGroupDialog, {
      width: '350px',
      panelClass: 'custom-modalbox'
    });
  }
  editGroup() {
    if(this.groupName != '') {
      this.isApiCalling = true;
      this.http.editGroup(this.groupId,{name:this.groupName}).subscribe((res)=> {
        console.log(res);
        this.closeAllModal();
        this.isApiCalling = false;
        this.getAllGroup();
      })
    }
  }
  deleteGroup() {
    this.isApiCalling = true;
    this.http.deleteGroup(this.groupId).subscribe(
      (data: any) => {
        this.toastr.error("Group Delete Successfully", "Success");
        this.closeAllModal();
        this.getAllGroup();
        this.isApiCalling = false;
      }, err => {
        this.toastr.error("Oops! Something went wrong", 'Error');
        this.isApiCalling = false;
        this.closeAllModal();
      }
    )
  }

  closeAllModal() {
    this.dialog.closeAll();
  }
}
