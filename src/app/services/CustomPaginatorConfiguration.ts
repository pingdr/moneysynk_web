import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Accounts per page:';

  return customPaginatorIntl;
}


export function Categories() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Categories per page:';

  return customPaginatorIntl;
}

export function Budget() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Budget per page:';

  return customPaginatorIntl;
}


export function transactionLists() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Transaction per page:';

  return customPaginatorIntl;
}

export function billperpage() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Bills per page:';

  return customPaginatorIntl;
}



