import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBillComponent } from './add-bill.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/services/authguard.service';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';


const routes: Routes = [
  {
    path: '', children: [
      {
        path: '',
        component: AddBillComponent,
        canActivate: [AuthGuardService],
        data: { title: 'Bill' },
      }
    ]
  }
];


@NgModule({
  declarations: [AddBillComponent],
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
    MatButtonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddBillModule { }
