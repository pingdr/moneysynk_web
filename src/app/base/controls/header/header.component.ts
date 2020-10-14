import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user:any;
  constructor(public http: HttpService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('loginData'));
  }

  Logout(){
    localStorage.clear();
    this.http.navigate('/login');
  }

}
