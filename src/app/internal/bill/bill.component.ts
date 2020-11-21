import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AddBillComponent } from 'src/app/shared/modals/add-bill/add-bill.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {

  groupId: any;
  isApiCalling: boolean = false;

  @ViewChild('deletePayeeDialog') DeletePayeeDialog: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    public sharedserive: SharedService
  ) { }

  ngOnInit(): void {
    this.sharedserive.groupChange.subscribe((data) => {
      this.groupId = data;

    });
  }

  openEditmodal() {
    const dialogRef = this.dialog.open(AddBillComponent, {
      width: '976px',
      panelClass: 'edit-account-main', data: { groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.getBudgets();
    });
  }

}
