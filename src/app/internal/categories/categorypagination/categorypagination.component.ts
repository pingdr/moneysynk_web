import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { transactionLists } from 'src/app/services/CustomPaginatorConfiguration';

@Component({
  selector: 'app-categorypagination',
  templateUrl: './categorypagination.component.html',
  styleUrls: ['./categorypagination.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: transactionLists() }
  ]
})
export class CategorypaginationComponent implements OnInit {

  @Input('length') length: string;
  @Input('pageSize') pageSize: number;

  @Output() page = new EventEmitter<String>();
  
  constructor() { }

  ngOnInit(): void {
  }

  pageDetailChange(event) {
    this.page.emit(event);
  }
}

