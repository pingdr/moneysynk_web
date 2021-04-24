import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ReportsComponent } from './reports.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';
import { AuthGuardService as AuthGuard } from 'src/app/services/authguard.service';
import {SharedModule} from '../../shared/modules/shared.module';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: ReportsComponent,
                canActivate: [AuthGuard],
                data: {title: 'Reports'},
            }
        ]
    }
];

@NgModule({
    declarations: [
        ReportsComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        ChartsModule,
        NgxChartsModule,
        RouterModule.forChild(routes),
    ],
    
})

export class ReportModule {
    constructor(){
    }
}
