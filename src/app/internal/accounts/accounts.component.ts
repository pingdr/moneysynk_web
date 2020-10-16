import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiUrl } from 'src/app/services/apiurl';
import { TableModel } from 'src/app/shared/models/table.common.model';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  myModel: TableModel;
  search = new FormControl();

  constructor(public http: HttpService,public activeRoute: ActivatedRoute) { 
    // this.myModel = new TableModel();
   
    // const tab = this.activeRoute.snapshot.queryParams.tab;
    // const search = this.activeRoute.snapshot.queryParams.search;

  }

  ngOnInit(): void {
   this.getAccoundata();
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  getAccoundata(){

  
    this.http.getAccount(ApiUrl.getAccount).subscribe(res => {
        this.myModel.data = res.data;
        console.log('this.myModel.data');
        console.log(this.myModel.data);
        this.myModel.loader = false;
    });
    
  }

}
