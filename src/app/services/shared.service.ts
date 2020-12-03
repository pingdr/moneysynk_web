import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  mobileVerificationComplete = new Subject();

  public mobile_number: any;
  public country_code: any;
  public groupChange = new BehaviorSubject<any>(null);
  public groupChangeId = this.groupChange.asObservable();
  // private subject = new Subject<any>();
  private subject = new BehaviorSubject<any>(null);

  constructor() { }


  groupUpdateData(data?) {
    this.groupChange.next(data ? data : false);
  }

  /**
   * The following function(getSettingsGroupList,getClickEvent) is to get group list after add group from header 
   */

  getSettingsGroupList() {
    this.subject.next(null);
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
