import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
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
  constructor(public http: HttpService,
    private toastr: ToastrService,
    public sharedserive: SharedService,
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('loginData'));
    this.getAllGroup();

    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeGroupListFunction.subscribe(() => {
        this.getAllGroup();
      });
    }
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

          }

        });

    } else {
      alert('please add group')
    }
  }

  getAllGroup() {

    this.http.getAllGroup(ApiUrl.addGrop).subscribe(res => {
      if (res.data != undefined) {
        this.groupList = res.data;
        this.selectedGroup(this.groupList);
        // this.modeselect = this.groupList[0]._id;
        this.sharedserive.groupUpdateData(this.groupList[0]._id);
        // this.sharedserive.groupUpdateData.next();
      }
    });
  }

  selectedGroup(groupData) {
    if (localStorage.getItem('selectedGroupId')) {
      for (let index = 0; index < groupData.length; index++) {
        console.log(groupData[index]);
        if(localStorage.getItem('selectedGroupId')==groupData[index]._id){
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
