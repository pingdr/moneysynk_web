import { Injectable, ChangeDetectorRef, ApplicationRef } from "@angular/core";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { debounceTime, delay } from "rxjs/operators";
import { of, timer, Scheduler } from "rxjs";

@Injectable()
export class TestService {
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder) {}

  initializeForm() {
    timer(1)
      .pipe(debounceTime(5000))
      .subscribe(_ => {
        console.log("hello");
        this.myForm = this.fb.group({
          name: "Test",
          phone: "+972543424621"
        });
      });
  }
}
