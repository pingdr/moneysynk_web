import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/services/authguard.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { SplitwiseComponent } from './splitwise.component';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: SplitwiseComponent,
                canActivate: [AuthGuardService],
                data: { title: 'Settings' },
            }
        ]
    }
];

@NgModule({
    declarations: [
        SplitwiseComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes),
        MatExpansionModule,
        MatButtonModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SplitwiseModule {
}