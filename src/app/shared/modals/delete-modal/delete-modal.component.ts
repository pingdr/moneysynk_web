import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiurl';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public http: HttpService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  hideModal() {
    this.dialogRef.close(this.dialogRef);
  }

  delete(type) {
    switch (type) {
      case 'deleteAccountType':
        this.accountDelete();
        break;
      case 'deleteAccount':
        this.accountDelete();
        break;
      case 'deleteCategory':
        this.deleteCategory();
        break;
      case 'deletePayee':
        this.deletePayee()
        break;
      case 'deletePayer':
        this.deletePayee()
        break;
      case 'deleteBudget':
        this.deleteBudget()
        break;
      case 'deleteGroup':
        this.deleteGroup()
        break;
      case 'deleteTransaction':
        this.deleteTransaction();
        break;
      case 'deleteClass':
        this.deleteClass();
        break;
      default:
        break;
    }
  }


  accountDelete() {
    if (this.data.type == 'deleteAccountType') {
      this.http.deleteAccountTypes(ApiUrl.deleteAccountTypes, this.data.id, false).subscribe(res => {
        this.toastr.error('Account type deleted successfully', 'success', {
          timeOut: 2000
        });
        this.hideModal();

      }, () => {
        this.toastr.error('Something went wrong', 'OOPS!');
        this.hideModal();

      });
    } else {
      this.http.deleteAccount(ApiUrl.deleteAccount, this.data.id, false).subscribe(res => {
        this.toastr.error('Account deleted successfully', 'success', {
          timeOut: 2000
        });
        this.hideModal();
        this.router.navigateByUrl('/accounts');
      }, () => {
        this.toastr.error('Something went wrong', 'OOPS!');
        this.hideModal();
      });
    }

  }


  deleteCategory() {
    this.http.deleteCategory(this.data.id).subscribe(
      (data: any) => {
        this.toastr.error("Category Delete Successfully", "Success");
        this.hideModal();
      }, err => {
        this.toastr.error("Oops! Something went wrong", 'Error');
        this.hideModal();
      }
    )
  }

  deletePayee() {
    let successMessage: any = '';

    if (this.data.type == 'deletePayee') {
      successMessage = 'Payee deleted successfully';
    } else {
      successMessage = 'Payer deleted successfully';
    }

    this.http.deletePayees(this.data.id).subscribe(
      (data: any) => {
        this.toastr.error(successMessage, "Success");
        this.hideModal();
      }, err => {
        this.toastr.error("Oops! Something went wrong", 'Error');
        this.hideModal();
      }
    )
  }

  deleteBudget() {
    this.http.deleteAccount(ApiUrl.getBudget, this.data.id).subscribe(
      (data: any) => {
        this.toastr.error("Budget Delete Successfully", "Success");
        this.hideModal();
      }, err => {
        this.toastr.error("Oops! Something went wrong", 'Error');
        this.hideModal();
      }
    )
  }

  deleteGroup() {
    this.http.deleteGroup(this.data.id).subscribe(
      (data: any) => {
        this.toastr.error("Group Delete Successfully", "Success");
        this.hideModal();
      }, err => {
        this.toastr.error("Oops! Something went wrong", 'Error');
        this.hideModal();
      }
    )
  }

  deleteTransaction() {
    this.http.deleteTransaction(this.data.id).subscribe((data: any) => {
      this.toastr.error("Transaction Delete Successfully", "Success");
      this.hideModal();
    }, err => {
      this.toastr.error("Oops! Something went wrong", 'Error');
      this.hideModal();
    })
  }

  deleteClass() {
    this.http.deleteClasses(this.data.id).subscribe((data: any) => {
      this.toastr.error("Class Delete Successfully", "Success");
      this.hideModal();
    }, err => {
      this.toastr.error("Oops! Something went wrong", 'Error');
      this.hideModal();
    })
  }

}
