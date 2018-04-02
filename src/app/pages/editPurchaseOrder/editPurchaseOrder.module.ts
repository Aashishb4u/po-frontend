import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {editPurchaseOrder} from './editPurchaseOrder.component';
import {routing}       from './editPurchaseOrder.routing';
import {ModalModule} from 'ng2-modal';
import {Ng2SmartTableModule} from "ng2-smart-table";
import {DataTableModule} from 'angular2-datatable';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        DataTableModule,
        routing,
        TextMaskModule,
        ModalModule,
        ReactiveFormsModule,
        Ng2SmartTableModule,
    ],
    declarations: [
        editPurchaseOrder,
    ],
    providers: [],
})
export class editPurchaseOrderModule {
}
