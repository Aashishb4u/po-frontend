import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {AddOffering} from './addOffering.component';
import {routing}       from './addOffering.routing';
import {ModalModule} from 'ng2-modal';
import {Ng2SmartTableModule} from "ng2-smart-table";
import {MyDatePickerModule} from 'mydatepicker';
// import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        routing,
        ModalModule,
        MyDatePickerModule, 
        ReactiveFormsModule,
        Ng2SmartTableModule,
        // CKEditorModule
    ],
    declarations: [
        AddOffering
    ],
    providers: []
})
export class AddOfferingModule {
}
