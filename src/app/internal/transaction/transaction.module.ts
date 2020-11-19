import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/services/authguard.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { TransactionComponent } from './transaction.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule, MatDateRangeInput } from '@angular/material/datepicker';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: TransactionComponent,
                canActivate: [AuthGuardService],
                data: { title: 'Budget' },
            }
        ]
    }
];

@NgModule({
    declarations: [
        TransactionComponent,
    ],
    imports: [
        SharedModule,
        MatProgressBarModule,
        MatDatepickerModule,
        CommonModule,
        RouterModule.forChild(routes),
        MatExpansionModule,
        MatButtonModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TransactionModule {
}