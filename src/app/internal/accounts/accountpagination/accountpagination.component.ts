import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { transactionLists } from 'src/app/services/CustomPaginatorConfiguration';

@Component({
  selector: 'app-accountpagination',
  templateUrl: './accountpagination.component.html',
  styleUrls: ['./accountpagination.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: transactionLists() }
  ]
})
export class AccountpaginationComponent implements OnInit {


  @Input('totalItems') totalItems: string;
  @Input('pageSize') pageSize: number;

  @Output() pageChange = new EventEmitter<String>();
  
  constructor() { }

  ngOnInit(): void {
  }

  accountDetailPageChange(event) {
    this.pageChange.emit(event);
  }
}
