import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OnlynumberDirectiveDirective } from 'src/app/onlynumber-directive.directive';


const entryList = [];

const importExportList = [
    ReactiveFormsModule, FormsModule
];

@NgModule({
    imports: [
        CommonModule,
        MatProgressBarModule,
        ...importExportList
    ],
    declarations: [
        ProgressBarComponent,
        OnlynumberDirectiveDirective,
        SharedComponent, ...entryList],
    exports: [
        SharedComponent,
        ProgressBarComponent,
        CommonModule,
        MatProgressBarModule,
        OnlynumberDirectiveDirective,
        ...importExportList,
        ...entryList,
    ],
    entryComponents: [...entryList]
})
export class SharedModule {
}
