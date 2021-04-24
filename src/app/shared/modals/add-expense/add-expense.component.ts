import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {

  Addaccountentry: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { 
    this.Addaccountentry = this.formBuilder.group({
      // title: ['', Validators.required],
      amount:['', Validators.required],
      categoryname: ['', Validators.required],
      // Icon: ['', Validators.required],
      Parentcategory: ['', Validators.required],
      Grouptype: ['', Validators.required],
      Addmembers: ['', Validators.required],
      Opendate: ['', Validators.required],
      
    });
    
  }
  
  get f() { return this.Addaccountentry.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.Addaccountentry.invalid) {
            return;
        }

        // display form values on success
        // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.editaccount.value, null, 4));
    }



  ngOnInit(): void {
  }

}
