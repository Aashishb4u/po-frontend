import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {ButtonViewComponent, createPurchaseOrder} from './createPurchaseOrder.component';
import {routing}       from './createPurchaseOrder.routing';
import {ModalModule} from 'ng2-modal';
import {Ng2SmartTableModule} from "ng2-smart-table";
import {NgxPaginationModule} from 'ngx-pagination'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        routing,
        NgxPaginationModule,
        ModalModule,
        ReactiveFormsModule,
        Ng2SmartTableModule
    ],
    declarations: [
        createPurchaseOrder, ButtonViewComponent
    ],
    entryComponents: [
        ButtonViewComponent
    ],
    providers: []
})
export class createPurchaseOrderModule {
}
