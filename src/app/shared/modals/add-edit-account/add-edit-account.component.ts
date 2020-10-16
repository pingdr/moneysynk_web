import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountsComponent } from 'src/app/internal/accounts/accounts.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-account',
  templateUrl: './add-edit-account.component.html',
  styleUrls: ['./add-edit-account.component.scss']
})
export class AddEditAccountComponent implements OnInit {
  selected = 'option2';
  editaccount: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    
    this.editaccount = this.formBuilder.group({
      // title: ['', Validators.required],
      Accountname: ['', Validators.required],
      Accoutnumber: ['', Validators.required],
      Usddollar: ['', Validators.required],
      Openingbalance: ['', Validators.required],
      Phonenumber: ['', Validators.required],
      Asset: ['', Validators.required],
      Website: ['', Validators.required],
      Icon: ['', Validators.required],
      Note: ['', Validators.required],
      Opendate: ['', Validators.required]
      // lastName: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]],
      // confirmPassword: ['', Validators.required],
      // acceptTerms: [false, Validators.requiredTrue]
    });
   }

   get f() { return this.editaccount.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.editaccount.invalid) {
            return;
        }

        // display form values on success
        // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.editaccount.value, null, 4));
    }





  ngOnInit(): void {
    
  }
  
 
  // ----Popup-close----------//

   
}