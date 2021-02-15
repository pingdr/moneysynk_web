import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/services/apiurl';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  Addaccountentry: FormGroup;
  submitted = false;
  groupId: any;
  subscribers: any = []
  member:any=[]

  constructor(private formBuilder: FormBuilder,public http: HttpService,public sharedserive: SharedService,private toastr: ToastrService,public dialogRef: MatDialogRef<AddGroupComponent>) { 

    this.subscribers.push(this.sharedserive.groupChange.subscribe((data) => {
      if (data) {
     
        this.groupId = data;

      }
    })
    )


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

             
        let payload={
          groupId:this.groupId,
          name:this.Addaccountentry.value.categoryname,
          currency:this.Addaccountentry.value.Parentcategory,
          groupType:'1st split wise group',
          member:this.Addaccountentry.value.Addmembers
         
        }


        this.http.addEditAccount(ApiUrl.addSplitWise, payload, false)
        .subscribe(response => {
          if (response.statusCode == 200) {
            this.toastr.success('Group added successfully', 'success', {
              timeOut: 2000
            });
            this.dialogRef.close();
          }
        },
          () => {
          
          });

    }



  ngOnInit(): void {
    this.getPayeePayers()
  }
  
 

  getPayeePayers(){
    var payload = {
      "groupId": this.groupId
    }
    this.http.get(ApiUrl.addEditPayee,payload).subscribe((res) => {
   this.member=res.data.data

   
    });
  }

}
