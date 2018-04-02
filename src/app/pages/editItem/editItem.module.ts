import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {editItem} from './editItem.component';
import {routing}       from './editItem.routing';
import { TextMaskModule } from 'angular2-text-mask';
import {RlTagInputModule} from 'angular2-tag-input';
import {ModalModule} from 'ng2-modal';
import {Ng2SmartTableModule} from "ng2-smart-table";
import {MyDatePickerModule} from 'mydatepicker';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        ModalModule,
        RlTagInputModule,
        routing,
        NgxPaginationModule,
        MyDatePickerModule,
        ReactiveFormsModule,
        TextMaskModule,
        Ng2SmartTableModule
    ],
    declarations: [
        editItem
    ],
    providers: []
})
export class editItemModule {
}
