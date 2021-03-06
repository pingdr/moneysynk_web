import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { dataUri } from '@rxweb/reactive-form-validators';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';
import { LogoutModalComponent } from 'src/app/shared/modals/logout-modal/logout-modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
declare var $: any

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
  // status1:boolean=false

  clickEventsubscription: Subscription;

  constructor(public http: HttpService,
    private toastr: ToastrService,
    public sharedserive: SharedService,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('loginData'));

    this.clickEventsubscription = this.sharedService.deleteEditGroupChange.subscribe((data) => {
      if (data) {
        this.getAllGroup();
      } else{
        this.getAllGroup();
      }
    })
    this.getActivatedRoute();
  }

  openSpaghettiPanel() {

  }

  Logout() {
    const dialogRef = this.dialog.open(LogoutModalComponent, {
      panelClass: 'account-modal-main',
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addGroup(value) {
    this.group = value;
  }

  saveGroup() {

    if (this.group != '') {

      // if (!isNaN(this.group)) {
      //   this.toastr.error('only number is not allow', 'error', {
      //     timeOut: 2000
      //   });
      //   return;
      // }


      var regex = new RegExp("[a-zA-Z][a-zA-Z ]*");

      if (!regex.test(this.group)) {
        this.toastr.error('Please enter valid group name', 'Invalid');
      } else {

        var payload = {
          "name": this.group
        }

        this.http.addGroup(ApiUrl.addGrop, payload, false)
          .subscribe(res => {
            let response = res;
            if (response.statusCode == 200) {
              this.filterName = '';
              this.toastr.success('Group added successfully', 'success', {
                timeOut: 2000
              });

              this.getAllGroup();
              this.sharedService.addGroup(true);
              // this.sharedService.getSettingsGroupList();
            }

          });
      }

    } else {
      this.toastr.error('Please enter group name');
    }

  }

  getAllGroup() {
    this.http.getAllGroup(ApiUrl.addGrop).subscribe(res => {
      if (res.data != undefined) {
        this.groupList = res.data;
        this.selectedGroup(this.groupList);
        // this.sharedserive.groupUpdateData(this.groupList[0]._id);
      }
    });
  }

  selectedGroup(groupData) {
    if (localStorage.getItem('selectedGroupId')) {
      for (let index = 0; index < groupData.length; index++) {
        if (localStorage.getItem('selectedGroupId') == groupData[index]._id) {
          this.modeselect = groupData[index]._id;
          this.sharedserive.groupUpdateData(this.modeselect);
        }
      }
    } else {
      this.modeselect = groupData[0]._id;
      this.sharedserive.groupUpdateData(this.modeselect);
    }
  }

  groupSelect(value) {
    this.groupName = value.name;
    this.groupName = value._id;
    this.sharedserive.groupUpdateData(value._id);
    localStorage.setItem('selectedGroupId', value._id);
  }


  getActivatedRoute() {
    let activatedUrl: any = this.router.url;
  }

  searchData(event: any) {
    let activatedUrl: any = this.router.url;
  if(event.target.value==''){
    let searchValue = {
      search:event.target.value,
      flag:false
    };
    this.sharedService.searchData(searchValue);
  }else {

    let searchValue = {
      search:event.target.value,
      flag:true
    };
    this.sharedService.searchData(searchValue);

  }
  

  

    // switch (activatedUrl) {
    //   case '/accounts':
    //     console.log('1 accounts')
    //     this.sharedService.searchData(searchValue);
    //     break;
    //   case '/categories':
    //     console.log('2 categories')
    //     this.sharedService.searchData(searchValue);
    //     break;
    //   case '/payees':
    //     console.log('3 payees')
    //     this.sharedService.searchData(searchValue);
    //     break;
    //   case '/budget':
    //     console.log('4 budget')
    //     this.sharedService.searchData(searchValue);
    //     break;
    //   case '/spliwise':
    //     console.log('4 budget')
    //     break;
    //   default:
    //     break;
    // }
  }

  // alert(){
  //   this.status1=true;
  // }
  special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));


  }



}
