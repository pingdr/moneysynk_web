import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './external/login/login.component';
import { SignupComponent } from './external/signup/signup.component';
import {ExternalAuthguardService} from './services/externalAuthguard.service';

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent, canActivate: [ExternalAuthguardService]},
    {path: 'signup', component: SignupComponent},
    {path: '', loadChildren: () => import('./internal/internal.module').then(m => m.InternalModule)}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
