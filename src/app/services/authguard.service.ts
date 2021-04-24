import {Injectable} from '@angular/core';
import {Router, CanActivate, CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanDeactivate<CanComponentDeactivate> {
    
    constructor(
        public router: Router
    ) {
      
    }

    

    canActivate(): boolean {
        console.log('in can activate')
        if (!this.isAuthenticated()) {
            console.log('in if..............')
            this.router.navigate(['login']);
            return false;
        }
        
        return true;
    }

    canDeactivate(component: CanComponentDeactivate) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        return !!token;
    }
}
