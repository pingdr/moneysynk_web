import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { DeleteModalComponent } from 'src/app/shared/modals/delete-modal/delete-modal.component';
import { EditGroupModalComponent } from 'src/app/shared/modals/edit-group-modal/edit-group-modal.component';
import { AddEditClassComponent } from 'src/app/shared/modals/add-edit-class/add-edit-class.component';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  isApiCalling: boolean = false;
  isShimmerloading: boolean = false;

  groupList: any = [];
  classes: any = [];
  groupId: any = '';
  selectedGroup: any = '';
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
    private sharedService: SharedService,
  ) {

    this.clickEventsubscription = this.sharedService.addGroupChange.subscribe(() => {
      this.getAllGroup();
    })

    this.sharedService.groupChange.subscribe((data) => {
      this.selectedGroup = data;
      if (data) {
        this.getClassList();
      }
    });
  }

  ngOnInit(): void {
    this.getAllGroup();

  }
  getAllGroup() {

    var payload = {
      pageIndex: this.pageIndex,
      limit: 10,
    }

    this.isShimmerloading = true;
    this.http.getAllGroup(ApiUrl.addGrop).subscribe(res => {
      this.isShimmerloading = false;
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

    if (id == this.selectedGroup) {
      if (this.toastr.currentlyActive) {
        return
      }
      this.toastr.error("Active group can't be deleted", 'Error');
      return
    }


    const dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'deleteGroup', title: 'Group', id: id, name: groupName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != 'no') {
        console.log('The dialog was closed');
        this.getAllGroup();
        this.sharedService.deleteEditGroup(true);
        // this.sharedService.getSettingsGroupList();
      }
    });
  }

  editGroup(id, groupName) {
    const dialogRef = this.dialog.open(EditGroupModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'editGroup', id: id, name: groupName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != 'no') {
        console.log('The dialog was closed');
        this.getAllGroup();
        this.sharedService.deleteEditGroup(true);
        // this.sharedService.getSettingsGroupList();
      }
    });
  }

  getClassList() {
    var payload = {
      "groupId": this.selectedGroup,
      // pageIndex: this.pageIndex,
      // limit: 20,
    }

    this.isApiCalling = true;
    this.http.getAccount(ApiUrl.classes, payload).subscribe(res => {
      this.isApiCalling = false;
      this.http.showLoader();
      if (res.data != undefined) {
        this.classes = res.data;
        // this.filter = res.data;
      }
    });
  }


  openAddGroupModal() {
    const dialogRef = this.dialog.open(EditGroupModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'AddGroup', data: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllGroup();
      this.sharedService.deleteEditGroup(true);
    });
  }

  openAddClassModal() {
    const dialogRef = this.dialog.open(AddEditClassComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'AddClass', groupId: this.selectedGroup }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != 'no') {
        console.log('The dialog was closed');
        this.getClassList();
      }
    });
  }

  editClassModal(id, className) {
    const dialogRef = this.dialog.open(AddEditClassComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'AddClass', groupId: this.selectedGroup, id: id, className: className }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != 'no') {
        console.log('The dialog was closed');
        this.getClassList();
      }
    });
  }

  deleteClass(id, className) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: { type: 'deleteClass', title: 'Class', id: id, name: className }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllGroup();
      this.sharedService.deleteEditGroup(true);
      // this.sharedService.getSettingsGroupList();
    });
  }

  closeAllModal() {
    this.dialog.closeAll();
  }
}
