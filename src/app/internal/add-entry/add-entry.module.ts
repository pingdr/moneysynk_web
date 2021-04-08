import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/services/authguard.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { AddEntryComponent } from './add-entry.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker'

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: AddEntryComponent,
                canActivate: [AuthGuardService],
                data: { title: 'Settings' },
            }
        ]
    }
];

@NgModule({
    declarations: [
        AddEntryComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        RouterModule.forChild(routes),
        MatExpansionModule,
        MatButtonModule,
        SharedModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AddEntryModule {
}