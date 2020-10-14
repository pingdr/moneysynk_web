import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedComponent} from './shared.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


const entryList = [];

const importExportList = [
    ReactiveFormsModule, FormsModule
];

@NgModule({
    imports: [
        CommonModule,
        ...importExportList
    ],
    declarations: [
        SharedComponent, ...entryList],
    exports: [
        SharedComponent,
        CommonModule,
        ...importExportList,
        ...entryList,
    ],
    entryComponents: [...entryList]
})
export class SharedModule {
}
