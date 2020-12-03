import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';
import { EditGroupModalComponent } from 'src/app/shared/modals/edit-group-modal/edit-group-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';

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
  total: any = 0;
  pageIndex: any = 0;
  isDisabled: boolean = true;

  clickEventsubscription: Subscription

  @ViewChild('deleteGroupDialog') deleteGroupDialog: TemplateRef<any>;
  @ViewChild('editGroupDialog') editGroupDialog: TemplateRef<any>;

  constructor(public http: HttpService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) {

    this.clickEventsubscription = this.sharedService.getClickEvent().subscribe(() => {
      this.getAllGroup();
    })
  }

  ngOnInit(): void {
    this.getAllGroup();
  }
  getAllGroup() {

    var payload = {
      pageIndex: this.pageIndex,
      limit: 10,
    }

    this.http.getAllGroup(ApiUrl.addGrop).subscribe(res => {
      console.log(res);
      if (res.data != undefined) {
        this.total = res.data.length;
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

  pageChange(event) {
    console.log(event);
    this.pageIndex = event.pageIndex;
    this.getAllGroup();
  }

  // editGroup() {
  //   if (this.groupName != '') {
  //     this.isApiCalling = true;
  //     this.http.editGroup(this.groupId, { name: this.groupName }).subscribe((res) => {
  //       console.log(res);
  //       this.closeAllModal();
  //       this.isApiCalling = false;
  //       this.getAllGroup();
  //     })
  //   }
  // }

  deleteGroup(id, groupName) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'deleteGroup', title: 'Group', id: id, name: groupName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllGroup();
      this.sharedService.getSettingsGroupList();
    });
  }

  editGroup(id, groupName) {
    const dialogRef = this.dialog.open(EditGroupModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'editGroup', id: id, name: groupName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllGroup();
      this.sharedService.getSettingsGroupList();
    });
  }

  // deleteGroup() {
  //   this.isApiCalling = true;
  //   this.http.deleteGroup(this.groupId).subscribe(
  //     (data: any) => {
  //       this.toastr.error("Group Delete Successfully", "Success");
  //       this.closeAllModal();
  //       this.getAllGroup();
  //       this.isApiCalling = false;
  //     }, err => {
  //       this.toastr.error("Oops! Something went wrong", 'Error');
  //       this.isApiCalling = false;
  //       this.closeAllModal();
  //     }
  //   )
  // }
  

  closeAllModal() {
    this.dialog.closeAll();
  }
}
