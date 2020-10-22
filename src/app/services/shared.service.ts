import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  mobileVerificationComplete = new Subject();

  public mobile_number:any;
  public country_code:any;
  public groupChange = new BehaviorSubject<any>(null);
  public groupChangeId = this.groupChange.asObservable();


  constructor() { }


  groupUpdateData(data?) {
    this.groupChange.next(data ? data : false);

}
}
