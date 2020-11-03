import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  Addaccountentry: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { 
    this.Addaccountentry = this.formBuilder.group({
      // title: ['', Validators.required],
      categoryname: ['', Validators.required],
      // Icon: ['', Validators.required],
      Parentcategory: ['', Validators.required],
      Grouptype: ['', Validators.required],
      Addmembers: ['', Validators.required],
      
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
