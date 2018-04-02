import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {addVendor} from './addVendor.component';
import {routing} from './addVendor.routing';
import {RlTagInputModule} from 'angular2-tag-input';
import { TextMaskModule } from 'angular2-text-mask';
import {ModalModule} from 'ng2-modal';
import {DataTableModule} from 'angular2-datatable';
import { CKEditorModule } from 'ng2-ckeditor';
import {NgxPaginationModule} from 'ngx-pagination'
import {Ng2SmartTableModule} from "ng2-smart-table";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        ModalModule,
        routing,
        DataTableModule,
        RlTagInputModule,
        ReactiveFormsModule,
        TextMaskModule,
        CKEditorModule,
        Ng2SmartTableModule,
        NgxPaginationModule,
    ],
    declarations: [
        addVendor
    ],
    providers: []
})
export class addVendorModule {
}
