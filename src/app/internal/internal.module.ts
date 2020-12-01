import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClickOutsideModule} from 'ng-click-outside';
import {ChartsModule} from 'ng2-charts';
import {RouterModule, Routes} from '@angular/router';
import { InternalComponent } from './internal.component';
import {SharedModule} from '../shared/modules/shared.module';
import { HeaderComponent } from '../base/controls/header/header.component';
import { SidebarComponent } from '../base/controls/sidebar/sidebar.component';
import { FooterComponent } from '../base/controls/footer/footer.component';
import {BsModalRef, BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import { EventEmitterService } from '../services/event-emitter.service';






const routes: Routes = [{
    path: '', component: InternalComponent,
    children: [
        {
            path: 'reports',
            loadChildren: () => import('./reports/reports.module').then(m => m.ReportModule)
        },
        {
            path: 'accounts',
            loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountModule)
        },
        {
            path: 'categories',
            loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
        }, 
        {
            path: 'payees',
            loadChildren: () => import('./payees-payers/payees-payers.module').then(m => m.PayessPayersModule)
        }, 
        {
            path: 'budget',
            loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule)
        },
        {
            path: 'bill',
            // loadChildren: () => import('./bill/bill.module').then(m => m.BillModule)
            loadChildren: () => import('./add-bill/add-bill.module').then(m => m.AddBillModule)
        }, 
        {
            path: 'transactions',
            loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule)
        },
        {
            path: 'settings',
            loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
        },
        {
            path: 'spliwise',
            loadChildren: () => import('./splitwise/splitwise.module').then(m => m.SplitwiseModule)
        },
        {
            path: 'add-entry',
            loadChildren: () => import('./add-entry/add-entry.module').then(m => m.AddEntryModule)
        }
    ]
}];

@NgModule({
    imports: [
        SharedModule,
        ChartsModule,
        ClickOutsideModule,
        CommonModule,
        RouterModule.forChild(routes),
        ModalModule.forRoot(),
        MatSelectModule,
        MatOptionModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule
    
    ],
        

        
        
        
   
    exports: [],
    declarations: [
        InternalComponent,
        HeaderComponent,
        SidebarComponent,
        FooterComponent,
      
      
        
    ],
    providers:[
        EventEmitterService
    ]
})
export class InternalModule {
    constructor(){
    }
}
