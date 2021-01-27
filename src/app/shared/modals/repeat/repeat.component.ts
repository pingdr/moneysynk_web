import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss']
})
export class RepeatComponent implements OnInit {


  bsInlineValue = new Date();

  days:number[]=[];

  months:string[]=["January","February","March","April","May","June","July",
  "August","September","October","November","December"];

  constructor() {
    for(let i=1; i<=31;i++){
      this.days.push(i);
    }
   
   }

  ngOnInit(): void {
  }


  multiselect(btn:HTMLButtonElement) {
    if(btn.classList.contains('active')) {
      btn.classList.remove('active');
    }else {
    btn.classList.add('active')
    }
  }

}
