import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/services/authguard.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { SettingsComponent } from './settings.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: SettingsComponent,
                canActivate: [AuthGuardService],
                data: { title: 'Settings' },
            }
        ]
    }
];

@NgModule({
    declarations: [
        SettingsComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatPseudoCheckboxModule,
        MatCheckboxModule,
        MatSelectModule,
        RouterModule.forChild(routes),
        MatExpansionModule,
        MatButtonModule,
        MatPaginatorModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SettingsModule {
}