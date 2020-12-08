import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { dataUri } from '@rxweb/reactive-form-validators';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { LogoutModalComponent } from 'src/app/shared/modals/logout-modal/logout-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any;
  group: any;
  groupList = [];
  groupName: any;
  filterName: any;
  public modeselect: any;

  clickEventsubscription: Subscription;

  constructor(public http: HttpService,
    private toastr: ToastrService,
    public sharedserive: SharedService,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('loginData'));

    this.clickEventsubscription = this.sharedService.deleteEditGroupChange.subscribe((data) => {
      console.log('subscribe Data', data);
      if (data) {
        this.getAllGroup();
      }
    })

    this.getAllGroup();
    
  }

  Logout() {
    const dialogRef = this.dialog.open(LogoutModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  addGroup(value) {
    this.group = value;
  }

  saveGroup() {
    this.filterName = '';

    if (this.group != null) {

      var payload = {

        "name": this.group

      }

      this.http.addGroup(ApiUrl.addGrop, payload, false)
        .subscribe(res => {
          let response = res;
          if (response.statusCode == 200) {

            this.toastr.success('Group added successfully', 'success', {
              timeOut: 2000
            });

            this.getAllGroup();
            this.sharedService.addGroup(true);
            // this.sharedService.getSettingsGroupList();
          }

        });

    } else {
      this.toastr.error('Please enter group name');
    }

  }

  getAllGroup() {
    this.http.getAllGroup(ApiUrl.addGrop).subscribe(res => {
      console.log(res);
      if (res.data != undefined) {
        this.groupList = res.data;
        this.selectedGroup(this.groupList);
        this.sharedserive.groupUpdateData(this.groupList[0]._id);
      }
    });
  }

  selectedGroup(groupData) {
    if (localStorage.getItem('selectedGroupId')) {
      for (let index = 0; index < groupData.length; index++) {
        console.log(groupData[index]);
        if (localStorage.getItem('selectedGroupId') == groupData[index]._id) {
          this.modeselect = groupData[index]._id;
        }
      }
    } else {
      this.modeselect = groupData[0]._id;
    }
  }

  groupSelect(value) {
    this.groupName = value.name;
    this.groupName = value._id;
    this.sharedserive.groupUpdateData(value._id);
    localStorage.setItem('selectedGroupId', value._id);
  }

}
