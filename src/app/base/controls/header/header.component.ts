import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';


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
  constructor(public http: HttpService,private toastr: ToastrService) { }

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

        "name": this.group,
        "icon": this.group

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
        this.groupName=this.groupList[0].name;
        localStorage.setItem('group_id', this.groupList[0]._id);

     
      }
    });

  }
  groupSelect(value){
   
    this.groupName=value.name;
    localStorage.setItem('group_id', value._id);

  
  }

 

}
