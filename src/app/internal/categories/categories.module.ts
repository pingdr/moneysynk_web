import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoriesComponent } from './categories.component';
import {Routes, RouterModule} from '@angular/router';
import { AuthGuardService } from 'src/app/services/authguard.service';
import {SharedModule} from '../../shared/modules/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: CategoriesComponent,
                canActivate: [AuthGuardService],
                data: {title: 'Categories'},
            }
        ]
    }
];

@NgModule({
    declarations: [
        CategoriesComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes),
        MatExpansionModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class CategoriesModule {
}