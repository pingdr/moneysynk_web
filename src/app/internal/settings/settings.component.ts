import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  groupList:any=[];

  constructor(public http: HttpService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getAllGroup();
  }
  getAllGroup(){

    this.http.getAllGroup(ApiUrl.addGrop).subscribe(res => {
      if (res.data != undefined) {
        this.groupList = res.data;
      }
    });

  }
}
