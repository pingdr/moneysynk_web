import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeGroupListFunction = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

  onGroupListSelect() {
    this.invokeGroupListFunction.emit();
  }
}
