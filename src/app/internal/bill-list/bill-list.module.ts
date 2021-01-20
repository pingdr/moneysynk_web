import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BillListComponent } from './bill-list.component';
import { AuthGuardService } from 'src/app/services/authguard.service';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';



const routes: Routes = [
  {
    path: '', children: [
      {
        path: '',
        component: BillListComponent,
        canActivate: [AuthGuardService],
        data: { title: 'Bill-list' },
      }
    ]
  }
];



@NgModule({
  declarations: [BillListComponent],
  imports: [
    SharedModule,
    MatProgressBarModule,
    MatDatepickerModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatButtonModule,
    MatPaginatorModule,
    NgxShimmerLoadingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BillListModule { }
