import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountsComponent } from './accounts.component';
import {Routes, RouterModule} from '@angular/router';
import { AuthGuardService } from 'src/app/services/authguard.service';
import {SharedModule} from '../../shared/modules/shared.module';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: AccountsComponent,
                canActivate: [AuthGuardService],
                data: {title: 'Accounts'},
            }
        ]
    }
];

@NgModule({
    declarations: [
        AccountsComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes),
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AccountModule {
}