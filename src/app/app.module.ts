import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './external/login/login.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './external/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailOtpComponent } from './shared/modals/email-otp/email-otp.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatInputModule } from '@angular/material/input';
import { EnterMobilenumComponent } from './shared/modals/enter-mobilenum/enter-mobilenum.component';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { VerifyMobileOtpComponent } from './shared/modals/verify-mobile-otp/verify-mobile-otp.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LoginLayoutComponent } from './base/layouts/login-layout/login-layout.component';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpService } from './services/http.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AsyncPipe } from '@angular/common';
import { ExternalAuthguardService } from './services/externalAuthguard.service';
import { InterceptorService } from './services/interceptor.service';
import { AccountModule } from './internal/accounts/accounts.module';
import { SharedService } from './services/shared.service';
import { ForgotPasswordComponent } from './shared/modals/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './shared/modals/change-password/change-password.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { AddEditAccountComponent } from './shared/modals/add-edit-account/add-edit-account.component';
import { OnlynumberDirectiveDirective } from './onlynumber-directive.directive';
import { AddCategoryPopupComponent } from './shared/modals/add-category-popup/add-category-popup.component';
import { AddPayeeComponent } from './shared/modals/add-payee/add-payee.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddBudgetModalComponent } from './shared/modals/add-budget-modal/add-budget-modal.component';
import { AddGroupComponent } from './shared/modals/add-group/add-group.component';
import { AddExpenseComponent } from './shared/modals/add-expense/add-expense.component';
import { DeleteModalComponent } from './shared/modals/delete-modal/delete-modal.component';
import { TransferModalComponent } from './shared/modals/transfer-modal/transfer-modal.component';
import { EditGroupModalComponent } from './shared/modals/edit-group-modal/edit-group-modal.component';
import { LogoutModalComponent } from './shared/modals/logout-modal/logout-modal.component';
import { SharedModule } from './shared/modules/shared.module';
import { AddEditClassComponent } from './shared/modals/add-edit-class/add-edit-class.component';
import { CookieService } from 'angular2-cookie/services/cookies.service'
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { RepeatComponent } from './shared/modals/repeat/repeat.component'
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    EmailOtpComponent,
    EnterMobilenumComponent,
    VerifyMobileOtpComponent,
    LoginLayoutComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    AddEditAccountComponent,
    AddCategoryPopupComponent,
    AddPayeeComponent,
    AddBudgetModalComponent,
    AddGroupComponent,
    AddExpenseComponent,
    DeleteModalComponent,
    TransferModalComponent,
    EditGroupModalComponent,
    LogoutModalComponent,
    AddEditClassComponent,
    RepeatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccountModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgOtpInputModule,
    NgxMatIntlTelInputModule,
    MatInputModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ChartsModule,
    NgxChartsModule,
    MatTabsModule,
    MatExpansionModule,
    HttpClientModule,
    MatSnackBarModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatOptionModule,
    BrowserModule,
    RouterModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatProgressBarModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot()
  ],
  entryComponents: [
    EmailOtpComponent,
    EnterMobilenumComponent,
    VerifyMobileOtpComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    AddCategoryPopupComponent,
    AddPayeeComponent,
    AddBudgetModalComponent,
    RepeatComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    HttpService,
    SharedService,
    AsyncPipe,
    ExternalAuthguardService,
    Title,
    CookieService
  ],
  bootstrap: [AppComponent],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class AppModule {

  constructor() {
  }

}
