import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/services/authguard.service';
import { SharedModule } from '../../shared/modules/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxSlickJsModule } from 'ngx-slickjs';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: AccountsComponent,
                canActivate: [AuthGuardService],
                data: { title: 'Accounts' },
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
        ChartsModule,
        NgxChartsModule,
        CommonModule,
        MatPaginatorModule,
        RouterModule.forChild(routes),
        MatExpansionModule,
        MatDialogModule,
        MatPaginatorModule,
        MatButtonModule,
        NgxSlickJsModule.forRoot({
            links: {
                jquery: "https://code.jquery.com/jquery-3.4.0.min.js",
                slickJs: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js",
                slickCss: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
                slickThemeCss: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"
            }
        })
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AccountModule {
}