import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

 

  chartOptions = {
    responsive: true,
    weight:4
  };

//  ----------------for first chart-----------//
  public doughnutChartLabels: string[] = ['Income', 'Expense'];
  public doughnutChartData: number[] = [100, 600];
  
  public donutColors: any[]= [
    {
      backgroundColor: [
        '#27AE60',
        '#FD4755',
        
    ]
    }
  ];
// ------------------account chart-------------//
public accountreportsLabels: string[] = ['Income'];
public accountreports: number[] = [600];
  
  public accountColors: any[]= [
    {
      backgroundColor: [
        'rgba(245, 184, 34, 0.3)',
          
    ]
    }
  ];
 
// ------------------categories chart-------------//
public categoriesLabel: string[] = ['Income', 'Expense'];
public categories: number[] = [100, 600];
  
  public categoriesColors: any[]= [
    {
      backgroundColor: [
        '#CA858B',
        '#8BC9D1',
          
    ],
    
    }
  ];

  // ------------------Payees chart-------------//
public payeesLabel: string[] = ['Income', 'Expense'];
public payees: number[] = [100, 600];
  
  public payeesColors: any[]= [
    {
      backgroundColor: [
        '#27AE60',
        '#FD4755',
          
    ],
    
    }
  ];

  // ------------------Bills by categories chart-------------//
public billsLabel: string[] = ['Income', 'Expense'];
public bills: number[] = [100, 600];
  
  public billsColors: any[]= [
    {
      backgroundColor: [
        '#CA858B',
        '#8BC9D1',
          
    ],
    
    }
  ];
  

  

}
