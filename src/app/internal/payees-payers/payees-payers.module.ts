import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { AuthGuardService } from 'src/app/services/authguard.service';
import {SharedModule} from '../../shared/modules/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { PayeesPayersComponent } from './payees-payers.component';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: PayeesPayersComponent,
                canActivate: [AuthGuardService],
                data: {title: 'Categories'},
            }
        ]
    }
];

@NgModule({
    declarations: [
        PayeesPayersComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes),
        MatExpansionModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class PayessPayersModule {
}