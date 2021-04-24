import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { transactionLists } from 'src/app/services/CustomPaginatorConfiguration';

@Component({
  selector: 'app-budgetpagination',
  templateUrl: './budgetpagination.component.html',
  styleUrls: ['./budgetpagination.component.scss'],

 providers: [
    { provide: MatPaginatorIntl, useValue: transactionLists() }
  ]
})
export class BudgetpaginationComponent implements OnInit {

  @Input('length') length: string;
  @Input('pageSize') pageSize: number;

  @Output() page = new EventEmitter<String>();
  
  constructor() { }

  ngOnInit(): void {
  }

  budgetPageChangeDetail(event) {
    this.page.emit(event);
  }
}


