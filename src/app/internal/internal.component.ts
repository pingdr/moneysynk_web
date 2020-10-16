import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from '../services/http.service';
import { AddEditAccountComponent } from '../shared/modals/add-edit-account/add-edit-account.component';




@Component({
    selector: 'app-internal',
    templateUrl: './internal.component.html'
})
export class InternalComponent {

    subscription: Subscription;
    loading = true;

    public constructor(public router: Router, public http: HttpService) {
        this.subscription = this.http.modalStatus.subscribe(modalName => {
            this.openPopup(modalName);
        });
        this.subscription = this.http.loaderStatus.subscribe(status => {
            this.loading = status;
        });
    }

    openPopup(data) {
        if (data) {
            const obj: any = {};
            switch (data.name) {
                case 'add-edit-account':
                    this.http.showModal(AddEditAccountComponent, 'lg');
                    break;
               
            }
        }
    }

   


}
