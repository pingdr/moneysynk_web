import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss']
})
export class RepeatComponent implements OnInit {


  bsInlineValue = new Date();
  weekName: string

  daysData:string[]=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  days: number[] = [];

  daysNumber: number

  monthName:string

  dayNames:string

  months: string[] = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

  constructor() {
    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }

  }

  ngOnInit(): void {

    // day name  
    var d = new Date();
    this.dayNames = this.daysData[d.getDay()];

    //date 

    let date = JSON.stringify(d)
    date = date.slice(1, 11)

    var arr1 = date.split(/[\s|-]/g);;

    this.daysNumber = parseInt(arr1[2])

    //month
  const month = d.toLocaleString('default', { month: 'long' });
  this.monthName = month


  }


  multiselect(btn: HTMLButtonElement) {
    if (btn.classList.contains('active')) {
      btn.classList.remove('active');
    } else {
      btn.classList.add('active')
    }
  }

  multiselect1(btn: HTMLButtonElement) {
    if (btn.classList.contains('weekName')) {
      btn.classList.remove('weekName');
    } else {
      btn.classList.add('weekName')
    }
  }

}
