import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user:any;
  group:any;
  groupList=[];
  groupName:any;
  filterName:any;
  public modeselect:any;
  constructor(public http: HttpService,
    private toastr: ToastrService,
    public sharedserive:SharedService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('loginData'));
    this.getAllGroup();
  }

  Logout(){
    localStorage.clear();
    this.http.navigate('/login');
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

    }else{
      alert('please add group')
    }
  }

  getAllGroup(){

    this.http.getAllGroup(ApiUrl.addGrop).subscribe(res => {
      if (res.data != undefined) {
        this.groupList = res.data;
        this.modeselect=this.groupList[0]._id;
        this.sharedserive.groupUpdateData(this.groupList[0]._id);
        // this.sharedserive.groupUpdateData.next();
      

     
      }
    });

  }
  groupSelect(value){
   
    this.groupName=value.name;
    this.groupName=value._id;
    this.sharedserive.groupUpdateData(value._id);
  }

 

}
